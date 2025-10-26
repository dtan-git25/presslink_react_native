import { ButtonView, RippleBtn } from '@reuseableComponents';
import { AppStyles, Colors, Metrics } from '@theme';
import React, { useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Tabs = ({ scrollview, animationHandle }) => {
  const onOverview = useCallback(
    () =>
      scrollview.current?.scrollTo({
        x: 0,
        animated: true,
      }),
    [],
  );

  const onServices = useCallback(
    () =>
      scrollview.current?.scrollTo({
        x: Metrics.screenWidth,
        animated: true,
      }),
    [],
  );

  const onReviews = useCallback(
    () =>
      scrollview.current?.scrollTo({
        x: Metrics.screenWidth * 2,
        animated: true,
      }),
    [],
  );

  const opacityAnimator = useCallback(
    ({ inputRange, outputRange }) =>
      animationHandle.interpolate({
        inputRange,
        outputRange,
        extrapolate: 'clamp',
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <RippleBtn style={styles.tabBtn} onPress={onOverview} key="overview">
        <Animated.Text
          style={{
            ...styles.titleTabViolet,
            opacity: opacityAnimator({
              inputRange: [0, Metrics.screenWidth - 1],
              outputRange: [1, 0],
            }),
          }}>
          Overview
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.titleTab,
            opacity: opacityAnimator({
              inputRange: [0, Metrics.screenWidth - 1],
              outputRange: [0, 1],
            }),
          }}>
          Overview
        </Animated.Text>
      </RippleBtn>
      <RippleBtn style={styles.tabBtn} onPress={onServices} key="services">
        <Animated.Text
          style={{
            ...styles.titleTabViolet,
            opacity: opacityAnimator({
              inputRange: [0, Metrics.screenWidth, Metrics.screenWidth * 2 - 1],
              outputRange: [0, 1, 0],
            }),
          }}>
          Services
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.titleTab,
            opacity: opacityAnimator({
              inputRange: [0, Metrics.screenWidth, Metrics.screenWidth * 2 - 1],
              outputRange: [1, 0, 1],
            }),
          }}>
          Services
        </Animated.Text>
      </RippleBtn>
      <RippleBtn style={styles.tabBtn} onPress={onReviews} key="reviews">
        <Animated.Text
          style={{
            ...styles.titleTabViolet,
            opacity: opacityAnimator({
              inputRange: [0, Metrics.screenWidth * 3],
              outputRange: [0, 1],
            }),
          }}>
          Reviews
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.titleTab,
            opacity: opacityAnimator({
              inputRange: [0, Metrics.screenWidth * 3],
              outputRange: [1, 0],
            }),
          }}>
          Reviews
        </Animated.Text>
      </RippleBtn>
      <Animated.View
        style={{
          width: Metrics.screenWidth / 3,
          height: Metrics.widthRatio(2),
          backgroundColor: Colors.primary.violet,
          position: 'absolute',
          bottom: 0,
          left: 0,
          transform: [
            {
              translateX: animationHandle.interpolate({
                inputRange: [0, Metrics.screenWidth, Metrics.screenWidth * 2],
                outputRange: [
                  0,
                  Metrics.screenWidth / 3,
                  Metrics.screenWidth - Metrics.screenWidth / 3,
                ],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      />
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: Metrics.screenWidth,
    height: Metrics.widthRatio(46),
    borderBottomColor: Colors.bg.bg,
    borderBottomWidth: Metrics.widthRatio(1.5),
    backgroundColor: Colors.bg.white,
    paddingTop: Metrics.widthRatio(14),
  },
  tabBtn: {
    width: Metrics.screenWidth / 3,
  },
  titleTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    ...AppStyles.gbRe(14, Colors.txt.lGrey),
  },
  titleTabViolet: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    ...AppStyles.gbRe(14, Colors.primary.violet),
  },
});
