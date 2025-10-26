import React, { useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { FlatListHandler, OrdersCard } from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import { useDispatch, useSelector } from 'react-redux';
import constant from '@constants';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import { PROVIDER_LIST } from '@actionTypes';

const Orders = ({ navigation, route }) => {
  const title = route?.params?.title;
  const slug = route?.params?.slug;
  const dispatch = useDispatch()


  const getProviders = () => {
    dispatch(
      request(
        constant.categoryList + `/${slug}`,
        constant.serviceTypes.GET,
        {},
        PROVIDER_LIST,
        false,
        false,
        cbgetProvidersSuccess,
        cbgetProvidersFailure,
        PROVIDER_LIST
      )
    )
  }

  function cbgetProvidersSuccess(res) { }

  function cbgetProvidersFailure() { }
  useEffect(() => {
    getProviders()
    return () => {
      dispatch(
        generalSaveAction(PROVIDER_LIST.SUCCESS,
          []
        ),
      )
    }
  }, [])

  const providerData = useSelector(({ providersReducer }) => providersReducer)

  const { data, meta, isFetching } = providerData;


  useLayoutEffect(() => {
    navigation &&
      title &&
      navigation.setOptions({
        title: route.params.title,
        headerTitleAlign: 'center',
      });
  }, []);

  const renderItem = ({ item }) => <OrdersCard data={item} />;

  return (
    <View style={styles.container}>
      <FlatListHandler
        style={styles.paddTop}
        data={data.providers}
        renderItem={renderItem}
        numColumns={2}
        fetchRequest={getProviders}
        isFetching={isFetching}
        meta={meta}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: Metrics.baseMargin,
    backgroundColor: Colors.bg.bg,
  },
  paddTop: {
    paddingTop: Metrics.baseMargin
  }
});
