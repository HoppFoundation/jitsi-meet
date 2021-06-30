// @flow

import React from 'react';
import { Platform } from 'react-native';

import { connect } from '../../../base/redux';
import {
    getLocalParticipant,
    PARTICIPANT_ROLE
} from '../../../base/participants';

import ScreenSharingAndroidButton from './ScreenSharingAndroidButton.js';
import ScreenSharingIosButton from './ScreenSharingIosButton.js';

const ScreenSharingButton = props => (
    <>
        {Platform.OS === 'android'
            && <ScreenSharingAndroidButton { ...props } />
        }
        {Platform.OS === 'ios'
            && <ScreenSharingIosButton { ...props } />
        }
    </>
);

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ScreenSharingButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 * }}
 */
function _mapStateToProps(state): Object {
    const disabled = state['features/base/audio-only'].enabled;
    const _localParticipant = getLocalParticipant(state);
    const isModerator = _localParticipant.role === PARTICIPANT_ROLE.MODERATOR;
    const screenShareAllowed =Boolean(state['features/base/conference'].screenshare);

    const MODERATOR_KEYS = state['features/base/config'].HOPP_MODERATOR_KEYS;
    var visible_generally = true;

    if (MODERATOR_KEYS){
        visible_generally = visible_generally && (((isModerator|| screenShareAllowed)     && MODERATOR_KEYS.includes('desktop')) || !MODERATOR_KEYS.includes('desktop'));
    }
    
    return {
        visible: visible_generally,
        _disabled: disabled
    };
}

export default connect(_mapStateToProps)(ScreenSharingButton);
