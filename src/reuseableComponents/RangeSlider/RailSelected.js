import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const RailSelected = props => {
  return <View style={[styles.root, props.style]} />;
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 4,
    backgroundColor: '#4499ff',
    borderRadius: 2,
  },
});
