import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { EventBusSingleton } from 'light-event-bus';

import { ImageHandlerUpdated, ButtonView, AppButton, Review } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import { ScrollView } from 'react-native-gesture-handler';
import OverView from './OverView';
import { push } from '@nav';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import constant from '@constants';
import { USER } from '@actionTypes';
import { request } from '../../../actions/ServiceAction';
import { Rating } from 'react-native-ratings';
import StarRating from 'react-native-star-rating';

export default ({ navigation }) => {
  const user = useSelector(({ userReducer }) => userReducer.data)
  const { image_url, cover_image_url, reviews, rating, slug, business_name, total_ratings, business_category, total_reviews } = user
  const dispatch = useDispatch()
  navigation.setOptions({
    headerRight: () => (
      <ButtonView
        style={styles.editBtn}
        onPress={() => push('ProviderEditProfile')}>
        {/* <Image source={Images.icEditWhiteCircle} /> */}
        <Image source={Images.edit} />
      </ButtonView>
    ),
  });
  // useEffect(() => {
  //   EventBusSingleton.subscribe("profileTabFocused", () => getUser())
  // }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUser()
    });
    return unsubscribe;
  }, [navigation]);


  const Separator = () => (
    <View
      style={styles.separatorStyles}
    />
  );

  const MoreViews = () => (
    <AppButton
      onPress={() => push("ProviderMoreReviews")}
      title="More reviews"
      style={styles.bgWhite}
      textStyle={styles.voiletTxt}
    />
  );
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

  function cbUserSuccess(res) { console.log('cbUserSuccess res', res) }

  function cbUserSuccessFailure(error) { }

  const Profile = () => {
    return (
      <View style={styles.profileContainer}>
        <ImageHandlerUpdated
          style={styles.coverImage}
          source={{
            uri: cover_image_url,
          }}
        />
        <View style={[styles.coverImage, styles.coverImageContent]}>
          {/* <ButtonView
            style={styles.editBtn}
            onPress={() => push('ProviderEditProfile')}>
            <Image source={Images.icEditWhiteCircle} />
          </ButtonView> */}
          <View style={styles.alignItemsCenter}>
            <ImageHandlerUpdated
              source={{
                uri: image_url,
              }}
              style={styles.avater}
            />
            <Text style={styles.profileName} numberOfLines={3}>{business_name}</Text>
            <Text style={styles.profileCategory}>{business_category}</Text>
            {total_reviews != 0 && total_ratings != 0 ? (
              <View style={styles.rowStyle}>
                <View>
                  <StarRating
                    disabled={false}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half-empty'}
                    iconSet={'FontAwesome'}
                    maxStars={5}
                    fullStarColor={'rgb(255,185,54)'}
                    rating={rating}
                    starSize={17}
                  />
                </View>
                <Text style={styles.reviewText}>({total_reviews})</Text>
              </View>
            )
              : (
                <Text style={styles.noreviewText}>No reviews</Text>
              )
            }


          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
      >
        <Profile />
        <OverView showReviews={false} />
        {reviews?.length > 0 &&
          <View>
            <Review reviewData={reviews[0]} />
            <Separator />
            <MoreViews />
          </View>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  voiletTxt: { color: Colors.primary.violet },
  bgWhite: { backgroundColor: 'white' },
  separatorStyles: {
    width: Metrics.screenWidth,
    backgroundColor: Colors.bg.bg,
    height: Metrics.widthRatio(1.5),
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg.white,
  },
  row: {
    flexDirection: 'row',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  reviewText: {
    ...AppStyles.gbRe(14, Colors.txt.white), marginTop: 2, marginLeft: 2
  },
  noreviewText: {
    ...AppStyles.gbRe(14, Colors.txt.white), marginTop: 2, marginLeft: 2
  },
  rowStyle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  coverImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.6,
    paddingBottom: Metrics.heightRatio(10),
    paddingTop: Metrics.heightRatio(5)
  },
  coverImageContent: {
    position: 'absolute',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginRight: Metrics.smallMargin,
  },
  profileContainer: {
    backgroundColor: Colors.bg.bg,
    ...AppStyles.centerAligned,
  },
  profileName: {
    ...AppStyles.gbSb(20, Colors.txt.white),
    marginBottom: Metrics.heightRatio(3),
    textAlign: 'center',
    marginHorizontal: 30
  },
  profileCategory: {
    ...AppStyles.gbRe(15, Colors.txt.white),
    marginBottom: Metrics.heightRatio(5),
  },
  avater: {
    ...AppStyles.roundImage(62),
    marginBottom: Metrics.heightRatio(3),
  },
});
