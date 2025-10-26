//
//  AppStyles.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:47:42 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import { StyleSheet } from 'react-native';
import { Metrics, Fonts, Colors } from '@theme';

const centerAligned = { alignItems: 'center', justifyContent: 'center' };

const lightShadow = {
  shadowOpacity: 0.3,
  shadowRadius: 3,
  shadowOffset: {
    height: 0,
    width: 0,
  },
  elevation: 5,
};

// Fonts
const gbRe = (size: Number = 15, color = Colors.text.bluish) => {
  return {
    fontFamily: Fonts.Type.GRegular,
    fontSize: Metrics.generatedFontSize(size),
    color,
  };
};

const gbLight = (size: Number = 15, color = Colors.text.bluish) => {
  return {
    fontFamily: Fonts.Type.GLight,
    fontSize: Metrics.generatedFontSize(size),
    color,
  };
};

const gbBold = (size: Number = 15, color = Colors.text.bluish) => {
  return {
    fontFamily: Fonts.Type.GBold,
    fontSize: Metrics.generatedFontSize(size),
    color,
  };
};


// const tabReg = () => {
//   return {
//     fontFamily: Fonts.Type.GRegular,
//   };
// };

const tabReg = (size: Number = 11) => {
  return {
    fontFamily: Fonts.Type.GRegular,
    fontSize: Metrics.generatedFontSize(size),
  };
};

const gbMedium = (size: Number = 15, color = Colors.text.bluish) => {
  return {
    fontFamily: Fonts.Type.GRegular,
    fontSize: Metrics.generatedFontSize(size),
    color,
  };
};

const gbSb = (size: Number = 15, color = Colors.text.bluish) => {
  return {
    fontFamily: Fonts.Type.GSemiBold,
    fontSize: Metrics.generatedFontSize(size),
    color,
  };
};

const roundImage = (radius, resizeMode = 'contain') => {
  return {
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    resizeMode,
  };
};

const imgStyle = (size = 30, resizeMode = 'contain') => {
  return {
    width: Metrics.widthRatio(size),
    height: Metrics.widthRatio(size),
    resizeMode,
  };
};

export default {
  gbRe,
  gbSb,
  gbBold,
  gbMedium,
  gbLight,
  centerAligned,
  roundImage,
  lightShadow,
  imgStyle,
  tabReg
};
