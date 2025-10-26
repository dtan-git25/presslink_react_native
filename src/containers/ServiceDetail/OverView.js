import { DUMP, SERVICE } from '@actionTypes';
import constant from '@constants';
import { AppButton, Review, ReviewCount } from '@reuseableComponents';
import { push } from '@nav';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../actions/ServiceAction';

const OverView = params => {
  const { about_business, business_timings, email, keywords, mobile_no, total_reviews, rating } = params.data.providerDetails;
  const reviews = useSelector(({ reviewReducer }) => reviewReducer.data)

  const Separator = () => (
    <View
      style={styles.separatorStyle}
    />
  );

  const pushTo = (screenName) => () => { push(screenName) }

  const Row = ({ img, title }) => (
    <View style={styles.rowView}>
      <Image source={img} style={styles.mRight} />
      <Text style={styles.rowTitle}>{title}</Text>
    </View>
  );

  const ReviewSummary = () => (
    <View style={styles.reviewStyle}>
      <Text style={{ ...AppStyles.gbRe(14, Colors.txt.mGrey) }}>
        Review summary
      </Text>
      <ReviewCount review={total_reviews} ratings={rating} />
    </View>
  );

  const MoreViews = () => (
    <AppButton
      onPress={pushTo("ProviderMoreReviews")}
      title="More reviews"
      style={styles.bgWhite}
      textStyle={styles.txtViolet}
    />
  );

  return (
    <View style={[styles.scrWidth]}>
      <Text
        numberOfLines={6}
        style={styles.businessTxt}>
        {about_business}
      </Text>
      <Text
        style={styles.keywordsTxt}>
        {keywords.length > 0 &&
          `#${keywords.toString().replace(/,/g, ' #')}`
        }
      </Text>
      <Separator />

      <Row img={Images.icPhoneViolet} title={mobile_no} />
      <Separator />
      <Row img={Images.icEmailViolet} title={email} />
      <Separator />
      <Row img={Images.clock} title={`${business_timings} (Availability)`} />
      <Separator />
      <ReviewSummary />
      <Separator />
      {reviews.length > 0 &&
        <>
          <Review reviewData={reviews[0]} />
          <Separator />
          {/* <MoreViews /> */}
        </>
      }
    </View>
  );
};

export default OverView;

const styles = StyleSheet.create({
  rowTitle: AppStyles.gbRe(13, Colors.txt.vdGrey),
  separatorStyle: {
    width: Metrics.screenWidth,
    backgroundColor: Colors.bg.bg,
    height: Metrics.widthRatio(1.5),
  },
  rowView: { flexDirection: 'row', padding: Metrics.baseMargin },
  mRight: { marginRight: Metrics.baseMargin },
  reviewStyle: { margin: Metrics.baseMargin, marginBottom: 0 },
  bgWhite: { backgroundColor: 'white' },
  txtViolet: { color: Colors.primary.violet },
  scrWidth: { width: Metrics.screenWidth },
  businessTxt: {
    paddingTop: Metrics.baseMargin,
    marginHorizontal: Metrics.baseMargin,
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
  },
  keywordsTxt: {
    ...AppStyles.gbRe(12, Colors.primary.violet),
    margin: Metrics.baseMargin,
  },
});
