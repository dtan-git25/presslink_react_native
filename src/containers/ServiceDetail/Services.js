import { SERVICE } from '@actionTypes';
import constant from '@constants';
import { push } from '@nav';
import { AppButton, FlatListHandler, OrderPackageCard } from '@reuseableComponents';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../actions/ServiceAction';
import { Colors, Metrics } from '@theme';
export default params => {
  const { id } = params.data.providerDetails;

  const dispatch = useDispatch()
  const getServices = (isConcat = false, page = 1) => {
    let params = { page }
    dispatch(
      request(
        constant.service + `?user_id=${id}`,
        constant.serviceTypes.GET,
        params,
        SERVICE,
        false,
        isConcat,
        cbServiceSuccess,
        cbServiceFailure,
        SERVICE
      )
    )
  }

  function cbServiceSuccess() {

  }
  function cbServiceFailure() { }


  useEffect(() => {
    getServices()
  }, [])

  const services = useSelector(({ providerServiceReducer }) => providerServiceReducer)
  const { data, meta, isFetching } = services;


  const onDetail = (item) => () => {
    push('ScheduleDetail', { serviceDetails: item })
  }

  const renderItem = ({ item, index }) => (
    index < 4 && < OrderPackageCard on showOrderId={false} data={item} key={item.url} onPress={onDetail(item)} />


  );

  const MoreServices = () => (
    <AppButton
      onPress={() => push("MoreServices", { providerId: id })}
      title="More Services"
      style={{ backgroundColor: Colors.bg.white }}
      textStyle={{ color: Colors.primary.violet }}
    />

  );

  const Separator = () => (
    <View
      style={styles.separatorStyle}
    />
  );

  return (
    <View style={{ width: Metrics.screenWidth, }}>
      <FlatListHandler
        bounces={false}
        data={data}
        renderItem={renderItem}
        fetchRequest={getServices}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item, index) => index}
        isFetching={isFetching}
        meta={meta}
        ListFooterComponent={data.length > 0 && <MoreServices />}

      />


    </View>
  );
};
const styles = StyleSheet.create({
  width100: { width: '100%' },
  separatorStyle: {
    width: Metrics.screenWidth,
    backgroundColor: Colors.bg.bg,
    height: Metrics.widthRatio(1.5),
  },
})