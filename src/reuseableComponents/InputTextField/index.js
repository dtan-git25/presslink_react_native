'use strict';
import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  StyleSheet,
  Image,
  UIManager,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import { Metrics, Colors, AppStyles } from '../../theme';
import App from '../../../App';
import { H4 } from '../../components';

// const {colors} = DefaultTheme;
export default class InputTextField extends Component {
  static propTypes = {
    label: PropTypes.string,
    onChangeTxt: PropTypes.func,
    error: PropTypes.string,
    onIconPress: PropTypes.func,
    secureTextEntry: PropTypes.bool,
    highlight: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSubmitEditing: PropTypes.func,
    labelShown: PropTypes.bool
  };

  static defaultProps = {
    error: 'Error',
    secureTextEntry: false,
    labelShown: false,
    highlight: false,
    onIconPress: () => { },
    onChangeTxt: () => { },
    onSubmitEditing: () => { },

  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.animationVal = new Animated.Value(0);
    this.state = {
      containerHeight: 0,
      val: props.value ? props.value : '',
      isError: false,
      error: props.error,
      isHighlight: false,
    };

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentDidMount() {
    this.props.value && this.props.value.length && this.animateUp();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value)
      this.setState({ val: this.props.value, isError: false, error: '' });
  }

  setText = txt => {
    this.onChangeText(txt);
    this.animateUp();
  };

  getValue = () => this.state.val;

  clearInput = () => {
    this.setText('');
    return this.textInput.clear();
  };

  setError = (isError, error = this.state.error) => {
    let switchAnimation = {
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    LayoutAnimation.configureNext(switchAnimation);
    this.setState({ isError, error });
  };

  setFocus = () => {
    this.textInput.focus();

    if (this.props.onPress) {
      setTimeout(this.props.onPress, 2000);
    }
  };

  animateUp = () => {
    Animated.timing(this.animationVal, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  animateDown = () => {
    Animated.timing(this.animationVal, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  renderLabel() {
    const { label, txtLabel } = this.props;
    return <Text style={[styles.txtLabel, txtLabel]}>{label}</Text>;
  }

  renderInput() {
    const {
      isActiveColor,
      style,
      keyboardType,
      value,
      secureTextEntry,
      autoCapitalize,
      editable,
      placeholderTextColor,
      multiline = false,
      ...rest
    } = this.props;

    return (
      <TextInput
        ref={ref => (this.textInput = ref)}
        style={[
          styles.textInput,
          style,
          {
            paddingTop:
              Platform.OS === 'ios' && multiline
                ? 15
                : Platform.OS === 'ios'
                  ? 0
                  : 11,
          },
        ]}
        keyboardType={keyboardType}
        onFocus={this.onFocus}
        editable={editable}
        onBlur={this.onBlur}
        multiline={multiline}
        autoCapitalize={autoCapitalize || 'none'}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : Colors.txt.lBlue
        }
        onChangeText={this.onChangeText}
        value={this.state.val}
        onSubmitEditing={this.props.onSubmitEditing}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
    );
  }

  onChangeText = val => {
    this.setState({ val, isError: false });
    this.props.onChangeTxt(val);
  };

  onFocus = () => {
    this.animateUp();
    if (this.props.highlight) {
      this.setState({ isHighlight: true });
    }
  };

  onBlur = () => {
    !this.state.val && this.animateDown();
    this.setState({ isHighlight: false });
  };

  renderRightIcon() {
    const { rightImage, onPressRight, iconStyle } = this.props;
    if (rightImage) {
      return (
        <TouchableOpacity
          style={styles.wrapperRightImage}
          onPress={onPressRight}>
          <Image source={rightImage} style={[styles.rightImage, iconStyle]} />
        </TouchableOpacity>
      );
    }
  }

  renderRightText() {
    const { rightText } = this.props;
    if (rightText) {
      return <Text style={styles.wrapperRightImage}>{rightText}</Text>;
    }
  }

  renderLeftIcon() {
    const { leftImage, onLeftIconPress, leftInput } = this.props;
    if (leftImage) {
      return (
        <TouchableOpacity
          style={styles.wrapperLeftImage}
          onPress={onLeftIconPress}>
          <Image source={leftImage} style={[styles.leftImage, leftInput]} />
        </TouchableOpacity>
      );
    }
  }

  renderSeparator() {
    return (
      <View
        style={[
          styles.separator,
          {
            backgroundColor: this.state.isError ? 'red' : '#E0E0E0',
          },
        ]}
      />
    );
  }

  renderError() {
    if (this.state.isError) {
      return <Text style={styles.error}>{this.state.error}</Text>;
    }
  }

  onLayout = ev =>
    this.setState({
      containerHeight: ev.nativeEvent.layout.height / 2.5,
    });

  render() {
    const { onPress, inputStyle, label, labelStyle, labelShown } = this.props;
    const container = [
      styles.inputWrapper,
      inputStyle,
      this.state.isHighlight
        ? {
          // backgroundColor: Colors.SocialButton.green,
          // borderBottomWidth: 1,
          // borderColor: 'red',
        }
        : { borderColor: this.state.isError ? 'red' : 'tranparent' },
    ];

    return (
      <View
        style={[
          label
            ? { marginTop: Metrics.smallMargin }
            : { marginTop: Metrics.baseMargin },
          labelStyle,
        ]}>
        {labelShown && this.renderLabel()}
        <TouchableOpacity onPress={onPress}>
          <View style={container} onLayout={this.onLayout}>
            {this.renderLeftIcon()}
            {this.renderInput()}
            {this.renderRightIcon()}
            {this.renderRightText()}
          </View>
        </TouchableOpacity>
        {this.renderError()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: Metrics.heightRatio(36),
    borderBottomWidth: 1,
  },
  placeholderContainer: {
    position: 'absolute',
    left: Metrics.heightRatio(2),
  },
  txtLabel: {
    // marginLeft: Metrics.baseMargin,
    ...AppStyles.gbRe(14),
  },
  wrapperRightImage: {
    paddingLeft: Metrics.baseMargin,
    marginRight: Metrics.smallMargin,
  },
  wrapperLeftImage: {
    // paddingRight: Metrics.baseMargin,
    marginLeft: Metrics.baseMargin,
  },
  leftImage: {
    width: Metrics.heightRatio(20),
    height: Metrics.heightRatio(20),
    resizeMode: 'contain',
    tintColor: Colors.txt.lBlue,
  },
  rightImage: {
    width: Metrics.heightRatio(16),
    height: Metrics.heightRatio(26),
    resizeMode: 'contain',
    tintColor: Colors.txt.lGrey,
  },
  error: {
    color: 'red',
    paddingLeft: Metrics.heightRatio(3),
    paddingTop: Metrics.heightRatio(5),
  },
});
