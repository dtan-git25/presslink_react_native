//
//  index.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:27:23 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TextInput,
  Animated,
  LayoutAnimation,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { AppStyles, Colors, Metrics } from '@theme';
import PropTypes from 'prop-types';
import _ from 'lodash';
import PhoneInput from 'react-native-phone-input';
import { INPUT_TYPES } from '../FormHandlerUpdated/Constants';

export default class MaterialTextField extends Component {
  static propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    onRightPress: PropTypes.func,
    onChangeText: PropTypes.func,
    onChangePhoneNumber: PropTypes.func,
    rightIcon: PropTypes.any,
    rightText: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isEmpty: PropTypes.bool,
    labelBackgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    activeColor: PropTypes.string,
    outlined: PropTypes.bool,
    isAnimate: PropTypes.bool,
    textInputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightIconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    subAnimated: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onFocus: PropTypes.func,
    returnKeyType: PropTypes.string,
    validationStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSubmitEditing: PropTypes.func,

  };

  static defaultProps = {
    label: 'placeholder',
    error: 'Error',
    onRightPress: () => { },
    onChangeText: () => { },
    onChangePhoneNumber: () => { },
    rightIcon: null,
    rightText: '',
    value: '',
    labelBackgroundColor: '#F2F2F2',
    activeTextColor: Colors.txt.dGrey,
    inactiveColor: '#aaa',
    activeColor: Colors.primary.violet,
    outlined: false,
    isAnimate: true,
    textInputStyle: {},
    style: {},
    rightIconStyle: {},
    subAnimated: {},
    onFocus: () => { },
    validationStyle: {},
    returnKeyType: 'default',
    onSubmitEditing: () => { },
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isFocused: false,
      error: '',
      val: props.value ? props.value : '',
      maxHeight: 0,
      isError: false,
      minHeight: 52,
      isValidNumber: false,
      cca2: 'US',
      countryCode: '+1',
      expanded: false,
    };
    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }
  _animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  animation = new Animated.Value(0);

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this.validate);
    }
    const { val } = this.state;
    if (val) {
      this.props.getCode && this.props.getCode(val);
      this.setState({ isValidNumber: true });
    }
    this.animation.setValue(this.state.minHeight);
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value)
      this.setState({ val: this.props.value, isError: false, error: '' });
  }
  handleFocus = () => {
    this.animate(1);
    // this.props.onFocus && this.props.onFocus();
  };
  handleBlur = () => this.animate(this.state.val ? 1 : 0);
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
      // outputRange: [15, -9],
      outputRange: [this.props.initialValue ? -10 : 15, -9],

    }),
    fontSize: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [17, 14],
    }),
    color: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.inactiveColor, this.props.activeColor],
    }),
    backgroundColor: 'transparent',
    paddingLeft: 5,
    paddingRight: 5,
    alignSelf: 'center',
  };
  labelLeftStyle = {
    marginLeft: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [70, 0],
    }),

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

  setError = (val, error = this.state.error) => {
    let switchAnimation = {
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    LayoutAnimation.configureNext(switchAnimation);
    this.setState({ isError: val, error });
  };
  setText = value => {
    if (value === '') {
      this.animate(0);
    } else {
      this.animate(1);
    }
    this.setState({ val: value });
  };

  getValue = () => {
    if (this.props.type == INPUT_TYPES.PHONE) {
      return {
        isValidNumber: this.state.isValidNumber,
        value: this.state.val,
        // countryCode :
      };
    }
    return this.state.val;
  };

  componentIcon = () => {
    if (this.props.rightIcon || this.state.expanded) {
      return (
        <Animated.Image
          resizeMode="contain"
          // source={this.state.expanded ? Images.icError : this.props.iconImg}
          source={
            this.state.expanded ? this.props.rightIcon : this.props.rightIcon
          }
          // style={[this.tintColorStyle, { width: 24, height: 24 }, { tintColor: this.state.expanded && '#B00020' }]}
          style={[{}, this.props.rightIconStyle]}
        />
      );
    } else {
      return (
        <Animated.Text style={this.colorStyle}>
          {this.props.rightText}
        </Animated.Text>
      );
    }
  };

  // phone number
  onPressFlag() {
    this.countryPicker.onOpen();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({
      cca2: country.cca2,
      countryCode: `+${country.callingCode[0]}`,
    });
  }

  setFocus = () => {
    const { countryField } = this.props;
    if (countryField) {
      console.log('phone : ', this.phone);
      this.phone.focus();
    } else {
      this.textInput.focus();
    }
    // this.textInput.focus();
  };
  focus = () => {
    const { countryField } = this.props;
    if (countryField) {
      this.phone.focus();
    } else {
      this.textInput.focus();
    }
  };

  render() {
    return (
      <Animated.View
        style={[
          {
            height: this.animation,
            marginTop: 12,
            marginBottom: this.state.isError ? 20 : 0,
          },
          this.props.style,
          this.state.error.length > 100
            ? { marginBottom: Metrics.doubleBaseMargin * 2 }
            : {},
        ]}>
        {this.props.LabelTxt && (
          <Text style={[styles.labelTxtStyle, this.props.labelTxtStyle]}>
            {this.props.LabelTxt}
          </Text>
        )}
        <Animated.View
          style={[
            this.borderColorStyle,
            styles.borderStyle,
            this.borderStyle,
            this.props.subAnimated,
          ]}>
          {this.props.isAnimate && (
            <Animated.Text
              style={[
                this.labelStyle,
                this.props.labelStyle,
                this.props.identifier === 'mobile_no'
                  ? this.labelLeftStyle
                  : {},
              ]}
              numberOfLines={1}>
              {this.props.label}
            </Animated.Text>
          )}
          {!_.isUndefined(this.props.countryField) ? (
            <PhoneInput
              initialCountry={'us'}
              handleFocusAnimation={() => { }}
              disabled={this.props.disabled}
              handleBlurAnimation={() => { }}
              style={[styles.txtInputStyle, this.props.textInputStyle]}
              allowZeroAfterCountryCode={false}
              //   value={`+${this.state.val}`}
              value={this.state.val}
              textStyle={{
                color: this.props.activeTextColor ?? 'black',
              }}
              textProps={{
                maxLength: 20,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
              }}
              disabled={this.props.disabled}

              initialValue={this.props.initialValue}
              onChangePhoneNumber={(text) => {
                this.setState({
                  val: text,
                  isError: false,
                  error: "",
                  isValidNumber: false,
                });

                console.log('isValidNumber', this.phone.isValidNumber())
                if (this.phone.isValidNumber()) {
                  const countryCode = `+${this.phone.getCountryCode()}`;
                  const number = text.replace(countryCode, '');
                  const formatedNumber =
                    number.indexOf('-') === -1
                      ? `${countryCode}-${number}`
                      : `${countryCode}${number}`;


                  console.log('isValidNumber:', this.phone.isValidNumber(), "val:", formatedNumber, "error:", this.phone.isValidNumber())
                  this.props.onChangePhoneNumber(formatedNumber);

                  this.setState({ isValidNumber: true, val: formatedNumber, isError: false, error: "" });
                  this.props.getCode(formatedNumber);
                }
              }}
              ref={ref => {
                this.phone = ref;
              }}
            />
          ) : (
            <TextInput
              pointerEvents={
                !_.isUndefined(this.props.pointerEvents) ? 'none' : null
              }
              ref={ref => (this.textInput = ref)}
              style={[
                styles.txtInputStyle,
                this.props.textInputStyle,
                { color: this.props.activeTextColor },
              ]}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChangeText={text => {
                this.setState({ val: text, isError: false, error: '' });
                this.props.onChangeText(text);
              }}
              blurOnSubmit={false}
              value={this.state.val}
              multiline={this.props.multiline && true}
              maxLength={this.props.maxLength}
              editable={this.props.editable}
              autoCorrect={false}
              placeholderTextColor={this.props.placeholderTextColor}
              placeholder={this.props.placeholder}
              keyboardType={this.props.keyboardType}
              secureTextEntry={this.props.secureTextEntry}
              selectionColor={this.props.selectionColor}
              returnKeyType={this.props.returnKeyType}
              onSubmitEditing={this.props.onSubmitEditing}
            />
          )}
          {(this.props.rightText ||
            this.props.rightIcon ||
            this.state.expanded) && (
              <TouchableOpacity
                onPress={this.props.onRightPress}
                style={styles.iconStyle}>
                {this.componentIcon()}
              </TouchableOpacity>
            )}
        </Animated.View>
        {this.state.isError && (
          <Text
            style={[
              styles.errorStyle, this.props.validationStyle,
              this.state.error.length > 45 ? { fontSize: 11, paddingBottom: 10 } : {},
            ]}>
            {this.state.error}
          </Text>
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
    minHeight: 52,
    height: 52,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
    alignSelf: 'stretch',
    flex: 1,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    ...AppStyles.gbRe(15),
  },
  errorStyle: {
    color: '#B00020',
    paddingLeft: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  labelTxtStyle: { marginBottom: 10, ...AppStyles.gbSb(15) },
  borderStyle: {
    borderRadius: 10,
    flexDirection: 'row',
  },
});
