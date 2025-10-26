import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

interface IListFooter {
  showLoader: boolean;
}

const ListFooter = ({showLoader}: IListFooter) => (
  <View style={styles.container}>
    {showLoader && <ActivityIndicator animating />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListFooter;
