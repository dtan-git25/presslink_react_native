//
//  index.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:27:23 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import React, {Component} from 'react';
import {Text, StyleSheet, Animated, View} from 'react-native';
import {TextInput, DefaultTheme} from 'react-native-paper';
import PropTypes from 'prop-types';
import {Colors, Metrics} from '@theme';
import CountryPicker from 'react-native-country-picker-modal';
import MaskInput from 'react-native-mask-input';
import {NumberDetect} from './CountryCode';
export default class MaterialTextField extends Component {
  static propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    onRightPress: PropTypes.func,
    rightIcon: PropTypes.any,
    rightText: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isEmpty: PropTypes.bool,
    labelBackgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    activeColor: PropTypes.string,
    outlined: PropTypes.bool,
    textInputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onFocus: PropTypes.func,
    returnKeyType: PropTypes.string,
    onSubmitEditing: PropTypes.func,
    selectionColor: PropTypes.string,
  };

  static defaultProps = {
    label: 'placeholder',
    error: 'Error',
    onRightPress: () => {},
    rightIcon: null,
    rightText: '',
    value: '',
    labelBackgroundColor: '#fff',
    activeTextColor: 'red',
    inactiveColor: '#aaa',
    activeColor: '#000',
    outlined: false,
    textInputStyle: {},
    style: {},
    onFocus: () => {},
    returnKeyType: 'default',
    onSubmitEditing: () => {},
    selectionColor: Colors.primary.violet,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isFocused: false,
      error: '',
      val: props.value ? props.value : '',
      maxHeight: 0,
      minHeight: 52,
      countryCode: {
        cca2: 'US',
        currency: ['USD'],
        callingCode: ['1'],
        region: 'Americas',
        subregion: 'North America',
        flag: 'flag-us',
        name: 'United States',
      },
      expanded: false,
    };
  }
  _animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  animation = new Animated.Value(0);

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this.validate);
    }
    this.animation.setValue(this.state.minHeight);
  }
  handleFocus = () => {
    this.props.onFocus();
  };
  animate = toValue => {
    Animated.timing(this._animatedIsFocused, {
      toValue: toValue,
      duration: 200,
    }).start();

    Animated.spring(this.animation, {
      toValue: this.state.expanded
        ? 18 + this.state.minHeight
        : this.state.minHeight,
    }).start();
  };
  labelStyle = {
    position: 'absolute',
    left: 10,
    top: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [13, -9],
    }),
    fontSize: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [17, 14],
    }),
    color: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.inactiveColor, this.props.activeColor],
    }),
    backgroundColor: this.props.labelBackgroundColor,
    paddingLeft: 5,
    paddingRight: 5,
    alignSelf: 'center',
  };

  borderColorStyle = {
    borderColor: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.inactiveColor, this.props.activeColor],
    }),
  };
  colorStyle = {
    color: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.inactiveColor, this.props.activeColor],
    }),
  };
  tintColorStyle = {
    tintColor: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.inactiveColor, this.props.activeColor],
    }),
  };
  borderStyle = this.props.outlined
    ? {
        borderWidth: 1,
      }
    : {
        borderBottomWidth: 1,
      };
  _setMaxHeight(event) {
    if (
      event.nativeEvent.layout.height !==
      Math.round(event.nativeEvent.layout.height)
    ) {
      this.setState({
        maxHeight: Math.round(event.nativeEvent.layout.height),
      });
    }
  }
  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height,
    });
  }
  setText = value => {
    if (value === '') {
      this.animate(0);
    } else {
      this.animate(1);
    }
    this.setState({val: value});
  };

  getValue = () => this.state.val;
  focus = () => {
    this.textInput.focus();
  };
  render() {
    return (
      <Animated.View
        style={[
          {height: this.animation, marginVertical: Metrics.smallMargin},
          this.props.style,
        ]}>
        {this.props.countryField ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CountryPicker
              withAlphaFilter
              withCountryNameButton
              excludeCountries={['AQ', 'BV', 'TF', 'HM', 'GS']}
              //countryCode={this.state.countryCode.cca2}
              countryCode={this.state.countryCode.cca2}
              onSelect={b =>
                this.setState(a => {
                  const value = a.val;
                  return {
                    countryCode: b,
                    val: value
                      ? value
                          .replace(/\+/g, '')
                          .replace(/\s/g, '')
                          .replace(
                            a.countryCode.callingCode[0],
                            b.callingCode[0],
                          )
                      : b.callingCode[0],
                  };
                })
              }
              withCountryNameButton={false}
            />
            <TextInput
              ref={ref => (this.textInput = ref)}
              style={[
                {flex: 1},
                styles.txtInputStyle,
                this.props.textInputStyle,
              ]}
              keyboardType={'number-pad'}
              label={this.props.label}
              placeholder={this.props.placeholder}
              onFocus={this.handleFocus}
              onChangeText={text => {
                this.setState(a => ({
                  val: text,
                  countryCode: {
                    ...a.countryCode,
                    cca2: NumberDetect(text + '').cca2,
                    callingCode: [NumberDetect(text + '').callingCode],
                  },
                }));
              }}
              blurOnSubmit={false}
              value={this.state.val}
              multiline={this.props.multiline && true}
              maxLength={this.props.maxLength}
              editable={this.props.editable}
              autoCorrect={false}
              // keyboardType={this.props.keyboardType}
              secureTextEntry={this.props.secureTextEntry}
              selectionColor={this.props.selectionColor}
              returnKeyType={this.props.returnKeyType}
              onSubmitEditing={this.props.onSubmitEditing}
              theme={{
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  primary: Colors.primary.violet,
                },
              }}
              render={props => (
                <MaskInput
                  {...props}
                  mask={a => {
                    if (a.replace(/\+/i, '').length < 6) {
                      return [/\d/, /\d/, /\d/, /\d/, /\d/];
                    } else {
                      if (this.state.countryCode.callingCode[0].length == 4) {
                        return [
                          '+',
                          this.state.countryCode.callingCode[0][0],
                          ' ',
                          this.state.countryCode.callingCode[0][1],
                          this.state.countryCode.callingCode[0][2],
                          this.state.countryCode.callingCode[0][3],
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ];
                      } else {
                        return [
                          '+',
                          ...this.state.countryCode.callingCode[0],
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ];
                      }
                    }
                  }}
                />
              )}
            />
          </View>
        ) : (
          <TextInput
            ref={ref => (this.textInput = ref)}
            style={[styles.txtInputStyle, this.props.textInputStyle]}
            label={this.props.label}
            placeholder={this.props.placeholder}
            onFocus={this.handleFocus}
            onChangeText={text => this.setState({val: text})}
            blurOnSubmit={false}
            value={this.state.val}
            multiline={this.props.multiline && true}
            maxLength={this.props.maxLength}
            editable={this.props.editable}
            autoCorrect={false}
            keyboardType={this.props.keyboardType}
            secureTextEntry={this.props.secureTextEntry}
            selectionColor={this.props.selectionColor}
            returnKeyType={this.props.returnKeyType}
            onSubmitEditing={this.props.onSubmitEditing}
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                primary: Colors.primary.violet,
              },
            }}
          />
        )}

        {this.state.error !== '' && (
          <Text style={styles.errorStyle}>{this.state.error}</Text>
        )}
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  iconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  txtInputStyle: {
    backgroundColor: '#fff0',
  },
  errorStyle: {
    color: '#B00020',
    paddingLeft: 15,
    marginTop: 5,
  },
  borderStyle: {
    borderRadius: 4,
    flexDirection: 'row',
  },
});