import {
  ButtonView,
  ImageHandlerUpdated,
  AppButton,
  Schedule,
  OrderPackageCard,
} from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import React, { useCallback, useRef, useState } from 'react';
import { Text, ScrollView, View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStyles, Images } from '@theme';
import moment from 'moment';
import constant from '@constants';
import { useDispatch } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import { push, pop } from '@nav';
import { PENDING_ORDERS } from '@actionTypes';
import { REJECTED_ORDERS } from '@actionTypes';
import { ACCEPTED_ORDERS } from '@actionTypes';
import { COMPLETED_ORDERS } from '@actionTypes';

const OrderDetail = props => {
  const dispatch = useDispatch()
  const [orderStatus, setStatus] = useState("1")
  const params = props?.route?.params.key;
  const orderDetails = props?.route?.params?.orderDetails
  const seekerDetails = props?.route?.params?.orderDetails?.user
  const serviceDetails = props?.route?.params.orderDetails.order_items.service
  const { additional_note, date_time } = orderDetails
  const { name, image_url, cover_image_url, mobile_no } = seekerDetails
  const mDate = moment(`${orderDetails.date_time}`.split(" ")[0],)
  props.navigation.setOptions({
    title: serviceDetails.title,
    headerTitleStyle: styles.titleStyle,
    headerTitleAlign: 'center',
    headerTransparent: false
  });

  const pushTo = (screenName) => () => { push(screenName) }
  const changeStatusOfOrder = (status, startJob = '0') => () => {
    setStatus(status)
    let formData = new FormData();
    formData.append('_method', 'PUT')
    formData.append('status', `${status}`)
    if (startJob == '1') { formData.append('start_job', `${startJob}`) }
    dispatch(
      request(
        constant.order + `/${orderDetails.slug}`,
        constant.serviceTypes.POST,
        formData,
        null,
        true,
        false,
        cbSuccess,
        cbFailure,
      ),
    );
  }

  function cbSuccess(response) {
    dispatch(
      generalSaveAction((response.status == "1" && response.start_job == null) ? ACCEPTED_ORDERS.ADD : response.status == "2" ? REJECTED_ORDERS.ADD : response.status == '3' ? COMPLETED_ORDERS.ADD : ACCEPTED_ORDERS.UPDATE, {
        ...response,
        isAddAtZero: true
      }
      )
    )
    dispatch(
      generalSaveAction((response.status == "1" && response.start_job == null) ? PENDING_ORDERS.DELETE : response.status == "2" ? PENDING_ORDERS.DELETE : response.status == '3' ? ACCEPTED_ORDERS.DELETE : null,
        {
          ...response, isDeleteObj: true,
          isAddAtZero: true
        },
      )
    )
    pop()
  }
  function cbFailure(error) { }


  const ActionBtn = () => {
    switch (params.key) {
      case '0':
        return (
          <View style={styles.btnContent}>
            <AppButton
              backgroundColor={Colors.SocialButton.red}
              title="REJECT"
              onPress={changeStatusOfOrder("2")}
              style={styles.btn}
            />
            <AppButton
              backgroundColor={Colors.SocialButton.green}
              title="ACCEPT"
              onPress={changeStatusOfOrder("1")}
              style={styles.btn}
            />
          </View>
        );
        break;
      case '1':
        return (
          <View style={styles.btnContent}>
            {orderDetails.start_job == null
              ? (
                <AppButton
                  backgroundColor={Colors.SocialButton.purple}
                  title="Start Job"
                  onPress={changeStatusOfOrder("1", "1")}
                  style={styles.actionBtn}
                />
              ) : (
                <AppButton
                  backgroundColor={Colors.SocialButton.purple}
                  title="Mark as Completed"
                  onPress={changeStatusOfOrder("3")}
                  style={styles.actionBtn}
                />
              )
            }


          </View>
        );
        break;
      case '2':
        return (
          <View style={styles.btnContent}>
          </View>
        );
        break;
      default:
        return (
          <View style={styles.btnContent}>
            <AppButton
              backgroundColor={Colors.SocialButton.green}
              title="COMPLETED"
              onPress={() => { }}
              style={styles.actionBtn}
              left={
                <Image
                  source={Images.icCheckSuccess}
                  style={{ marginLeft: Metrics.widthRatio(140) }}
                />
              }
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView bounces={false}>
        <View style={[styles.content, { paddingHorizontal: Metrics.baseMargin }]}>
          <View style={styles.topbar}>
            <View style={styles.rowAlign}>
              <ImageHandlerUpdated
                source={{
                  uri: image_url,
                }}
                style={styles.avater}
              />
              <View>
                <Text style={AppStyles.gbSb(14, Colors.txt.slate)}>
                  {name}
                </Text>

                {/* <Text numberOfLines={2} ellipsizeMode="tail" style={styles.txtDesc}>
                  Order ID: {orderDetails?.order_items?.order_id}
                </Text> */}
              </View>
            </View>
            {params.key == 1 &&
              <ButtonView onPress={() => push('Chat', { otherUser: { ...seekerDetails, id: seekerDetails.id } })}>
                <Image source={Images.icMessage} />
              </ButtonView>
            }
          </View>

          <ImageHandlerUpdated
            style={styles.coverImage}
            source={Images.icMap}
          />
          <Text style={styles.locationTitle}>
            {orderDetails.address}
          </Text>
        </View>

        <View style={[styles.content]}>
          <OrderPackageCard data={serviceDetails} orderPrice={orderDetails?.order_items?.price} orderId={orderDetails?.order_items?.order_id} />
        </View>

        {/* <Schedule
          startTime={time}
          weekday={weekday}
          selectedMonth={month}
          selectedDay={date.getDate()}
          edit={false} /> */}

        <Schedule
          edit={false}
          selectedDay={mDate.format("DD")}
          weekday={mDate.format("dddd")}
          selectedMonth={mDate.format("MMM")}
          startTime={moment.utc(orderDetails.date_time).format('LT')}
        />

        <View style={[styles.content, { padding: Metrics.baseMargin }]}>
          <Text style={AppStyles.gbRe(13)}>Additional Note</Text>
          <Text style={styles.bottom}>
            {additional_note}
          </Text>
        </View>
        <ActionBtn />
      </ScrollView>
    </SafeAreaView >
  );
};

export default OrderDetail;
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    marginTop: Metrics.heightRatio(2),
    backgroundColor: Colors.bg.white,
    marginHorizontal: 0,
  },
  row: { flexDirection: 'row' },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  justifyContentCenter: { justifyContent: 'center' },
  paddingR: { paddingRight: Metrics.baseMargin },
  avater: {
    ...AppStyles.roundImage(40),
    marginRight: Metrics.smallMargin,
  },
  schedule: { flexDirection: 'row', marginBottom: Metrics.baseMargin },
  scheduleDate: {
    backgroundColor: Colors.txt.lGrey,
    paddingVertical: Metrics.heightRatio(6),
    width: Metrics.widthRatio(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginHorizontal: Metrics.baseMargin,
  },
  scheduleDay: {
    ...AppStyles.gbRe(12),
    marginBottom: Metrics.heightRatio(3),
  },
  scheduleDateTxt: {
    ...AppStyles.gbRe(12),
    marginBottom: Metrics.heightRatio(3),
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Metrics.baseMargin,
  },
  bottom: {
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
    marginTop: Metrics.smallMargin,
  },

  coverImage: {
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenWidth / 2.7,
    alignSelf: 'center',
    borderRadius: 6,
  },

  locationTitle: {
    ...AppStyles.gbRe(13),
    marginTop: Metrics.smallMargin,
    marginBottom: Metrics.baseMargin,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: Metrics.smallMargin,
  },
  btn: { width: '45%' },
  actionBtn: { width: '90%' },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400',
    textTransform: 'capitalize',

  },
  txtDesc: {
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
    // marginVertical: Metrics.smallMargin,
    lineHeight: 17,
  },
});
