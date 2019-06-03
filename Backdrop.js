
import React, { Component } from 'react'
import { StyleSheet, Animated, Dimensions, Easing,TouchableOpacity } from 'react-native';
import { PanGestureHandler, State  } from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import _styles from '../theme/styles'

const { height } = Dimensions.get('window');
const translateY = new Animated.Value(height * .9); // initialize with value

const animatedEvent = Animated.event(
    [
        {
            nativeEvent: {
                translationY: translateY
            }
        }
    ], { useNativeDriver: true }
);
let offset = 0;
export default class Backdrop extends Component {

    constructor(props) {
        super(props)
    }

    onHandlerStateChange(event) {
        if (event.nativeEvent.oldState == State.ACTIVE) {
            const { translationY } = event.nativeEvent;
            offset += translationY;
            translateY.setOffset(offset);

            translateY.setValue(0);
        }

    }
    moveUp() {
        Animated.timing(translateY, {
            toValue: 0
            ,useNativeDriver: true
            ,duration: 500
            ,easing: Easing.in(Easing.ease)
        }).start()
        translateY.setOffset(0);
    }
    moveDown() {
        Animated.timing(translateY, {
            toValue: height * .9
            ,useNativeDriver: true
            ,duration: 500
            ,easing: Easing.out(Easing.ease)
        }).start()
    }
    render() {
        const { children, openBackDrop } = this.props;
        if(openBackDrop){
            this.moveUp()
        }else{
            this.moveDown();
        }
        return (
            <PanGestureHandler
                onGestureEvent={animatedEvent}
                onHandlerStateChange={this.onHandlerStateChange.bind(this)}
            >
                <Animated.View
                    style={[styles.fontlayer, {
                        transform: [
                            {
                                translateY: translateY.interpolate(
                                    {
                                        inputRange: [0, height * .9]
                                        , outputRange: [0, height * .9]
                                        , extrapolate: 'clamp'
                                    }
                                )
                            }
                        ]
                    }
                    ]}>
                    <Animated.View
                        style={[
                            {
                                justifyContent: 'flex-end'
                                , alignItems: 'center'
                                , flexDirection: 'row'
                            }]}>

                        <TouchableOpacity onPress={() => this.moveDown()}>
                            <EvilIcons name="close" size={40} />
                        </TouchableOpacity>
                    </Animated.View>

                    { children }
                </ Animated.View>
            </PanGestureHandler>
        )
    }
}

const styles = StyleSheet.create({
    fontlayer: {
        backgroundColor: '#fff'
        , borderTopLeftRadius: 10
        , borderTopRightRadius: 10
        , marginLeft: 5
        , marginRight: 5
        , marginTop: 45
        , padding: 10
        , ..._styles.shadow
        , position: 'absolute'
        , left: 0
        , right: 0
        , top: 0
        , bottom: 0
    }
})
