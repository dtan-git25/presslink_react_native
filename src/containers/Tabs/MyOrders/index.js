import React, { useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import OrderStatus from './OrderStatus';

import { Metrics, Colors, AppStyles } from '@theme';
import { Loader, NavTitle } from '@reuseableComponents';
import { PENDING_ORDERS } from '@actionTypes';
import { ACCEPTED_ORDERS } from '@actionTypes';
import { REJECTED_ORDERS } from '@actionTypes';
import { COMPLETED_ORDERS } from '@actionTypes';

// const routes = [
//   { key: 'Pending', title: 'Pending' },
//   { key: 'Accepted', title: 'Accepted' },
//   { key: 'Rejected', title: 'Rejected' },
//   { key: 'Competed', title: 'Competed' },
// ];

// const renderScene = SceneMap({
//   Pending: () => <OrderStatus data={{ key: '0', reducer: "pendingOrderReducer", actionType: PENDING_ORDERS }} />,
//   Accepted: () => <OrderStatus data={{ key: '1', reducer: "acceptedOrderReducer", actionType: ACCEPTED_ORDERS }} />,
//   Rejected: () => <OrderStatus data={{ key: '2', reducer: "rejectedOrderReducer", actionType: REJECTED_ORDERS }} />,
//   Competed: () => <OrderStatus data={{ key: '3', reducer: "completedOrderReducer", actionType: COMPLETED_ORDERS }} />,
// });


function MyOrders(props) {

  const [index, setTabIndex] = useState(0);

  const [routes] = useState([
    { key: 'pending', title: 'Pending' },
    { key: 'accepted', title: 'Accepted' },
    { key: 'rejected', title: 'Rejected' },
    { key: 'completed', title: 'Completed' },
  ]);

  const renderLabel = ({ route, focused }) => {
    const txtStyle = {
      ...AppStyles.gbRe(12, Colors.txt.lGrey),
      color: focused ? Colors.primary.violet : Colors.txt.lGrey,
    };
    return <Text style={txtStyle}>{route.title}</Text>;
  };

  const renderIndicator = props => {
    const { position } = props;
    const translateX = Animated.multiply(position, Metrics.screenWidth / 4);
    return (
      <Animated.View
        style={{
          transform: [{ translateX }],
          ...styles.indicator,
        }}
      />
    );
  };

  // const renderTabBar = props => (
  //   <View>
  //     <TabBar
  //       {...props}
  //       style={{ backgroundColor: Colors.bg.white }}
  //       renderLabel={renderLabel}
  //       renderIndicator={renderIndicator}
  //     />
  //     {/* <View style={styles.dateView}>
  //       <Text style={styles.txtDesc}>
  //         Sep 27,2020
  //       </Text>
  //     </View> */}
  //   </View>

  // );

  const renderTabBar = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        renderLabel={({ route, focused, color }) => (
          <Text
            style={{
              ...AppStyles.gbRe(12, Colors.txt.lGrey),
              color: focused ? Colors.primary.violet : Colors.txt.lGrey,
            }}>
            {route.title}
          </Text>
        )}
      />
    );
  };

  const onIndexChange = React.useCallback(index => setState(s => ({ ...s, index })));


  const renderScene = ({ route }) => {

    switch (route.key) {
      case 'pending':
        return <OrderStatus data={{ key: '0', reducer: "pendingOrderReducer", actionType: PENDING_ORDERS }} />;
      case 'accepted':
        return <OrderStatus data={{ key: '1', reducer: "acceptedOrderReducer", actionType: ACCEPTED_ORDERS }} />;
      case 'rejected':
        return <OrderStatus data={{ key: '2', reducer: "rejectedOrderReducer", actionType: REJECTED_ORDERS }} />;
      case 'completed':
        return <OrderStatus data={{ key: '3', reducer: "completedOrderReducer", actionType: COMPLETED_ORDERS }} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <NavTitle title={'My Orders'} /> */}
      {/* <TabView
        lazy
        navigationState={state}
        tabBarPosition="top"
        renderLazyPlaceholder={renderLazyPlaceholder}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={styles.initialLayout}
        renderTabBar={renderTabBar}
      /> */}


      <TabView
        lazy
        navigationState={{ index: index, routes }}
        renderLazyPlaceholder={renderLazyPlaceholder}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}

        onTabPress={() => console.log('tab pressed')}
      />
    </View>
  );
};

export default MyOrders;

const renderLazyPlaceholder = () => <Loader style={{ flex: 1, backgroundColor: Colors.bg.bg }} />

const styles = StyleSheet.create({
  initialLayout: { width: Metrics.screenWidth },
  indicator: {
    height: Metrics.widthRatio(2.5),
    backgroundColor: Colors.primary.violet,
    position: 'absolute',
    bottom: 0,
    width: Metrics.screenWidth / 4,
  },
  txtDesc: {
    ...AppStyles.gbRe(15, Colors.txt.black),
    marginVertical: Metrics.smallMargin,
    lineHeight: 17,
  },
  dateView: { backgroundColor: Colors.bg.bg, paddingVertical: Metrics.heightRatio(10), paddingHorizontal: Metrics.heightRatio(20) },


  tabbar: {
    backgroundColor: 'white',
  },
  tab: {
    width: Metrics.screenWidth / 4,
  },
  indicator: {
    backgroundColor: Colors.primary.violet,
  },
});
