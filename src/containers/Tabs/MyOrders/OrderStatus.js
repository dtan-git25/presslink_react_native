import { push } from '@nav';
import { FlatListHandler, OrderPackageCard, PackageCard } from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../../actions/ServiceAction';
import constant from '@constants';
import { PENDING_ORDERS } from '@actionTypes';
import { ACCEPTED_ORDERS } from '@actionTypes';
import { REJECTED_ORDERS } from '@actionTypes';
import { COMPLETED_ORDERS } from '@actionTypes';

const OrderStatus = props => {
  const dispatch = useDispatch()
  const onDetail = (item) => () => {
    push('PackageDetail', { key: props.data.key, orderDetails: item })
  }
  let orderReducer = useSelector((store) => store[props.data.reducer]);


  useEffect(() => {
    getOrders()
  }, [])
  const getOrders = (isConcat = false, page = 1) => {
    let params = { page, limit: 10 }
    dispatch(
      request(
        constant.order + `?status=${props.data.key}&sort_column=created_at&sort_order=desc`,
        constant.serviceTypes.GET,
        params,
        props.data.actionType,
        false,
        isConcat,
        cbOrdersSuccess,
        cbOrdersFailure,
        props.data.actionType
      )
    )
  }

  function cbOrdersSuccess(res) { }

  function cbOrdersFailure() { }





  const { data, meta, isFetching } = orderReducer;



  const renderItem = ({ item }) => <OrderPackageCard isSeeker={true} orderItemCompleteDetails={item.order_items} data={item.order_items.service} orderPrice={item?.order_items?.price} onPress={onDetail(item, props.data.key)} />;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.bg }}>
      <FlatListHandler
        data={data}
        renderItem={renderItem}
        style={styles.flex}
        isFetching={isFetching}
        fetchRequest={getOrders}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};



const renderSeparator = () => (
  <View
    style={{
      height: Metrics.widthRatio(1),
      backgroundColor: Colors.bg.bg,
    }}
  />
)

const styles = StyleSheet.create({
  flex: { flex: 1 }
})

export default OrderStatus;
