import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

const Rail = props => {
  return <View style={[styles.root, props.style]} />;
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7f7f7f',
  },
});
