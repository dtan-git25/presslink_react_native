import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AppStyles, Colors, Metrics } from '@theme';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ButtonView } from '@reuseableComponents';


export default class DatePickerField extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        labelBackgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        isRequired: PropTypes.bool,
        inactiveColor: PropTypes.string,
        activeColor: PropTypes.string,
        textInputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        label: PropTypes.string,
        placeHolderText: PropTypes.string,
        isRequired: PropTypes.bool,
        displayPlaceHolder: PropTypes.bool,
        validationText: PropTypes.string,
        dateStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        valStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    }

    static defaultProps = {
        onPress: () => { },
        labelBackgroundColor: PropTypes.string,
        activeTextColor: Colors.txt.dGrey,
        inactiveColor: '#aaa',
        textInputStyle: {},
        displayPlaceHolder: false,
        style: {},
        label: 'Label',
        activeColor: Colors.primary.violet,
        dateStyle: {},
        valStyle: {},
        isRequired: false,
        validationText: '',
        placeHolderText: ''
    }

    render() {
        return (
            <View>
                <ButtonView
                    onPress={this.props.onPress}
                    style={[styles.fieldStyle, { borderBottomColor: this.props.value ? Colors.primary.violet : '#aaa', }, this.props.dateStyle]}>
                    {this.props.value ? (
                        <View>
                            <Text style={[styles.activelabelTxtStyle, styles.activeLabelColor, this.props.labelTxtStyle]}>
                                {this.props.label}
                            </Text>
                            <Text style={[styles.valTxtStyle, this.props.valStyle]}>
                                {this.props.value}
                            </Text>
                        </View>

                    ) : (
                        <View>
                            <Text style={this.props.displayPlaceHolder ? [styles.activelabelTxtStyle, styles.activeLabelColor, this.props.labelTxtStyle] : [styles.labelTxtStyle, styles.inactiveLabel, this.props.labelTxtStyle]}>
                                {this.props.label}
                            </Text>
                            {this.props.displayPlaceHolder &&
                                <Text style={[styles.valTxtStyle, this.props.valStyle]}>
                                    {this.props.placeHolderText}
                                </Text>
                            }

                        </View>
                    )}


                </ButtonView>
                {/* <View> */}
                {(this.props.value == '' && this.props.isRequired) &&
                    <Text style={[styles.validationTextStyle]}>
                        {this.props.validationText}
                    </Text>
                }
                {/* </View> */}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    inactiveLabel: {
        marginTop: Metrics.heightRatio(20)
    },
    activeLabelColor: {
        color: Colors.primary.violet
    },
    txtInputStyle: {
        minHeight: 52,
        height: 52,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 15,
        alignSelf: 'stretch',
        flex: 1,
        ...AppStyles.gbRe(15),
    },
    fieldStyle: {
        // backgroundColor: 'red',

        borderWidth: 1,
        borderColor: 'transparent', marginHorizontal: Metrics.heightRatio(5),

    },
    validationTextStyle: {
        color: '#B00020',
        paddingLeft: 15,
        marginTop: 5,
        fontSize: 10,
        marginBottom: 5,
        fontSize: 13
    },

    labelTxtStyle: { marginBottom: 10, ...AppStyles.gbMedium(17), color: '#aaa' },
    activelabelTxtStyle: { marginBottom: 10, marginTop: 12, ...AppStyles.gbMedium(15), color: '#aaa' },
    valTxtStyle: { marginBottom: 10, ...AppStyles.gbMedium(17), color: 'black' },
    borderStyle: {
        borderRadius: 10,
        flexDirection: 'row',

    },
});
