import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import {
  AppButton,
  FormHandlerUpdated,
  ButtonView,
  InputTextField,
  ImageHandlerUpdated,
  ImageButton,
  Form,
  FlashMessage, Screen,
} from '@reuseableComponents';
import { Page } from '@components';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import utility from '@utils';
import { pop, push } from '@nav';
import { Rating } from 'react-native-ratings';
import constant from '@constants';
import { useDispatch } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import { DUMP } from '@actionTypes';
import { REVIEW } from '@actionTypes';
let formHandler = null

const RateReview = ({ navigation, route }) => {
  let ratingNo = '1'
  const dispatch = useDispatch()
  const { business_name } = route?.params?.details?.provider_id
  const { order_id } = route?.params?.details

  const ratingCompleted = (rating) => {
    ratingNo = rating
    console.log('ratingNo', ratingNo)
  }

  const reviewApi = () => {
    const payload = formHandler.onSubmitForm();
    let formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('rating', ratingNo);
    if (payload.feedback) { formData.append('feedback', payload.feedback); }
    dispatch(
      request(
        constant.review,
        constant.serviceTypes.POST,
        formData,
        DUMP,
        true,
        false,
        cbreviewApiSuccess,
        cbreviewApiFailure,
        DUMP,
      ),
    );
  }
  function cbreviewApiSuccess(res) {
    dispatch(generalSaveAction(REVIEW.ADD, { isAddAtZero: true, ...res }));
    route?.params?.cbOnReviewAdded(res)
    FlashMessage({ message: "Your review has been submitted successfully", type: 'success' })
    pop()
  }
  function cbreviewApiFailure(error) { }






  return (
    <Screen style={styles.container}>
      <ScrollView>

        <View
          style={[
            styles.rowAlign,
            {
              backgroundColor: Colors.bg.paleGray,
              padding: Metrics.smallMargin,
              borderRadius: 6,
            },
          ]}>
          <ImageHandlerUpdated
            source={{
              uri: route?.params?.details?.provider_id?.image_url,
            }}
            style={styles.avater}
          />
          <View style={styles.flex}>
            <Text numberOfLines={3} style={AppStyles.gbRe(14, Colors.txt.dGrey)}>
              {business_name}
            </Text>
            <View style={[styles.rowAlign, { paddingTop: Metrics.heightRatio(4) }]}>
              <Text style={AppStyles.gbRe(12, Colors.txt.lGrey)}>
                Order ID : {route?.params?.details?.order_id}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            padding: Metrics.doubleBaseMargin,
          }}>
          {/* <Image
          source={Images.icFiveStar}
          style={{
            width: Metrics.widthRatio(250),
            height: Metrics.heightRatio(Platform.OS == 'android' ? 34 : 30),
          }}
        /> */}
          <Rating
            startingValue={1}
            // showRating
            onFinishRating={ratingCompleted}
            style={{ paddingVertical: 10 }}
          />
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: Colors.bg.lGrey }} />
        <Text
          style={{
            ...AppStyles.gbSb(18, Colors.txt.dGrey),
            alignSelf: 'center',
            paddingTop: Metrics.doubleBaseMargin,
          }}>
          Write a Review
        </Text>
        <Form ref={ref => (formHandler = ref)}>
          {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
            const { optional } = Form.INPUTS(refCollector, onSubmitEditing);
            return (
              <>
                <InputTextField
                  {...optional({ identifier: "feedback" })}
                  placeholder={'Please write your review...'}
                  style={[styles.inputTxt]}
                  labelStyle={[styles.inputLabel]}
                  multiline={true}
                />
              </>
            );
          }}
        </Form>
        <AppButton
          title={'Submit'}
          style={styles.btn}
          onPress={reviewApi}
        />
      </ScrollView>
    </Screen>
  );
};

export default RateReview;

const styles = StyleSheet.create({
  container: {
    padding: Metrics.baseMargin,
    backgroundColor: Colors.bg.white,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTxt: {
    textAlignVertical: 'top',
    backgroundColor: Colors.bg.paleGray,
    borderRadius: 6,
    borderBottomWidth: 0,
    padding: Metrics.smallMargin,
    height: Metrics.heightRatio(121),
  },
  flex: {
    flex: 1
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    marginTop: Metrics.baseMargin,
    minHeight: 48,
    rowAlign: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  avater: {
    ...AppStyles.roundImage(42),
    marginRight: Metrics.smallMargin,
  },
});
