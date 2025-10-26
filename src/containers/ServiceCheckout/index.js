import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ButtonView,
  ImageHandlerUpdated,
  AppButton,
  Schedule,
  InputTextField,
  BottomSheetHandler,
  DateTimePickerHandler,
  Form,
  FlashMessage, Screen,
  MaterialTextField,
} from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import { Text, ScrollView, View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStyles, Images } from '@theme';
import { CalendarList } from 'react-native-calendars';
import { popToTop, push } from '@nav';
import Modal, { ModalContent } from 'react-native-modals';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import constant from '@constants';
import { PENDING_ORDERS } from '@actionTypes';
import { DUMP } from '@actionTypes';
import { Rating } from 'react-native-ratings';
import { DEFAULT_CARD } from '@actionTypes';

let formHandler = null
const todaysDate = new Date()
const ServiceCheckout = props => {
  const dateTimePickerRef = useRef();
  let ratingNo = '1'
  const { id, price } = props.route.params.serviceDetails
  const dispatch = useDispatch()
  const [state, setState] = useState({
    startTime: moment().format('LT'),
    endTime: 'Select End Time',
    isDatePicker: true,
    isCheckoutModal: false,
    orderId: '',
    day: moment(todaysDate).format("DD"),
    extractedTime: todaysDate.toLocaleTimeString(),
    startTimeObj: new Date(),
    month: todaysDate.toLocaleString('en-us', { month: 'short' }),
    weekday: moment(todaysDate).format("dddd"),
    dateString: moment(todaysDate).format("YYYY-MM-DD"),
    address: "Texas City, TX, USA",
    longitude: '-94.90270019999998',
    latitude: '29.383844999999965',
    dateSelected: ''
  })
  const defaultCard = useSelector(({ defaultCardReducer }) => defaultCardReducer.data)

  const cbOnEditLocation = (location) => {
    setState(s => ({ ...s, address: location.address, longitude: location.longitude, latitude: location.latitude }));
  }

  const openPicker = useCallback(() => dateTimePickerRef.current.showHideDatePicker())

  const cbOnPressDateTimePicker = useCallback(res => setDate(res))
  const cbOnDayPress = useCallback(res => setMonth(res))
  const setDate = (res) => {
    let extractedTime = res.toLocaleTimeString()
    let time = moment(res).format('LT');
    setState(s => ({ ...s, startTime: time, extractedTime, startTimeObj: res }));
  }

  const setMonth = (res) => {
    let date = new Date(res.dateString);
    let month = date.toLocaleString('en-us', { month: 'short' });
    let weekday = moment.utc(date).format("dddd")
    setState(s => ({ ...s, day: res.day, month, weekday, dateString: res.dateString, dateSelected: { [res.dateString]: { selected: true, selectedColor: Colors.primary.violet } } }))
  }

  const openCalendar = () => {
    setState(s => ({ ...s, isDatePicker: !s.isDatePicker }))
  }

  const closecalendar = () => setState(s => ({ ...s, isDatePicker: !s.isDatePicker }), setTimeout(() => {
    dateTimePickerRef.current.showHideDatePicker()
  }, 2000))

  const toggleCheckOutModal = useCallback(() => setState(s => ({ ...s, isCheckoutModal: !s.isCheckoutModal })))



  const _orderPlacedApiRequest = () => {
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();
    if (isValid) {
      if (state.dateString == '') {
        FlashMessage({ message: 'Please select date' })
        return
      }
      if (state.extractedTime == '') {
        FlashMessage({ message: 'Please select time' })
        return
      }
      if (Object.keys(defaultCard).length === 0) {
        FlashMessage({ message: 'Please select payment method' })
        return
      }

      let today = moment().format("YYYY-MM-DD");
      let todaytime = moment().format('YYYY-MM-DD h:mm a');;
      const t1 = moment().format("YYYY-MM-DD") + ` ${state.startTime}`;

      let date_time = state.dateString + ' ' + state.extractedTime
      if (today == state.dateString && moment(state.startTimeObj).isBefore(new Date())) {
        FlashMessage({ message: 'Order cannot be scheduled on past time' })
        return
      }
      let formData = new FormData();
      formData.append('service_id', id);
      if (payload.additional_note != '') { formData.append('additional_note', payload.additional_note); }
      if (payload.address) { formData.append('address', payload.address); }
      formData.append('date_time', date_time);
      formData.append('card_id', defaultCard?.id);
      formData.append('latitude', state.latitude);
      formData.append('longitude', state.longitude);
      console.log('formData', formData)
      dispatch(
        request(
          constant.order,
          constant.serviceTypes.POST,
          formData,
          DUMP,
          true,
          false,
          cbSuccess,
          cbFailure,
          DUMP,
        ),
      );
    }
  };

  function cbSuccess(res) {
    setState(s => ({ ...s, orderId: res.order_items.order_id }))
    dispatch(
      generalSaveAction(PENDING_ORDERS.ADD, {
        ...res,
        isAddAtZero: true
      }),

    )
    toggleCheckOutModal()
  }
  function cbFailure(error) { }


  const getDefaultCard = () => {
    dispatch(
      request(
        constant.defaultCard,
        constant.serviceTypes.GET,
        {},
        DEFAULT_CARD,
        false,
        false,
        cbgetDefaultCardSuccess,
        cbgetDefaultCardFailure,
        DEFAULT_CARD,
      ),
    );
  }

  function cbgetDefaultCardSuccess() { }
  function cbgetDefaultCardFailure() { }

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getDefaultCard()
    });
    return unsubscribe;
  }, [props.navigation]);


  const ModalCheckout = () => (
    <>
      <View style={styles.submitedMsg}>
        <Text style={styles.submitedMsgTxt}>Thank You!</Text>
        <Text style={styles.CheckoutTitle}>
          Your order has been submitted successfully
        </Text>
      </View>
      <View style={styles.CheckoutBottom}>
        <ButtonView
          onPress={() => {
            toggleCheckOutModal();
            popToTop();
          }}
          style={styles.CheckoutBtnC}>
          <Text style={AppStyles.gbRe(16, Colors.SocialButton.red)}>Okay</Text>
        </ButtonView>
        <ButtonView
          onPress={() => {
            toggleCheckOutModal();
            push('Home', { screen: 'MyOrders' });
          }}
          style={styles.CheckoutBtnC}>
          <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
            View Orders
          </Text>
        </ButtonView>
      </View>
    </>
  );


  const Row = ({ img, title, imgStyle }) => (
    <View style={styles.rowContainer}>
      <Image
        source={img}
        style={[{ marginRight: Metrics.baseMargin }, imgStyle]}
      />
      <Text style={AppStyles.gbRe(13)}>{title}</Text>
    </View>
  );
  const DatePickerHeader = () => (
    <View style={[styles.rowAlign, { margin: Metrics.smallMargin }]}>
      <ButtonView onPress={openCalendar}>
        <Text style={AppStyles.gbRe(15, Colors.SocialButton.red)}>Cancel</Text>
      </ButtonView>
      <Text style={AppStyles.gbRe(15)}>Select Event Date</Text>
      <ButtonView onPress={closecalendar}>
        <Text style={AppStyles.gbRe(15, Colors.primary.violet)}>Confirm</Text>
      </ButtonView>
    </View>
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Screen style={styles.container}>
        <ScrollView bounces={false}>
          <Form ref={ref => (formHandler = ref)}>
            {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
              const { optional } = Form.INPUTS(refCollector, onSubmitEditing);
              return (
                <>
                  <View style={[styles.content, { paddingHorizontal: Metrics.baseMargin }]}>
                    <View style={styles.topbar}>
                      <View style={styles.rowAlign}>
                        <Image source={Images.location} style={styles.avater} />
                        <Text style={AppStyles.gbRe(13)}>My Address</Text>
                      </View>
                      <ButtonView
                      // disable={true}
                      // onPress={() => push('Location', { forCheckoutAddress: true, cbOnEditLocation })}
                      >
                        <Image source={Images.icEditWhite} style={styles.editIcon} />
                      </ButtonView>
                    </View>

                    <ImageHandlerUpdated
                      style={styles.coverImage}
                      source={Images.icMap}
                    />
                    <View style={[styles.content, { margin: 0, padding: 0 }]}>
                      <InputTextField
                        placeholder={'Type your address here'}
                        style={styles.inputTxt}
                        {...optional({ identifier: 'address' })}
                        placeholderTextColor={Colors.txt.slate}
                        value={state.address}
                        error={"Address is required"}
                        editable={false}
                      // onPress={() => push('Location', { forCheckoutAddress: true, cbOnEditLocation })}
                      />
                    </View>
                  </View>

                  <Schedule
                    onPressDate={openCalendar}
                    onPressStartTime={openPicker}
                    startTime={state.startTime}
                    selectedDay={state.day}
                    selectedMonth={state.month}
                    weekday={state.weekday}
                  />
                  <View style={[styles.content]}>
                    <ButtonView>
                      <Row img={Images.icPayment} title={'Pay via credit card'} />
                    </ButtonView>
                    <ButtonView
                      onPress={() => push('PaymentMethod')}
                      style={[styles.rowAlign, styles.cardNum]}>
                      <Row
                        img={defaultCard?.brand == "Visa" ? Images.Visa : defaultCard?.brand == "MasterCard" ? Images.MasterCard : Images.icAdd}
                        title={Object.keys(defaultCard).length !== 0 ? `xxxx ${defaultCard?.last4}` : 'Add Payment'}
                        imgStyle={AppStyles.imgStyle(27)}
                      />
                      <Image
                        source={Images.icRightArrow}
                        style={AppStyles.imgStyle(12)}
                      />
                    </ButtonView>
                  </View>

                  <View style={[styles.content, styles.mbBase]}>
                    <Text style={AppStyles.gbRe(13, Colors.primary.violet)}>
                      Additional Notes
                    </Text>
                    <InputTextField
                      {...optional({ identifier: "additional_note" })}
                      placeholder={'Type your text here'}
                      multiline={true}
                      style={styles.multiLineTxt}
                      placeholderTextColor={Colors.txt.slate}
                    />
                  </View>
                </>
              );
            }}
          </Form>
          <View style={styles.content}>
            <View style={[styles.rowAlign, styles.bottom]}>
              <Text style={AppStyles.gbRe(16, Colors.txt.lGrey)}>Sub Total</Text>
              <Text style={AppStyles.gbRe(16, Colors.txt.lGrey)}>${price}</Text>
            </View>
            <View style={styles.rowAlign}>
              <Text style={AppStyles.gbRe(16)}>Total (incl. VAT)</Text>
              <Text style={AppStyles.gbRe(16)}>${price}</Text>
            </View>
            <AppButton
              title={'Confirm'}
              style={styles.btn}
              onPress={_orderPlacedApiRequest}
            />
          </View>

        </ScrollView>
      </Screen>
      <DateTimePickerHandler
        ref={dateTimePickerRef}
        cbOnPressDateTimePicker={cbOnPressDateTimePicker}
        mode={'time'}
        minimumDate={state.dateString == moment().format("YYYY-MM-DD") ? new Date() : undefined}
      />

      <BottomSheetHandler
        bottomSheetHeight={Metrics.screenHeight - Metrics.heightRatio(150)}
        isOpen={state.isDatePicker}>
        <DatePickerHeader />
        <CalendarList
          minDate={todaysDate}
          onDayPress={cbOnDayPress}
          markedDates={state.dateSelected}
        />
      </BottomSheetHandler>

      <Modal
        visible={state.isCheckoutModal}
      // onTouchOutside={toggleCheckOutModal}
      >
        <ModalContent style={styles.modalContent}>
          <ModalCheckout />
        </ModalContent>
      </Modal>


    </SafeAreaView>
  );
};

export default ServiceCheckout;
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    marginTop: Metrics.heightRatio(2),
    backgroundColor: Colors.bg.white,
    padding: Metrics.baseMargin,
  },
  row: {
    flexDirection: 'row',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.smallMargin,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  paddingR: {
    paddingRight: Metrics.baseMargin,
  },
  avater: {
    ...AppStyles.imgStyle(16),
    tintColor: Colors.primary.violet,
    marginRight: Metrics.smallMargin,
  },
  editIcon: {
    ...AppStyles.imgStyle(15),
    tintColor: Colors.txt.mGrey,
  },
  schedule: {
    flexDirection: 'row',
    marginBottom: Metrics.baseMargin,
  },
  mbBase: { marginBottom: Metrics.baseMargin },

  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.baseMargin - 4,
  },
  feedbackTxt: { marginBottom: -10, marginTop: Metrics.heightRatio(10), ...AppStyles.gbRe(14, Colors.primary.violet) },
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
  cardNum: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.txt.lBlue,
    marginVertical: Metrics.heightRatio(6),
  },
  inputTxt: {
    borderBottomWidth: 1,
    ...AppStyles.gbRe(13),
    borderColor: Colors.txt.lBlue,
  },
  multiLineTxt: {
    borderBottomWidth: 1,
    ...AppStyles.gbRe(13),
    borderColor: Colors.txt.lBlue,
    height: Metrics.heightRatio(80)
  },
  bottom: {
    paddingBottom: Metrics.doubleBaseMargin,
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    minHeight: Metrics.heightRatio(38),
    marginTop: Metrics.doubleBaseMargin,
  },
  modalContent: { width: Metrics.screenWidth - Metrics.widthRatio(52) },
  CheckoutBtn: {
    width: '30%',
    backgroundColor: Colors.bg.white,
  },
  CheckoutTitle: {
    ...AppStyles.gbRe(16),
    paddingHorizontal: Metrics.baseMargin,
    textAlign: 'center',
  },
  CheckoutBtnTxt: {
    flex: 0,
    color: Colors.primary.violet,
  },
  formStyle: {
    width: '100%', marginTop: 10
  },
  CheckoutBtnC: {
    padding: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: Colors.bg.lGrey,
  },
  CheckoutBottom: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  submitedMsg: {
    marginBottom: Metrics.heightRatio(52),
    alignItems: 'center',

  },
  submitedMsgTxt: {
    ...AppStyles.gbSb(18),
    marginBottom: Metrics.smallMargin,
  },
  CheckoutModalContent: {
    marginBottom: Metrics.heightRatio(46)
  },
});
