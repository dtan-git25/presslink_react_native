import { ImageHandlerUpdated, ButtonView } from '@reuseableComponents';
import { AppStyles, Metrics, Colors, Images } from '@theme';
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import StarRating from 'react-native-star-rating';
export default params => {
  const { image_url, business_name, business_category, total_ratings, total_reviews, rating } = params.data;
  return (
    <View style={[styles.coverImage, styles.coverImageContent]}>
      <View style={styles.alignItemsCenter}>
        <ImageHandlerUpdated
          source={{
            uri: image_url,
          }}
          style={styles.avater}
        />
        <Text style={styles.profileName} numberOfLines={3}>{business_name}</Text>
        <Text style={styles.profileCategory}>{business_category}</Text>
        {total_ratings != 0 && total_reviews != 0 ? (
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
            <Text style={[AppStyles.gbRe(14, Colors.txt.white), { marginTop: 2, marginLeft: 2 }]}>({total_reviews})</Text>
          </View>) : (
          <Text style={styles.noreviewText}>No reviews</Text>
        )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  coverImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.3,
  },
  coverImageContent: {
    paddingTop: Metrics.doubleBaseMargin,
    position: 'absolute',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginRight: Metrics.smallMargin,
  },

  profileName: {
    ...AppStyles.gbSb(22, Colors.txt.white),
    marginBottom: Metrics.heightRatio(3),
    marginHorizontal: Metrics.heightRatio(30),
    textAlign: 'center'
  },
  profileCategory: {
    ...AppStyles.gbRe(15, Colors.txt.white),
    marginBottom: Metrics.heightRatio(5),
  },
  noreviewText: {
    ...AppStyles.gbRe(14, Colors.txt.white), marginTop: 2, marginLeft: 2
  },
  rowStyle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  avater: {
    ...AppStyles.roundImage(62),
    marginBottom: Metrics.heightRatio(3),
  },
});
