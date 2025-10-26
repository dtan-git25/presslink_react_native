import {
  ButtonView,
  ImageHandlerUpdated,
  ServiceSubHeader,
} from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OverView from './OverView';
import Reviews from './Reviews';
import Tabs from './Tabs';
import Services from './Services';
import { pop } from '@nav';

const ServiceDetail = params => {
  const providerDetails = params.route.params

  const { cover_image_url, id, business_name } = providerDetails.providerDetails;

  params.navigation.setOptions({
    headerLeft: () => (
      <ButtonView style={styles.containerBack} onPress={onBack}>
        <Image source={Images.icLeftArrow} />
      </ButtonView>
    ),
    headerTitleAlign: 'center',
    headerTitle: business_name,
    headerShown: true,
    headerTitleStyle: styles.titleStyle,
  });



  console.log('providerDetails.providerDetails', providerDetails.providerDetails)
  const scrollview = useRef();
  const scaleAnimtedValue = useRef(new Animated.Value(1.3)).current;
  const verticalScrollviewAnimatedValue = useRef(new Animated.Value(0)).current;
  const horizontalScrollviewAnimatedValue = useRef(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    Animated.timing(scaleAnimtedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const Header = () => {
    const scale = verticalScrollviewAnimatedValue.interpolate({
      inputRange: [-Metrics.screenWidth / 1.3 + Metrics.widthRatio(60), 0],
      // outputRange: [5 * 1.5, 1],
      //Changed
      outputRange: [5 * 0.5, 1],
      extrapolate: 'clamp',
    });
    const animationStyle = {
      transform: [{ scale }],
    };
    return (
      <Animated.View style={animationStyle}>
        <ImageHandlerUpdated
          style={styles.imgSubProfile}
          source={{
            uri: cover_image_url,

          }}
        />
        <ServiceSubHeader data={providerDetails.providerDetails} />
      </Animated.View>
    );
  };

  const eventVerticalScrollView = useCallback(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: verticalScrollviewAnimatedValue,
              },
            },
          },
        ],
        { useNativeDriver: true },
      ),
    [],
  );

  const eventHorizontalScrollView = useCallback(
    e =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: horizontalScrollviewAnimatedValue,
              },
            },
          },
        ],
        { useNativeDriver: true },
      ),
    [],
  );

  const onBack = () => pop();

  const Back = () => (
    <SafeAreaView style={styles.safeArea}>
      <ButtonView style={styles.containerBack} onPress={onBack}>
        <Image source={Images.icLeftArrow} />
      </ButtonView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView
      overScrollMode="always"
      edges={['bottom']}
      style={styles.container}>
      <Animated.ScrollView
        // bounces={false}
        style={{ transform: [{ scale: scaleAnimtedValue }] }}
        onScroll={eventVerticalScrollView()}
        showsVerticalScrollIndicator={false}>
        <Header />
        <Tabs
          scrollview={scrollview}
          animationHandle={horizontalScrollviewAnimatedValue}
        />
        <Animated.ScrollView
          onScroll={eventHorizontalScrollView()}
          ref={scrollview}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: Colors.bg.white }}>
          <OverView data={providerDetails} />
          <Services data={providerDetails} />
          <Reviews data={providerDetails} />
        </Animated.ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.white },
  safeArea: { position: 'absolute', top: Metrics.baseMargin, left: 0 },
  containerBack: {
    marginBottom: Metrics.heightRatio(5),
    ...AppStyles.centerAligned,
    width: Metrics.widthRatio(32),
    height: Metrics.widthRatio(32),
    ...AppStyles.lightShadow,
  },
  imgSubProfile: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.3,
  },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400',
    textTransform: 'capitalize',

  },
});

export default ServiceDetail;
