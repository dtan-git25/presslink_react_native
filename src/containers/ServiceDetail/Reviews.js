import { REVIEW } from '@actionTypes';
import constant from '@constants';
import { AppButton, FlatListHandler, Review, ReviewCount } from '@reuseableComponents';
import { push } from '@nav';
import { Colors, Metrics } from '@theme';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../actions/ServiceAction';

const Reviews = params => {
  const { id, total_reviews, rating } = params.data.providerDetails
  const dispatch = useDispatch()
  const getReviews = (isConcat = false, page = 1) => {
    let parameter = { page, limit: 10 }
    dispatch(
      request(
        constant.review + `?user_id=${id}`,
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

  function cbReviewSuccess() { }

  function cbReviewFailure() {

  }

  useEffect(() => {
    getReviews()
  }, [])

  const renderItem = ({ item, index }) => (
    index < 4 && < Review reviewData={item} />

  )


  const reviews = useSelector(({ reviewReducer }) => reviewReducer.data)
  const Separator = () => (
    <View style={styles.separatorStyle} />
  );

  const MoreViews = () => (
    <AppButton
      onPress={() => push("ProviderMoreReviews", { providerId: id })}
      title="More reviews"
      style={styles.bgwhite}
      textStyle={styles.txtStyle}
    />

  );


  return (
    <View
      style={styles.container}>

      <ReviewCount review={total_reviews} ratings={rating} />

      <FlatListHandler
        bounces={false}
        data={reviews}
        renderItem={renderItem}
        // fetchRequest={getServices}
        keyExtractor={(item, index) => index}
        style={styles.flex}
        ItemSeparatorComponent={Separator}
        // isFetching={isFetching}
        // meta={meta}
        ListFooterComponent={reviews.length > 0 && <MoreViews />}
      />

    </View>

  );
};

export default Reviews;


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  separatorStyle: {
    width: Metrics.screenWidth,
    backgroundColor: Colors.bg.bg,
    height: Metrics.widthRatio(1.5),
  },
  bgwhite: {
    backgroundColor: Colors.bg.white,
  },
  txtStyle: { color: Colors.primary.violet },
  container: {
    flex: 1,
    backgroundColor: Colors.bg.white,
    width: Metrics.screenWidth,
  }
})