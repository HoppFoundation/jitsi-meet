// @flow

import React from 'react';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractRevokeScreenshareDialog
    from '../AbstractRevokeScreenshareDialog';

/**
 * Dialog to confirm a revoke moderator action.
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
            <Dialog
                okKey = 'dialog.Yes'
                onSubmit = { this._onSubmit }
                titleKey = 'dialog.revokeScreenshareTitle'
                width = 'small'>
                <div>
                    { this.props.t('dialog.revokeScreenshareDialog') }
                </div>
            </Dialog>
        );
    }

    _onSubmit: () => boolean;
}

export default translate(connect()(RevokeScreenshareDialog));
