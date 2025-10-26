import React from 'react';
import {ActivityIndicator, View} from 'react-native';

interface ILoader {
  style?: {};
}

const Loader = ({style}: ILoader) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator color="grey" size="large" />
  </View>
);

const styles = {
  container: {
    width: '100%',
    height: '100%',
    alignItem: 'center',
    justifyContent: 'center',
  },
};

export default Loader;
