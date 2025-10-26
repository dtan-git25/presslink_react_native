// NOTE
// TouchableHighlight

// • What it does: Darkens or lightens the background of the element when pressed.

// • When to use it: On iOS for touchable elements or buttons that have a solid shape or background, and on ListView items.

// TouchableOpacity

// • What it does: Lightens the opacity of the entire element when pressed.

// • When to use it: On iOS for touchable elements that are standalone text or icons with no background color.

// TouchableNativeFeedback

// • What it does: Adds a ripple effect to the background when pressed.

// • When to use it: On Android for almost all touchable elements.

import React from 'react';
import {
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
  View,
  TouchableHighlight,
} from 'react-native';
import utility from '../../utility';

let disableClick = false;
const debounceTime = Platform.select({
  ios: 200,
  android: 700,
});

interface IButtonView {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  isBackgroundBorderLess?: boolean;
  disableRipple?: boolean;
  enableClick?: boolean;
  iosSolidShape?: boolean;
}

const ButtonView = ({
  style,
  children,
  onPress = () => null,
  isBackgroundBorderLess = false,
  disableRipple = false,
  enableClick = false,
  iosSolidShape = false,
  ...rest
}: IButtonView) => {
  const _onPress = () => {
    if (enableClick && onPress) {
      onPress();
    } else if (!disableClick) {
      disableClick = true;
      if (onPress) {
        onPress();
      }
      setTimeout(() => {
        disableClick = false;
      }, debounceTime);
    }
  };

  if (utility.isPlatformAndroid()) {
    let background = TouchableNativeFeedback.SelectableBackground();
    if (isBackgroundBorderLess) {
      background = TouchableNativeFeedback.SelectableBackgroundBorderless();
    } else if (disableRipple) {
      background = TouchableNativeFeedback.Ripple(
        'transparent',
        isBackgroundBorderLess,
      );
    }
    return (
      <TouchableNativeFeedback
        background={background}
        {...rest}
        onPress={_onPress}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  const opacity = disableRipple ? 1 : 0.5;
  if (iosSolidShape) {
    return (
      <TouchableHighlight
        style={style}
        {...rest}
        onPress={_onPress}
        activeOpacity={opacity}>
        {children}
      </TouchableHighlight>
    );
  } else {
    return (
      <TouchableOpacity
        style={style}
        {...rest}
        onPress={_onPress}
        activeOpacity={opacity}>
        {children}
      </TouchableOpacity>
    );
  }
};

export default ButtonView;
