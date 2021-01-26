// @flow

import { Component } from 'react';

import React from 'react';
import { Text, View} from 'react-native';
import styles from './styles';

import { connect } from '../../../base/redux';
import { getParticipantCount } from '../../../base/participants'
import { Icon, IconUserGroups } from '../../../base/icons';



/**
 * The type of the React {@code Component} props of {@link ParticipantsCount}.
 */
type Props = {
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * The type of the React {@code Component} state of {@link ConferenceTimer}.
 */
type State = {

    /**
     * Value of current conference time.
     */
    count: int
};

/**
 * ConferenceTimer react component.
 *
 * @class ConferenceTimer
 * @extends Component
 */
class ParticipantsCount extends Component<Props, State> {



    /**
     * Initializes a new {@code ConferenceTimer} instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            count:  getParticipantCount(props)
        };
    }

   
      /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <View        style = { styles.participantCounterContainer }>            
            <Text
                numberOfLines = { 1 }
                style = { styles.participantCounter }>
                { this.props.count  }  
             <Icon     
             style = { styles.participantCounterIcon }
             src = { IconUserGroups } > 
             </Icon>
            </Text>
        
           
             
             </View>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code ParticipantsCount} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    return {
        conference: state['features/base/conference'].conference,
        count: getParticipantCount(state)
    };
}

export default connect(mapStateToProps)(ParticipantsCount);
