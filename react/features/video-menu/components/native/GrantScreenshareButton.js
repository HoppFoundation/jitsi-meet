// @flow

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractGrantScreenshareButton, {
    _mapStateToProps
} from '../AbstractGrantScreenshareButton';

export default translate(connect(_mapStateToProps)(AbstractGrantScreenshareButton));
