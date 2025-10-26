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
import _ from 'lodash';

const routes = [
  { key: 'Pending', title: 'Pending' },
  { key: 'Accepted', title: 'Accepted' },
  { key: 'Rejected', title: 'Rejected' },
  { key: 'Completed', title: 'Completed' },
];

const renderScene = SceneMap({
  Pending: () => <OrderStatus data={{ key: '0', reducer: "pendingOrderReducer", actionType: PENDING_ORDERS }} />,
  Accepted: () => <OrderStatus data={{ key: '1', reducer: "acceptedOrderReducer", actionType: ACCEPTED_ORDERS }} />,
  Rejected: () => <OrderStatus data={{ key: '2', reducer: "rejectedOrderReducer", actionType: REJECTED_ORDERS }} />,
  Completed: () => <OrderStatus data={{ key: '3', reducer: "completedOrderReducer", actionType: COMPLETED_ORDERS }} />,
});


export default params => {

  const [state, setState] = useState({
    index: 0,
    routes
  });

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

  const renderTabBar = props => (
    <View>
      <TabBar
        {...props}
        renderLazyPlaceholder={renderLazyPlaceholder}
        style={{ backgroundColor: Colors.bg.white }}
        renderLabel={renderLabel}
        renderIndicator={renderIndicator}
      />
      {/* <View style={styles.dateView}>
        <Text style={styles.txtDesc}>
          Sep 27,2020 
        </Text>
      </View> */}
    </View>

  );

  const onIndexChange = React.useCallback(index => setState(s => ({ ...s, index })));

  return (
    <View style={{ flex: 1 }}>
      <TabView
        lazy
        navigationState={state}
        tabBarPosition="top"
        renderLazyPlaceholder={renderLazyPlaceholder}
        renderScene={renderScene}
        onIndexChange={_.debounce(onIndexChange, 1000)}
        initialLayout={styles.initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const renderLazyPlaceholder = () => <Loader style={styles.loader} />

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
  loader: { flex: 1, backgroundColor: Colors.bg.bg },
  dateView: { backgroundColor: Colors.bg.bg, paddingVertical: Metrics.heightRatio(10), paddingHorizontal: Metrics.heightRatio(20) }
});
