// @flow

import React, { PureComponent } from 'react';
import WebView from 'react-native-webview';
import { jitsiLocalStorage } from '@jitsi/js-utils';
import { JitsiModal } from '../../base/modal';
import { connect } from '../../base/redux';
import { CLOSING_PAGE_MODAL_ID } from '../constants';


type Props = {

    /**
     * The URL to display in the Help Centre.
     */
    _url: string
}

/**
 * Implements a page that renders the help content for the app.
 */
class ClosingView extends PureComponent<Props> {
    /**
     * Implements {@code PureComponent#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <JitsiModal
                headerProps = {{
                    headerLabelKey: 'welcomepage.sendFeedback'
                }}
                modalId = { CLOSING_PAGE_MODAL_ID }>
                <WebView source = {{ uri: this.props._url+"?callStatsUserName="+this.props._callStatsUserName }} />
            </JitsiModal>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {

    const serverURL = state['features/base/modal'].modalProps 
    const callStatsUserName
    = jitsiLocalStorage.getItem('callStatsUserName');
    return {
        _url: serverURL+'/static/close3.html',
        _callStatsUserName : callStatsUserName
    };
}

export default connect(_mapStateToProps)(ClosingView);

