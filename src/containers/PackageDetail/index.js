import {
  AppButton,
  ButtonView,
  ImageHandlerUpdated,
  Review,
  Schedule,
  ServiceSubHeader,
} from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Text, Animated, View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStyles, Images } from '@theme';
import { pop, push } from '@nav';
import moment from 'moment';
import { REVIEW } from '@actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import constant from '@constants';
import { COMPLETED_ORDERS } from '@actionTypes';
import _ from 'lodash';


const Header = ({ animHandle, data }) => {
  const scale = animHandle.interpolate({
    inputRange: [-Metrics.screenWidth / 1.3 + Metrics.widthRatio(60), 0],
    outputRange: [5 * 0.5, 1],

    extrapolate: 'clamp',
  });
  animationStyle = {
    transform: [{ scale }],
  };
  return (
    <Animated.View style={animationStyle}>
      <ImageHandlerUpdated
        style={styles.coverImage}
        source={{
          uri: data?.order_items?.service?.image?.image_src,
        }}
      />
      <ServiceSubHeader data={data?.order_items?.provider_id} />
    </Animated.View>
  );
};


const Separator = () => (
  <View
    style={styles.separatorStyle}
  />
);
const PackageDetail = ({ navigation, route }) => {
  const dispatch = useDispatch()

  const { key, submited } = route?.params;
  const packageDetails = route?.params?.orderDetails?.order_items?.service
  const details = route?.params?.orderDetails
  const providerDetails = route?.params?.orderDetails?.order_items?.provider_id
  const [reviewData, reviewUpdate] = useState(details?.review)
  const scaleAnimtedValue = useRef(new Animated.Value(1.3)).current;
  const verticalScrollviewAnimatedValue = useRef(new Animated.Value(0)).current;

  const cbOnReviewAdded = (data) => {
    dispatch(generalSaveAction(COMPLETED_ORDERS.UPDATE, { ...route?.params?.orderDetails, review: data }))
    reviewUpdate(data)
  }

  const getReviews = (isConcat = false, page = 1) => {
    let params = { page, limit: 10 }
    dispatch(
      request(
        constant.review + `?user_id=${providerDetails.id}`,
        constant.serviceTypes.GET,
        params,
        REVIEW,
        false,
        isConcat,
        cbReviewSuccess,
        cbReviewFailure,
        REVIEW
      )
    )
  }

  function cbReviewSuccess(res) {

  }

  function cbReviewFailure() {

  }

  useEffect(() => {
    getReviews()
  }, [])

  useEffect(() => {
    Animated.timing(scaleAnimtedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


  navigation.setOptions({
    headerRight: () => (
      key == 1 &&
      < ButtonView style={styles.containerBack}
        onPress={() => push('Chat', { otherUser: { ...providerDetails, id: providerDetails.id } })}
      >
        <Image source={Images.icChatViolet} />
      </ButtonView >
    ),
    headerLeft: () => (
      <ButtonView style={styles.containerBack} onPress={() => pop()}>
        <Image source={Images.icLeftArrow} />
      </ButtonView>
    ),
    title: details?.order_items?.provider_id?.business_name,
    headerTitleStyle: styles.titleStyle,
    headerTitleAlign: 'center',
    headerTransparent: false
  });


  const reviews = useSelector(({ reviewReducer }) => reviewReducer.data)

  const RenderSchedule = submited => {

    const mDate = moment(`${details.date_time}`.split(" ")[0],)

    return (
      <View>
        <Schedule
          edit={false}
          selectedDay={mDate.format("DD")}
          weekday={mDate.format("dddd")}
          selectedMonth={mDate.format("MMM")}
          startTime={moment.utc(details.date_time).format('LT')}
        />
        <View
          style={[
            styles.containerStatus,
            { backgroundColor: key == '0' ? Colors.SocialButton.gray : key == '1' ? Colors.SocialButton.blue : key == '2' ? Colors.SocialButton.red : Colors.SocialButton.green },
          ]}>
          <Text style={AppStyles.gbRe(12, Colors.txt.white)}>
            {key == '0' ? 'Pending' : key == '1' ? 'Accepted' : key == '2' ? 'Rejected' : 'Completed'}
          </Text>
        </View>
      </View>
    );
  };

  const eventVerticalScrollView = useCallback(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: verticalScrollviewAnimatedValue,
              },
            },
          },
        ],
        { useNativeDriver: true },
      ),
    [],
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Animated.ScrollView
        onScroll={eventVerticalScrollView()}
        style={{ transform: [{ scale: scaleAnimtedValue }] }}>
        <Header data={details} animHandle={verticalScrollviewAnimatedValue} />
        {RenderSchedule(submited)}

        <View style={styles.detailsView}>
          <View style={styles.topbar}>
            <Text style={AppStyles.gbSb(15, Colors.txt.slate)}>
              {packageDetails.title}
            </Text>
            <Text style={AppStyles.gbSb(15, Colors.primary.violet)}>
              ${packageDetails.price}
            </Text>
          </View>
          <Text style={styles.pragraph}>
            {packageDetails.description}
          </Text>
          <Text style={styles.tags}>
            {packageDetails.keywords?.length > 0 &&
              `#${packageDetails.keywords.toString().replace(/,/g, ' #')}`
            }
          </Text>
          {details?.review &&
            <>
              <Separator />
              <Review bgColor="transparent" reviewData={reviewData} />
              <Separator />
            </>
          }

          <View style={styles.btnContent}>
            {key == '3' && (
              <AppButton
                backgroundColor={Colors.SocialButton.purple}
                title="Rate & Review"
                onPress={() => push('RateReview', { details: details.order_items, cbOnReviewAdded })}
              />
            )}
          </View>
        </View>
        <View style={styles.btnContent}>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default PackageDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row' },
  paddingR: { paddingRight: Metrics.baseMargin },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
  },
  detailsView: {
    backgroundColor: Colors.bg.bg, height: '100%'
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Metrics.baseMargin,
    backgroundColor: Colors.txt.white,
  },
  pragraph: {
    lineHeight: 17,
    paddingTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
  },
  mark: {
    ...AppStyles.gbSb(15, Colors.txt.slate),
    marginBottom: Metrics.smallMargin,
  },
  coverImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.3,
  },
  tags: {
    ...AppStyles.gbRe(12, Colors.primary.violet),
    margin: Metrics.baseMargin,
  },
  icBackImg: {
    marginLeft: Metrics.baseMargin,
    backgroundColor: 'white',
    ...AppStyles.roundImage(36),
    ...AppStyles.centerAligned,
  },
  icChat: {
    marginRight: Metrics.baseMargin,
    backgroundColor: 'white',
    ...AppStyles.roundImage(36),
    ...AppStyles.centerAligned,
  },
  safearea: {
    position: 'absolute',
    top: 0,
    width: Metrics.screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerStatus: {
    position: 'absolute',
    right: Metrics.baseMargin,
    top: Metrics.baseMargin,
    backgroundColor: Colors.SocialButton.blue,
    ...AppStyles.centerAligned,
    height: Metrics.widthRatio(20),
    paddingHorizontal: Metrics.smallMargin,
    borderRadius: Metrics.widthRatio(10),
  },
  btnContent: {
    margin: Metrics.baseMargin,
  },
  separatorStyle: {
    width: Metrics.screenWidth,
    backgroundColor: Colors.bg.paleGray,
    height: Metrics.widthRatio(1.5),
  },
  containerBack: {
    marginLeft: Metrics.heightRatio(10),
    marginRight: Metrics.heightRatio(10),
    marginBottom: Metrics.heightRatio(5),
    backgroundColor: Colors.bg.white,
    ...AppStyles.centerAligned,
    width: Metrics.widthRatio(32),
    height: Metrics.widthRatio(32),
    borderRadius: Metrics.widthRatio(16),
    ...AppStyles.lightShadow,
  },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400',
    textTransform: 'capitalize',

  },
});
