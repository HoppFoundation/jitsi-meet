// @flow

import React from 'react';

import { ConfirmDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractGrantScreenshareDialog
    from '../AbstractGrantScreenshareDialog';

/**
 * Dialog to confirm a remote participant kick action.
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
            <ConfirmDialog
                contentKey = 'dialog.GrantScreenshareDialog'
                onSubmit = { this._onSubmit } />
        );
    }

    _onSubmit: () => boolean;
}

export default translate(connect()(GrantScreenshareDialog));
