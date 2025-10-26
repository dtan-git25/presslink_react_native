import { FlatListHandler, OrderPackageCard, PackageCard } from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { push } from '@nav';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../../actions/ServiceAction';
import constant from '@constants';
import { PENDING_ORDERS } from '@actionTypes';
import { ACCEPTED_ORDERS } from '@actionTypes';
import { REJECTED_ORDERS } from '@actionTypes';
import { COMPLETED_ORDERS } from '@actionTypes';
const OrderStatus = props => {
  const dispatch = useDispatch()

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


  useEffect(() => {
    getOrders()
  }, [])

  let orderReducer = useSelector((store) => store[props.data.reducer])

  const renderItem = ({ item }) => (
    < OrderPackageCard
      data={item?.order_items?.service}
      orderPrice={item?.order_items?.price}
      orderId={item?.order_items?.order_id}
      onPress={() => push('OrderDetail', { key: props.data, orderDetails: item })}
    />
  );
  return (
    <View style={styles.mainView}>
      <FlatListHandler
        data={orderReducer.data}
        renderItem={renderItem}
        style={styles.flex}
        isFetching={orderReducer.isFetching}
        fetchRequest={getOrders}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

const renderSeparator = () => (
  <View
    style={styles.separator}
  />
)

const styles = StyleSheet.create({
  mainView: {
    flex: 1, backgroundColor: Colors.bg.bg
  },
  flex: { flex: 1 },
  separator: {
    height: Metrics.widthRatio(1),
    backgroundColor: Colors.bg.bg,
  }
})

export default OrderStatus;
