import React, { useLayoutEffect, useState } from 'react';
import { AppButton, ImageHandlerUpdated } from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import { Text, ScrollView, View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStyles } from '@theme';
import { push } from '@nav';

const ScheduleDetail = ({ navigation, route }) => {
  const { description, price, title, keywords } = route.params.serviceDetails

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerTitleStyle: styles.titleStyle,
      headerTitleAlign: 'center',

    });

  }, [navigation, title]);



  const Header = () => {
    return (
      <View>
        <ImageHandlerUpdated
          style={styles.coverImage}
          source={{
            uri: route.params.serviceDetails?.image?.image_src,
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView bounces={false}>
        <Header />
        <View style={styles.topbar}>
          <Text style={AppStyles.gbSb(15, Colors.txt.slate)}>
            {title}
          </Text>
          <Text style={AppStyles.gbSb(15, Colors.primary.violet)}>${price}</Text>
        </View>
        <Text style={styles.pragraph}>
          {description}
        </Text>
        <Text style={styles.tags}>
          {keywords.length > 0 &&
            `#${keywords.toString().replace(/,/g, ' #')}`
          }
        </Text>
        <AppButton
          title={'Schedule Service'}
          style={styles.btn}
          onPress={() => push('ServiceCheckout', { serviceDetails: route.params.serviceDetails })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleDetail;
const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row' },
  paddingR: { paddingRight: Metrics.baseMargin },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Metrics.baseMargin,
    backgroundColor: Colors.txt.white,
  },
  pragraph: {
    lineHeight: 17,
    paddingTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
  },
  mark: {
    ...AppStyles.gbSb(15, Colors.txt.slate),
    marginBottom: Metrics.smallMargin,
  },
  coverImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.3,
  },
  tags: {
    ...AppStyles.gbRe(12, Colors.primary.violet),
    margin: Metrics.baseMargin,
  },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400',
    textTransform: 'capitalize',

  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    width: Metrics.screenWidth - Metrics.baseMargin,
    alignSelf: 'center',
    marginTop: Metrics.xDoubleBaseMargin,
    minHeight: Metrics.heightRatio(38),
  },
});
