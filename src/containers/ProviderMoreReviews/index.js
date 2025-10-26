import React, { useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import {
  AppButton,
  FormHandlerUpdated,
  ButtonView,
  InputTextField,
  FlatListHandler,
  Review,
} from '@reuseableComponents';
import { Page } from '@components';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import { pop } from '@nav';
import { useDispatch, useSelector } from 'react-redux';
import { REVIEW } from '@actionTypes';
import { request } from '../../actions/ServiceAction';
import constant from '@constants';

const ProviderMoreReviews = ({ route }) => {
  const dispatch = useDispatch()
  const reviews = useSelector(({ reviewReducer }) => reviewReducer)
  const user = useSelector(({ userReducer }) => userReducer.data)
  const { data, isFetching, meta } = reviews
  const getReviews = (isConcat = false, page = 1) => {
    let parameter = { page, limit: 10 }
    let userId = route?.params?.providerId ? route?.params?.providerId : user.id
    dispatch(
      request(
        constant.review + `?user_id=${userId}`,
        constant.serviceTypes.GET,
        parameter,
        REVIEW,
        false,
        isConcat,
        cbReviewSuccess,
        cbReviewFailure,
        REVIEW
      )
    )
  }

  function cbReviewSuccess(res) { }

  function cbReviewFailure() {

  }

  useEffect(() => {
    getReviews()
  }, [])

  const renderItem = ({ item }) => (
    < Review reviewData={item} />
  )

  const renderSeparator = useCallback(() => <View style={styles.hr} />, []);

  // );

  return (
    <FlatListHandler
      data={data}
      renderItem={renderItem}
      fetchRequest={getReviews}
      style={styles.flex}
      ItemSeparatorComponent={renderSeparator}
      isFetching={isFetching}
      meta={meta}
    />
  )
};

export default ProviderMoreReviews;

const styles = StyleSheet.create({
  inputTxt: {
    backgroundColor: Colors.bg.white,
    height: Metrics.heightRatio(52),
    borderBottomWidth: 0,
  },
  inputLabel: {
    backgroundColor: Colors.bg.white,
    paddingTop: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin,
    marginTop: Metrics.heightRatio(3),
  },
  flex: {
    flex: 1
  },
  imgSelector: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.widthRatio(64),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.txt.lGrey,
    justifyContent: 'center',
    alignContent: 'center',
  },
  imgPickerContainer: {
    backgroundColor: 'white',
    marginTop: Metrics.heightRatio(4),
    paddingVertical: Metrics.smallMargin,
    paddingHorizontal: Metrics.baseMargin,
  },
  hr: {
    height: Metrics.widthRatio(1),
    backgroundColor: Colors.bg.bg,
  },
  imgPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Metrics.baseMargin - 4,
  },
  imgPickerTitle: {
    ...AppStyles.gbSb(16),
    marginBottom: Metrics.heightRatio(10),
    marginTop: Metrics.heightRatio(10),
  },
  imgPickerSubTitle: {
    ...AppStyles.gbRe(15, Colors.txt.slate),
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    width: '94%',
    alignSelf: 'center',
    marginTop: Metrics.doubleBaseMargin,
    minHeight: Metrics.heightRatio(38),
  },
});
