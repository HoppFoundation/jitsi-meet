// @flow

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractRevokeScreenshareButton, {
    _mapStateToProps
} from '../AbstractRevokeScreenshareButton';

export default translate(connect(_mapStateToProps)(AbstractRevokeScreenshareButton));
