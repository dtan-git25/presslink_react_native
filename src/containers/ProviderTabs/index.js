import React from 'react';
import { View, Text, Image, Animated, StyleSheet, Platform } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { EventBusSingleton } from 'light-event-bus';

import Home from './Home';
import MyProfile from './MyProfile';
import MyOrders from './MyOrders';
import Inbox from './Inbox';
import More from './More';

import { AppStyles, Images, Metrics, Colors } from '@theme';

export default params => {
  const FirstRoute = () => <Home />;
  const SecondRoute = () => <MyOrders />;
  const ThirdRoute = () => <MyProfile />;
  const FourRoute = () => <Inbox />;
  const FiveRoute = () => <More />;

  const renderScene = SceneMap({
    home: FirstRoute,
    orders: SecondRoute,
    profile: ThirdRoute,
    chat: FourRoute,
    more: FiveRoute,
  });

  const routes = [
    { key: 'home', title: 'Home' },
    { key: 'orders', title: 'My Orders' },
    { key: 'profile', title: 'My Profile' },
    { key: 'chat', title: 'Chat' },
    { key: 'more', title: 'More' },
  ];

  const renderLabel = ({ route, focused }) => {
    const txtStyle = {
      ...AppStyles.gbRe(11, Colors.txt.lGrey),
      color: focused ? Colors.primary.violet : Colors.txt.lGrey,
      marginHorizontal: Platform.OS == 'android' ? -2 : 0,
    };
    return <Text style={txtStyle}>{route.title}</Text>;
  };

  const renderIcon = dat => {
    const { route, focused } = dat;
    imgStyle = {
      tintColor: focused ? Colors.primary.violet : Colors.txt.lGrey,
    };
    return <Image source={Images[route.key]} style={imgStyle} />;
  };

  const renderIndicator = props => {
    const { position } = props;
    const translateX = Animated.multiply(position, Metrics.screenWidth / 5);
    return (
      <Animated.View
        style={[
          {
            height: 4,
            width: Metrics.screenWidth / 5,
            transform: [{ translateX }],
            ...AppStyles.centerAligned,
          },
        ]}>
        <View style={styles.indicator} />
      </Animated.View>
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: Colors.bg.white }}
      renderLabel={renderLabel}
      renderIcon={renderIcon}
      indicatorStyle={{
        position: 'absolute',
        top: 0,
      }}
      renderIndicator={renderIndicator}
    />
  );

  const onIndexChange = React.useCallback(ind => ind == 2 && EventBusSingleton.publish("profileTabFocused"));

  return (
    <View edges={['bottom', 'top']} style={styles.safeArea}>
      <TabView
        tabBarPosition="bottom"
        navigationState={{ index: 0, routes }}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={styles.initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg.white, paddingTop: Platform.OS === 'ios' ? Metrics.heightRatio(25) : 0, paddingBottom: Platform.OS === 'ios' ? Metrics.heightRatio(13) : 0 },
  initialLayout: { width: Metrics.screenWidth },
  indicator: {
    width: '70%',
    height: '70%',
    backgroundColor: Colors.primary.violet,
  },
});