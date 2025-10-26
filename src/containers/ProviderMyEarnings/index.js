import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Image, SectionList, TextInput } from 'react-native';
import { AppButton, ButtonView, FlatListHandler, Form, ImageHandlerUpdated, MaterialTextField } from '@reuseableComponents';
import LinearGradient from 'react-native-linear-gradient';
import { Modal, ModalContent } from 'react-native-modals';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import { EarningCell } from '@components';
import utility from '../../utility';
import styles from './Styles';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../actions/ServiceAction';
import { INPUT_TYPES } from '../../reuseableComponents/FormHandlerUpdated/Constants';
import constant from '@constants';
import { DUMP } from '@actionTypes';
import StarRating from 'react-native-star-rating';
import { Calendar } from 'react-native-calendars';
import { MY_EARNINGS } from '@actionTypes';
import moment from 'moment';
import { USER } from '@actionTypes';

let formHandler = null;
function MyEarning(props) {
  const [state, setState] = useState({
    isMonthlyModal: false,
    isCashoutModal: false,
    selectedYear: new Date().getFullYear(),
    isCashOutSubmit: false,
    selectMonth: moment().month(),
    selectedMonthName: moment(new Date()).format("MMMM"),

  })

  const { isMonthlyModal, isCashoutModal, isCashOutSubmit, selectedYear, selectMonth, selectedMonthName } = state

  const user = useSelector(({ userReducer }) => userReducer.data)
  const earnings = useSelector(({ myEarningsReducer }) => myEarningsReducer)
  const { data, isFetching, meta } = earnings
  const { business_name, rating, total_ratings, total_reviews, total_earnings, total_remaining, slug } = user
  const dispatch = useDispatch()


  useEffect(() => {
    utility.getStatusbar('#00000000');
    myEarning()
    getUser()

  }, []);

  const _renderItem = useCallback(({ item, index }) => {
    return <EarningCell name={item.title} price={item.amount} date={item.date} />;
  }, []);

  const toggleCashoutModal = useCallback(() => setState(s => ({ ...s, isCashoutModal: !s.isCashoutModal })))
  const toggleMonthlyModal = useCallback(() => setState(s => ({ ...s, isMonthlyModal: !s.isMonthlyModal })))


  const renderCounts = (count, type) => {
    return (
      <View style={[styles.countContainer]}>
        <Text style={styles.paragraphStyle}>{type}</Text>
        <Text style={styles.countText}>{count}</Text>
      </View>
    );
  };

  const submitData = () => {
    const payload = formHandler.onSubmitForm();
    let formData = new FormData();
    if (payload) {
      formData.append('amount', payload.amount);
    }
    dispatch(
      request(
        constant.cashout,
        constant.serviceTypes.POST,
        formData,
        DUMP,
        true,
        false,
        cbSuccess,
        cbFailure,
        DUMP,
      ),
    )
  }

  function cbSuccess() {
    setState(s => ({ ...s, isCashOutSubmit: true, isCashoutModal: true }))
  }

  function cbFailure() { }


  const getUser = () => {
    dispatch(
      request(
        constant.user + `/${slug}`,
        constant.serviceTypes.GET,
        {},
        USER,
        false,
        false,
        cbUserSuccess,
        cbUserSuccessFailure,
        USER
      )
    )
  }

  function cbUserSuccess(res) { }

  function cbUserSuccessFailure(error) { }


  const selectedDate = (item, ind) => () => {
    setState(s => ({ ...s, selectMonth: ind, selectedMonthName: item.full }))
  }

  const myEarning = (isConcat = false, page = 1) => {
    setState(s => ({ ...s, isMonthlyModal: false }))
    dispatch(
      request(
        constant.myearnings,
        constant.serviceTypes.GET,
        {
          page, limit: 10,
          month: selectMonth + 1,
          year: selectedYear
        },
        MY_EARNINGS,
        false,
        false,
        cbmyEarningSuccess,
        cbmyEarningFailure,
        MY_EARNINGS,
      ),
    )
  }

  function cbmyEarningSuccess() {
    getUser()
  }

  function cbmyEarningFailure() { }


  const incrementOrDecrement = (type) => () => {
    let previous = selectedYear
    if (type == "increment") {
      let now = previous + 1
      setState(s => ({ ...s, selectedYear: now }));

    }
    if (type == "decrement") {
      let now = previous - 1
      if (now > 0) {
        setState(s => ({ ...s, selectedYear: now }));
      }
    }
  }


  const MonthPicker = () => (
    <>
      <View style={styles.selectYear}>
        <ButtonView onPress={incrementOrDecrement('decrement')}>
          <Image source={Images.icArrowDropLeft} />
        </ButtonView>
        <Text style={AppStyles.gbSb(24)}> {selectedYear} </Text>
        <ButtonView onPress={incrementOrDecrement('increment')}>
          <Image source={Images.icArrowDropRight} />
        </ButtonView>

      </View>

      <View style={styles.monthsContent}>
        {monthName.map((item, ind) => (
          <ButtonView
            onPress={selectedDate(item, ind)}
            style={ind == selectMonth ? styles.selected : styles.unSelected}>
            <Text
              style={AppStyles.gbRe(
                19,
                ind == selectMonth ? Colors.txt.white : Colors.txt.lGrey,
              )}>
              {item.half}
            </Text>
          </ButtonView>
        ))}
      </View>

      <View style={styles.btnContent}>
        <AppButton
          title="CANCEL"
          onPress={toggleMonthlyModal}
          style={styles.btn}
          textStyle={{ flex: 0 }}
        />
        <AppButton
          backgroundColor={Colors.primary.violet}
          title="VIEW ORDER"
          onPress={myEarning}
          style={styles.btn}
          textStyle={{ flex: 0 }}
        />
      </View>
    </>
  );

  const ModalCashOut = () =>
    isCashOutSubmit == true ? (
      <>
        <View style={styles.submitedMsg}>
          <Text style={styles.submitedMsgTxt}>Thank You!</Text>
          <Text style={styles.cashoutTitle}>
            Cash out request has been sent to the moderator of the application
          </Text>
        </View>
        <View style={styles.cashOutBottom}>
          <ButtonView
            onPress={toggleCashoutModal}
            style={[styles.cashOutBtnC, { width: '100%' }]}>
            <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
              Continue
            </Text>
          </ButtonView>
        </View>
      </>
    ) : (
      <>
        <View style={styles.cashOutModalContent}>
          <Text style={styles.cashoutTitle}>
            Please enter the amount you want to cash out
          </Text>
          <View style={styles.searchSection}>
            <Form ref={ref => (formHandler = ref)}>
              {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
                const { number } = Form.INPUTS(refCollector, onSubmitEditing);
                return (
                  <>
                    <MaterialTextField
                      {...number({ identifier: "amount" })}
                      subAnimated={{ borderBottomColor: 'transparent' }}
                      type={INPUT_TYPES.NUMBER}
                      error={"Please enter amount"}
                      label="Enter Amount"
                      // activeColor="transparent"
                      // style={styles.input}
                      // label={""}
                      style={{ marginBottom: -1, flex: 1, marginLeft: Metrics.heightRatio(-10) }}
                    />
                  </>
                );
              }}
            </Form>
            <Text style={styles.dollar}>$</Text>
          </View>
          <Text style={[AppStyles.gbRe(13, Colors.txt.lGrey), { marginTop: Metrics.heightRatio(20) }]}>
            *Minimum cash out request is $2.00
          </Text>
        </View>
        <View style={styles.cashOutBottom}>
          <ButtonView
            onPress={toggleCashoutModal}
            style={styles.cashOutBtnC}>
            <Text style={AppStyles.gbRe(16, Colors.SocialButton.red)}>
              Cancel
            </Text>
          </ButtonView>
          <ButtonView
            onPress={submitData}
            style={styles.cashOutBtnC}>
            <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
              Submit
            </Text>
          </ButtonView>
        </View>
      </>
    );

  return (
    <View style={[styles.container]}>
      <LinearGradient colors={Colors.gradient.purpleGradient}>
        {/* header */}
        <View style={styles.headerContent}>
          <View style={styles.rowAlign}>
            <ImageHandlerUpdated
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4mZWAZ6H7rMwse_xz7xZCX6a4blTjTD_eSQ&usqp=CAU',
              }}
              style={styles.avater}
            />
            <View>
              <Text style={AppStyles.gbSb(16, Colors.txt.white)}>
                {business_name}
              </Text>

              {total_ratings != 0 && total_reviews != 0 ? (
                <View style={styles.rowAlign}>
                  <StarRating
                    disabled={false}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half-empty'}
                    iconSet={'FontAwesome'}
                    maxStars={5}
                    fullStarColor={'rgb(255,185,54)'}
                    rating={rating}
                    starSize={14}
                  />
                  <Text style={AppStyles.gbRe(12, Colors.txt.white)}> ({total_reviews})</Text>
                </View>) : (
                <Text style={styles.noreviewText}>No reviews</Text>
              )}
            </View>
          </View>
          <AppButton
            onPress={() => {
              setState(s => ({ ...s, isCashOutSubmit: false }));

              toggleCashoutModal();
            }}
            title={'Cash Out'}
            style={styles.cashOutBtn}
            textStyle={styles.cashOutBtnTxt}
          />
        </View>

        {/*  Total and monthly Earnings */}
        <View style={styles.counts}>
          {renderCounts(`$${total_earnings}`, 'Total Earnings')}
          {renderCounts(`$${total_remaining}`, 'Remaining Amount')}
        </View>
      </LinearGradient>

      {/* monthl Filter */}
      <View style={styles.filter}>
        <View style={styles.monthlyEarning}>
          <Text style={styles.monthEtxt}>{`Monthly Earning`}</Text>
          <Text style={AppStyles.gbSb(24)}>{`$${data?.monthly_earning == undefined ? 0 : data?.monthly_earning}`}</Text>
        </View>
        <ButtonView
          onPress={() => toggleMonthlyModal()}
          style={styles.filterMonthly}>
          <View>
            <Text style={styles.monthlyETxt}>{selectedMonthName}</Text>
            <Text style={AppStyles.gbSb(24)}>{selectedYear}</Text>
          </View>
          <Image style={styles.dropUp} source={Images.icArrowDropUp} />
        </ButtonView>
      </View>

      {/* Monthly Listing */}

      {/* <SectionList
        stickySectionHeadersEnabled={false}
        sections={dummyData}
        scrollEnabled={true}
        renderItem={_renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{"Bisma"}</Text>
        )}
      /> */}


      <FlatListHandler
        data={data?.monthly_data}
        renderItem={_renderItem}
        fetchRequest={myEarning}
        isFetching={isFetching}
        meta={meta}
      />

      {/* Month Picker Modal */}

      <Modal
        visible={isMonthlyModal}
        onTouchOutside={toggleMonthlyModal}>
        <ModalContent style={styles.modalContent}>
          <MonthPicker />
        </ModalContent>
      </Modal>

      {/* Cash Out Modal */}
      <Modal
        visible={isCashoutModal}
        onTouchOutside={toggleCashoutModal}>
        <ModalContent style={styles.modalContent}>
          <ModalCashOut />
        </ModalContent>
      </Modal>
    </View>
  );
}


export default MyEarning;

const dummyData = [
  {
    title: 'Sep27, 2020',
    data: [
      { id: 1, title: 'Classic Package', price: 50 },
      { id: 2, title: 'Cash Out', price: -50 },
      { id: 3, title: 'Cappiello Salon.', price: 50 },
    ],
  },
  {
    title: 'Sep25, 2020',
    data: [
      { id: 4, title: 'Cash Out', price: -50.0 },
      { id: 5, title: 'Sweet Pixie Salon.', price: 50 },
    ],
  },
];

const monthName = [
  { half: 'Jan', full: 'January' },
  { half: 'Feb', full: 'February' },
  { half: 'Mar', full: 'March' },
  { half: 'Apr', full: 'April' },
  { half: 'May', full: 'May' },
  { half: 'Jun', full: 'June' },
  { half: 'July', full: 'July' },
  { half: 'Aug', full: 'August' },
  { half: 'Sep', full: 'September' },
  { half: 'Oct', full: 'October' },
  { half: 'Nov', full: 'November' },
  { half: 'Dec', full: 'December' },
];
