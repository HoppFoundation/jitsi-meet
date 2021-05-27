// @flow

import React from 'react';

import { ConfirmDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractRevokeScreenshareDialog
    from '../AbstractRevokeScreenshareDialog';

/**
 * Dialog to confirm a remote participant kick action.
 */
class RevokeScreenshareDialog extends AbstractRevokeScreenshareDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <ConfirmDialog
                contentKey = 'dialog.revokeScreenshareDialog'
                onSubmit = { this._onSubmit } />
        );
    }

    _onSubmit: () => boolean;
}

export default translate(connect()(RevokeScreenshareDialog));
