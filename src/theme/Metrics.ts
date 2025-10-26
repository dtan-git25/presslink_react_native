import {Dimensions, Platform} from 'react-native';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const {width, height} = Dimensions.get('window');

const screenWidth = width;
const halfScreenWidth = width / 2;
const screenHeight = height;
const halfScreenHeight = height / 2;

// Will return a linear scaled result of the provided size, based on your device's screen height.
const heightRatio = (size: number) => verticalScale(size);
// Will return a linear scaled result of the provided size, based on your device's screen width.
const widthRatio = (size: number) => scale(size);

// Sometimes you don't want to scale everything in a linear manner, that's where moderateScale comes in.
// The cool thing about it is that you can control the resize factor (default is 0.5).
// If normal scale will increase your size by +2X, moderateScale will only increase it by +X, for example:
// moderateScale(10) = 15
// moderateScale(10, 0.1) = 11
const factor = 0.5;
const generatedFontSize = (size: number) => moderateScale(size, factor);

const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default {
  NAVBAR_HEIGHT,
  heightRatio,
  widthRatio,
  screenWidth,
  screenHeight,
  halfScreenWidth,
  halfScreenHeight,
  generatedFontSize,
  searchBarHeight: heightRatio(50),
  smallMargin: heightRatio(8),
  baseMargin: heightRatio(16),
  doubleBaseMargin: heightRatio(24),
  xDoubleBaseMargin: heightRatio(32),
  horizontalLineHeight: heightRatio(1),
  // statusBarHeight: getStatusBarHeight(),
  statusBarHeight: 46,
  tabBarHeight: 49, // Default tab bar height in iOS 10
  icons: {
    tiny: heightRatio(16),
    small: heightRatio(24),
    normal: heightRatio(32),
    medium: heightRatio(48),
    large: heightRatio(64),
    xl: heightRatio(128),
  },
  images: {
    xSmall: heightRatio(15),
    small: heightRatio(20),
    medium: heightRatio(40),
    large: heightRatio(55),
    xLarge: heightRatio(70),
    avatar: heightRatio(90),
    logo: heightRatio(200),
    radius: heightRatio(100),
    coverWidth: screenWidth,
    coverHeight: screenWidth / 2,
  },
};
