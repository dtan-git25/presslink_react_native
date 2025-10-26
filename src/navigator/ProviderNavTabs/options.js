import React from 'react';
import {Image, View, Text} from 'react-native';
import {Images, Colors, Metrics, Fonts} from '../../theme';
import utility from '../../utility';

export const screenOptions = (route) => ({
  tabBarIcon: ({focused, color, size}) => {
    const {name} = route;
    return (
      <Image
        style={{tintColor: color}}
        resizeMode="contain"
        source={Images[name]}
      />
    );
  },
});

export const tabBarOptions = {
  activeTintColor: 'red',
  inactiveTintColor: 'yellow',
  keyboardHidesTabBar: true,
  style: {
    borderTopWidth: 0,
  },
};
