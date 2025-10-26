import { ButtonView } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const navTitle = ({ title, onRight, onNotifications }) => {
  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <Text style={styles.title}>{title}</Text>
      {!!onRight && (
        <ButtonView style={styles.rightBtn} onPress={onRight}>
          <Image source={Images.edit} />
        </ButtonView>
      )}
      {!!onNotifications && (
        <ButtonView style={styles.btnNoti} onPress={onNotifications}>
          <Image source={Images.notification} />
        </ButtonView>
      )}
    </View>
  );
};

export default navTitle;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.bg.bg,
    borderBottomWidth: Metrics.widthRatio(1),
    backgroundColor: Colors.bg.white,
    flexDirection: 'row',
    alignItems: 'center',
    height: Metrics.widthRatio(46),
  },
  title: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),

    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  rightBtn: {
    paddingRight: Metrics.baseMargin,
  },
  btnNoti: {
    ...AppStyles.roundImage(32),
    ...AppStyles.centerAligned,
    backgroundColor: Colors.bg.lGreyTwo,
    marginRight: Metrics.baseMargin,
  },
  separator: { flex: 1, marginVertical: Metrics.baseMargin },
});
