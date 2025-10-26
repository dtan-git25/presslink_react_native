import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

const ListEmpty = () => (
  <View style={styles.container}>
    <Image source={require('./icons/list_empty.png')} style={styles.icon} />
    <Text style={styles.description}>No data found</Text>
  </View>
);

const styles = StyleSheet.create({
  icon: {width: 120, height: 120, resizeMode: 'contain', tintColor: '#A2A9B7'},
  container: {
    padding: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  description: {marginTop: 8, fontSize: 19, color: '#A2A9B7'},
});

export default ListEmpty;
