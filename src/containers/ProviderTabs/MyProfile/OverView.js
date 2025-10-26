import { REVIEW } from '@actionTypes';
import constant from '@constants';
import { AppButton, Review, ReviewCount } from '@reuseableComponents';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../../actions/ServiceAction';
import { push } from '@nav';
const OverView = params => {
  const user = useSelector(({ userReducer }) => userReducer.data)
  const { email, image_url, cover_image_url, business_timings, mobile_no, about_business, business_name, rating, keywords, total_ratings, total_reviews, id } = user
  const dispatch = useDispatch()

  const getReviews = (isConcat = false, page = 1) => {
    let params = { page, limit: 10 }
    dispatch(
      request(
        constant.review + `?user_id=${id}`,
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

  function cbReviewSuccess(res) { }

  function cbReviewFailure() {

  }

  useEffect(() => {
    getReviews()
  }, [])
  const reviews = useSelector(({ reviewReducer }) => reviewReducer.data)


  const Separator = () => (
    <View
      style={{
        width: Metrics.screenWidth,
        backgroundColor: Colors.bg.bg,
        height: Metrics.widthRatio(1.5),
      }}
    />
  );

  const Row = ({ img, title }) => (
    <View style={{ flexDirection: 'row', padding: Metrics.baseMargin }}>
      <Image source={img} style={{ marginRight: Metrics.baseMargin }} />
      <Text style={{ ...AppStyles.gbRe(13, Colors.txt.vdGrey) }}>{title}</Text>
    </View>
  );

  const ReviewSummary = () => (
    <View style={{ margin: Metrics.baseMargin, marginBottom: 0 }}>
      <Text style={{ ...AppStyles.gbRe(14, Colors.txt.mGrey) }}>
        Review summary
      </Text>
      <ReviewCount review={total_reviews} ratings={rating} />
    </View>
  );

  const MoreViews = () => (
    <AppButton
      onPress={() => push("ProviderMoreReviews")}
      title="More reviews"
      style={{ backgroundColor: 'white' }}
      textStyle={{ color: Colors.primary.violet }}
    />
  );

  return (
    <View style={{ width: Metrics.screenWidth }}>
      <Text
        style={{
          paddingTop: Metrics.baseMargin,
          marginHorizontal: Metrics.baseMargin,
          ...AppStyles.gbRe(12, Colors.txt.lGrey),
        }}>
        {about_business}
      </Text>
      <Text
        style={{
          ...AppStyles.gbRe(12, Colors.primary.violet),
          margin: Metrics.baseMargin,
        }}>
        {keywords?.length > 0 &&
          `#${keywords.toString().replace(/,/g, ' #')}`
        }
      </Text>
      <Separator />

      <Row img={Images.icPhoneViolet} title={mobile_no} />
      <Separator />
      <Row img={Images.icEmailViolet} title={email} />
      <Separator />
      <Row img={Images.clock} title={`${business_timings} (availability)`} />
      <Separator />
      <ReviewSummary />
      <Separator />
      {(reviews.length > 0 && params?.showReviews != false) &&
        < View >
          <Review reviewData={reviews[0]} />
          <Separator />
          <MoreViews />
        </View>
      }

    </View >
  );
};

export default OverView;
