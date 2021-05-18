/* @flow */

import React from 'react';

import { translate } from '../../../base/i18n';
import { IconCrown } from '../../../base/icons';
import { connect } from '../../../base/redux';
import AbstractRevokeScreenshareButton, {
    _mapStateToProps,
    type Props
} from '../AbstractRevokeScreenshareButton';

import RemoteVideoMenuButton from './RemoteVideoMenuButton';

declare var interfaceConfig: Object;

/**
 * Implements a React {@link Component} which displays a button for revoking
 * moderator to a participant.
 */
class RevokeScreenshareButton extends AbstractRevokeScreenshareButton {
    /**
     * Instantiates a new {@code RevokeScreenshareButton}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { participantID, t, visible } = this.props;

        if (!visible) {
            return null;
        }

        return (
            <RemoteVideoMenuButton
                buttonText = { t('videothumbnail.revokeScreenshare') }
                displayClass = 'revokescrennsharelink'
                icon = { IconCrown }
                id = { `revokescreensharelink_${participantID}` }
                // eslint-disable-next-line react/jsx-handler-names
                onClick = { this._handleClick } />
        );
    }

    _handleClick: () => void
}

export default translate(connect(_mapStateToProps)(RevokeScreenshareButton));
