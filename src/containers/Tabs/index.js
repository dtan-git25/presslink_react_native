import React from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import Home from './Home';
import MyProfile from './MyProfile';
import MyOrders from './MyOrders';
import Settings from './Settings';

import { AppStyles, Images, Metrics, Colors } from '@theme';
import utility from '@utils';

export default ({ route }) => {
  let isIndex = route?.params?.isIndex;
  isIndex = utility._isUndefined(isIndex) ? 0 : isIndex;

  const FirstRoute = () => <Home />;
  const SecondRoute = () => <MyOrders />;
  const ThirdRoute = () => <MyProfile />;
  const FourthRoute = () => <Settings />;

  const renderScene = SceneMap({
    home: FirstRoute,
    orders: SecondRoute,
    profile: ThirdRoute,
    settings: FourthRoute,
  });

  const routes = [
    { key: 'home', title: 'Home' },
    { key: 'orders', title: 'My Orders' },
    { key: 'profile', title: 'My Profile' },
    { key: 'settings', title: 'Settings' },
  ];

  const renderLabel = ({ route, focused }) => {
    const txtStyle = {
      ...AppStyles.gbRe(12, Colors.txt.lGrey),
      color: focused ? Colors.primary.violet : Colors.txt.lGrey,
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
    const translateX = Animated.multiply(position, Metrics.screenWidth / 4);
    return (
      <Animated.View
        style={[
          {
            height: 4,
            width: Metrics.screenWidth / 4,
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

  const onIndexChange = React.useCallback(ind => { });

  return (
    <View edges={['bottom', 'top']} style={styles.safeArea}>
      <TabView
        tabBarPosition="bottom"
        navigationState={{
          index: isIndex,
          routes,
        }}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={styles.initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // safeArea: { flex: 1, backgroundColor: Colors.bg.white },
  safeArea: { flex: 1, backgroundColor: Colors.bg.white, paddingTop: Platform.OS === 'ios' ? Metrics.heightRatio(25) : 0, paddingBottom: Platform.OS === 'ios' ? Metrics.heightRatio(13) : 0 },

  initialLayout: { width: Metrics.screenWidth },
  indicator: {
    width: '70%',
    height: '70%',
    backgroundColor: Colors.primary.violet,
  },
});
