import React from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Text} from 'react-native';
import {Metrics, Images, AppStyles} from '@theme';

export function Checkbox(props) {
  const {label, value, onPress, containerStyle, labelStyle} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, containerStyle]}>
        <Image
          source={value === true ? Images.icCheckBox : Images.icUnCheckBox}
        />

        <Text style={[styles.text, labelStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  text: {
    ...AppStyles.gbRe(14),
    marginLeft: Metrics.smallMargin,
  },
});
