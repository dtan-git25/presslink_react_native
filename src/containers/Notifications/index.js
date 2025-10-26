import { NOTIFICATION } from '@actionTypes';
import constant from '@constants';
import { FlatListHandler } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {request } from '../../actions/ServiceAction';

const Notifications = params => {
  const dispatch = useDispatch()
  const renderSeparator = useCallback(() => <View style={{ height: Metrics.smallMargin }} />, []);


  const getNotifications = (isConcat = false, page = 1) => {
    let params = { page, limit: 10 }
    dispatch(
      request(
        constant.notification,
        constant.serviceTypes.GET,
        params,
        NOTIFICATION,
        false,
        isConcat,
        cbSuccess,
        cbFailure,
        NOTIFICATION
      )
    )
  }

  function cbSuccess(res) {

  }

  function cbFailure() {

  }


  useEffect(() => {
    getNotifications()
  }, [])

  const notificationData = useSelector(({ notificationReducer }) => notificationReducer)

  const { data, meta, isFetching } = notificationData

  const renderItem = ({ item }) => (
    <View
      style={styles.mainView}>
      <Image source={Images.icNotification} />
      <Text
        style={styles.notiTxt}>
        {item.description}
      </Text>
      <Text
        style={styles.timeTxt}>
        {moment(item?.created_at).startOf('hour').fromNow()}
      </Text>
    </View>
  );

  return (
    <View style={styles.bg}>
      <View style={styles.view} />
      <FlatListHandler
        data={data}
        renderItem={renderItem}
        fetchRequest={getNotifications}
        isFetching={isFetching}
        meta={meta}
        ItemSeparatorComponent={renderSeparator}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.bg.white,
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    marginHorizontal: Metrics.baseMargin,
    borderRadius: Metrics.smallMargin,
  },
  notiTxt: {
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
    paddingHorizontal: Metrics.baseMargin,
    width: Metrics.screenWidth / 1.7,
  },
  timeTxt: {
    ...AppStyles.gbRe(10, Colors.txt.lGrey),
    flex: 1,
  },
  bg: { backgroundColor: Colors.bg.bg, flex: 1 },
  view: { height: Metrics.baseMargin }
})

export default Notifications;
