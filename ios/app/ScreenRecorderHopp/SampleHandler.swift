//
//  SampleHandler.swift
//  ScreenRecorderHopp
//
//  Created by Varun Bansal on 05/06/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import ReplayKit
//import JitsiMeet
import Socket
import CoreVideo
import CoreMedia
import CoreImage


class SampleHandler: RPBroadcastSampleHandler {
  
  var serverSocket: Socket!
  var connSocket: Socket!
  var errorCount = 0
  var dropCount = 0
  
  override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
    // User has requested to start the broadcast. Setup info from the UI extension can be supplied but optional.
    print("broadcast started")
    let fileManager = FileManager.default
    do {
      serverSocket = try Socket.create(family: Socket.ProtocolFamily.unix, proto: Socket.SocketProtocol.unix)
      let sharedContainer = fileManager.containerURL(forSecurityApplicationGroupIdentifier: "group.de.hopp-foundation.screenrecording")
      print("started")
      do {
        print("listening start")
        let filePath = sharedContainer?.absoluteURL.appendingPathComponent("socketFDNN", isDirectory: false)
        print(fileManager.createFile(atPath: filePath?.path ?? "", contents: Data.init(count: 2), attributes: nil))
        try serverSocket.listen(on: filePath?.path ?? "/")
        let queue = DispatchQueue.global(qos: .userInteractive)
        print("got queue")
        queue.async { [unowned self] in
          do{
            print("checking for connectoni")
            self.connSocket = try self.serverSocket.acceptClientConnection()
            print("Accepted connection from: \(self.connSocket.remoteHostname) on port \(self.connSocket.remotePort)")
            print("Socket Signature: \(String(describing: self.connSocket.signature?.description))")
            //                try self.connSocket.write(from: "connection established")
          } catch {
            
          }
        }
      } catch let error {
        guard let socketError = error as? Socket.Error else {
          print("Unexpected error by connection at \(serverSocket.remoteHostname):\(serverSocket.remotePort)...")
          return
        }
        if true {
          print("Error reported by connection at \(serverSocket.remoteHostname):\(serverSocket.remotePort):\n \(socketError.description)")
        }
      }
    } catch {
      print("catch outside Error info: \(error)")
    }
  }
  
  override func broadcastPaused() {
    // User has requested to pause the broadcast. Samples will stop being delivered.
  }
  
  override func broadcastResumed() {
    // User has requested to resume the broadcast. Samples delivery will resume.
  }
  
  override func broadcastFinished() {
    // User has requested to finish the broadcast.
    print("closing socket")
    connSocket.close()
  }
  
  override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
    switch sampleBufferType {
    case RPSampleBufferType.video:
      if dropCount < 5 {
        dropCount+=1;
        return
      }
      
      dropCount = 0;
      
      print("processing video frame")
      // Handle video sample buffer
      let queue = DispatchQueue.global(qos: .default)
      queue.async { [unowned self] in
        do {
          let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)
          if imageBuffer != nil && self.connSocket != nil {
            CVPixelBufferLockBaseAddress(imageBuffer!, CVPixelBufferLockFlags.readOnly)
            let width = CVPixelBufferGetWidth(imageBuffer!)
            let height = CVPixelBufferGetHeight(imageBuffer!)
            if let orientationAttachment = CMGetAttachment(sampleBuffer, key: RPVideoSampleOrientationKey as CFString, attachmentModeOut: nil) as? NSNumber {
              let orientation = CGImagePropertyOrientation(rawValue: orientationAttachment.uint32Value)
              let cim = CIImage.init(cvPixelBuffer: imageBuffer!)
              let ccim = cim.transformed(by: CGAffineTransform(scaleX: 0.5, y: 0.5))
              let opts:[CIImageRepresentationOption:Float] = [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.4]
              let jpeg = CIContext.init(options: nil).jpegRepresentation(of: ccim, colorSpace: ccim.colorSpace!, options: opts)
              var byteArray: [UInt8] = [UInt8](jpeg!)
              print(byteArray.count)
              byteArray.append(orientationAttachment.uint8Value)
              print(byteArray.count)
              byteArray = byteArray + withUnsafeBytes(of: (height / 2).bigEndian, Array.init)
              print(byteArray.count)
              byteArray = byteArray + withUnsafeBytes(of: (width / 2).bigEndian, Array.init)
              print(byteArray.count)
              let data = Data(bytes: byteArray, count: byteArray.count)
              try self.connSocket.write(from: data)
            }
            
            
            //                  var rawImageData = Data("\(1920)_\(889)_\(b64IamgeData!)".utf8)
            //                    print("size \(rawImageData.count)")
            //                    try self.connSocket.write(from: rawImageData)
            //                  print(imageBuffer)
            //                      let currPixelBuffer = imageBuffer
            //                                      let nbytesPerRow = CGFloat(CVPixelBufferGetBytesPerRow(currPixelBuffer!))
            //                                      print("bytes per row \(nbytesPerRow)")
            //                                      let rawData = CVPixelBufferGetBaseAddress(currPixelBuffer!)
            //                                      let bufSize = CVPixelBufferGetDataSize(currPixelBuffer!)
            //                                      print("buf size while writing \(bufSize)")
            //                                      let data = Data.init(bytes: rawData!, count: bufSize)
            
            //                      try self.connSocket.write(from: data)
            CVPixelBufferUnlockBaseAddress(imageBuffer!, CVPixelBufferLockFlags.readOnly)
          } else {
            print("image buffer was nil")
          }
        } catch {
          print("error while writing in process buffer \(error)")
          if (self.errorCount > 5) {
            print("stopping broadcast")
            let errorMsg = [NSLocalizedFailureReasonErrorKey: "Der Anruf ist beendet!"]
            self.finishBroadcastWithError(NSError(domain: "ScreenRec", code: -1, userInfo: errorMsg))
          }
          self.errorCount = self.errorCount + 1
        }
      }
      break
    case RPSampleBufferType.audioApp:
      // Handle audio sample buffer for app audio
      break
    case RPSampleBufferType.audioMic:
      // Handle audio sample buffer for mic audio
      break
    @unknown default:
      // Handle other sample buffer types
      fatalError("Unknown type of sample buffer")
    }
  }
}
