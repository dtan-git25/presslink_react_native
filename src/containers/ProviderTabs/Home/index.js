import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ButtonView, ServicesList } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import { push } from '@nav';

const Home = params => {
  const pushTo = screenName => ev => {
    push(screenName);
  };
  params.navigation.setOptions({
    headerRight: () => (
      <ButtonView style={styles.btnNoti} onPress={pushTo('ProviderNotifications')}>
        <Image source={Images.notification} />
      </ButtonView>
    ),
    headerTitleAlign: 'center',
  });
  return (
    <View style={styles.container} >
      < ServicesList />
      <View>
        <ButtonView
          onPress={pushTo('ProviderCreateService')}
          style={styles.floatBtn}
        >
          <Image source={Images.icAddButton} />
        </ButtonView>
      </View>
    </View >
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.bg,
  },
  flex: 1,
  hr: {
    height: Metrics.widthRatio(1),
    backgroundColor: Colors.bg.bg,
  },
  floatBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  btnNoti: {
    ...AppStyles.roundImage(32),
    ...AppStyles.centerAligned,
    backgroundColor: Colors.bg.lGreyTwo,
    marginRight: Metrics.baseMargin,
  },
  modalContent: {
    width: Metrics.screenWidth - Metrics.widthRatio(52),
  },
});
