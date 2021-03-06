//
//  Queue.swift
//  jitsi-meet
//
//  Created by Varun Bansal on 29/06/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

protocol Queue {
  associatedtype Element
  //enqueue：add an object to the end of the Queue
  mutating func enqueue(_ element: Element)
  
  //dequeue：delete the object at the beginning of the Queue
  mutating func dequeue() -> Element?
  
  //isEmpty：check if the Queue is nil
  var isEmpty: Bool { get }
  
  //peek：return the object at the beginning of the Queue without removing it
  var peek: Element? { get }
}


struct QueueStack<T>: Queue {
  
  private var enqueuStack = [T]()
  private var dequeuStack = [T]()
  
  var isEmpty: Bool {
//    print("counts my lord \(dequeuStack.count) \(enqueuStack.count) \(dequeuStack.isEmpty && enqueuStack.isEmpty)");
    return dequeuStack.isEmpty && enqueuStack.isEmpty
  }
  
  var peek: T? {
    return !dequeuStack.isEmpty ? dequeuStack.last : enqueuStack.first
  }
  
  mutating func enqueue(_ element: T) {
//    print("pushing .....")
    enqueuStack.append(element)
//    print("counts my lord \(dequeuStack.count) \(enqueuStack.count)");
  }
  
  @discardableResult
  mutating func dequeue() -> T? {
    
    if self.isEmpty {
      return nil
    }
    if dequeuStack.isEmpty {
      dequeuStack = enqueuStack.reversed()
      enqueuStack.removeAll()
    }
    let data = dequeuStack.popLast();
    if (data != nil) {
      print(data)
    }
    return data
  }
}
