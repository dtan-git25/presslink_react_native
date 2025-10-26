import React from 'react';
// import Modal from 'react-native-modal';
import {View, StatusBar, ActivityIndicator, StyleSheet,Modal} from 'react-native';
import {Metrics} from '../../theme';
import {useTheme} from '@react-navigation/native';

interface ILoader {
  loading: boolean;
}

const Loader = ({loading = false}: ILoader) => {
  return (
    <View>
      <StatusBar networkActivityIndicatorVisible={loading} />
      <Modal
        style={{margin: 0}}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        isVisible={loading}>
        <View style={styles.container}>
          <ActivityIndicator color={useTheme().colors.primary} size="large" />
        </View>
      </Modal>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
});
