// @flow

import React from 'react';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractGrantScreenshareDialog
    from '../AbstractGrantScreenshareDialog';

/**
 * Dialog to confirm a grant moderator action.
 */
class GrantScreenshareDialog extends AbstractGrantScreenshareDialog {
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
                titleKey = 'dialog.grantScreenshareTitle'
                width = 'small'>
                <div>
                    { this.props.t('dialog.grantScreenshareDialog') }
                </div>
            </Dialog>
        );
    }

    _onSubmit: () => boolean;
}

export default translate(connect()(GrantScreenshareDialog));
