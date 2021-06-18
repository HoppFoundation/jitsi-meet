// @flow
import { getLogger } from 'jitsi-meet-logger';
import type { Dispatch } from 'redux';

import UIEvents from '../../../service/UI/UIEvents';
import {
    AUDIO_MUTE,
    createRemoteMuteConfirmedEvent,
    createToolbarEvent,
    sendAnalytics,
    VIDEO_MUTE
} from '../analytics';
import {
    MEDIA_TYPE,
    setAudioMuted,
    setVideoMuted,
    VIDEO_MUTISM_AUTHORITY
} from '../base/media';
import {
    getLocalParticipant,
    muteRemoteParticipant,
    kickParticipant
} from '../base/participants';

declare var APP: Object;

const logger = getLogger(__filename);

/**
 * Mutes the local participant.
 *
 * @param {boolean} enable - Whether to mute or unmute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @returns {Function}
 */
export function muteLocal(enable: boolean, mediaType: MEDIA_TYPE) {
    return (dispatch: Dispatch<any>) => {
        const isAudio = mediaType === MEDIA_TYPE.AUDIO;

        if (!isAudio && mediaType !== MEDIA_TYPE.VIDEO) {
            logger.error(`Unsupported media type: ${mediaType}`);

            return;
        }
        sendAnalytics(createToolbarEvent(isAudio ? AUDIO_MUTE : VIDEO_MUTE, { enable }));
        dispatch(isAudio ? setAudioMuted(enable, /* ensureTrack */ true)
            : setVideoMuted(enable, mediaType, VIDEO_MUTISM_AUTHORITY.USER, /* ensureTrack */ true));

        // FIXME: The old conference logic still relies on this event being emitted.
        typeof APP === 'undefined'
            || APP.UI.emitEvent(isAudio ? UIEvents.AUDIO_MUTED : UIEvents.VIDEO_MUTED, enable);
    };
}

/**
 * Mutes the remote participant with the given ID.
 *
 * @param {string} participantId - ID of the participant to mute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @returns {Function}
 */
export function muteRemote(participantId: string, mediaType: MEDIA_TYPE) {
    return (dispatch: Dispatch<any>) => {
        if (mediaType !== MEDIA_TYPE.AUDIO && mediaType !== MEDIA_TYPE.VIDEO) {
            logger.error(`Unsupported media type: ${mediaType}`);

            return;
        }
        sendAnalytics(createRemoteMuteConfirmedEvent(participantId, mediaType));
        dispatch(muteRemoteParticipant(participantId, mediaType));
    };
}

/**
 * Mutes all participants.
 *
 * @param {Array<string>} exclude - Array of participant IDs to not mute.
 * @param {MEDIA_TYPE} mediaType - The media type to mute.
 * @returns {Function}
 */
export function muteAllParticipants(exclude: Array<string>, mediaType: MEDIA_TYPE) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const localId = getLocalParticipant(state).id;
        const participantIds = state['features/base/participants']
            .map(p => p.id);

        /* eslint-disable no-confusing-arrow */
        participantIds
            .filter(id => !exclude.includes(id))
            .map(id => id === localId ? muteLocal(true, mediaType) : muteRemote(id, mediaType))
            .map(dispatch);
        /* eslint-enable no-confusing-arrow */
    };
}

/**
* Kicks the remote participant with the given ID.
*
* @param {string} participantId - ID of the participant to kick.
* @returns {Function}
*/
export function kickRemote(participantId: string) {
    return (dispatch: Dispatch<any>) => {
        sendAnalytics(createRemoteMuteConfirmedEvent(participantId));
        dispatch(kickParticipant(participantId));
    };
}

/**
* Kicks all participants.
*
* @param {Array<string>} exclude - Array of participant IDs to not mute.
* @returns {Function}
*/
export function kickAllParticipants(exclude: Array<string>) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const localId = getLocalParticipant(state).id;
        const participantIds = state['features/base/participants']
            .map(p => p.id);

        /* eslint-disable no-confusing-arrow */
        participantIds
            .filter(id => !exclude.includes(id))
            .map(id => id === localId ? kickParticipant(true) : kickParticipant(id))
            .map(dispatch);
        /* eslint-enable no-confusing-arrow */
    };
}