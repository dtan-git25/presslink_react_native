import { AppStyles, Colors, Images, Metrics } from '@theme';
import React from 'react';
import { View, Text, Image } from 'react-native';

const ReviewCount = ({ review, ratings }) => (
  console.log('review, ratings', review, ratings),
  <View style={{ margin: Metrics.baseMargin }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={Images.icStar}
        style={{ marginRight: Metrics.widthRatio(4) }}
      />
      <Text style={AppStyles.gbRe(14, Colors.txt.mGrey)}>{ratings}</Text>
      <View
        style={{
          height: Metrics.widthRatio(18),
          width: Metrics.widthRatio(1.5),
          backgroundColor: Colors.bg.bg,
          marginHorizontal: Metrics.baseMargin,
        }}
      />
      <Image
        source={Images.icChat}
        style={{ marginRight: Metrics.widthRatio(4) }}
      />
      <Text style={AppStyles.gbRe(14, Colors.txt.mGrey)}>{review}</Text>
      <Text
        style={{
          ...AppStyles.gbRe(11, Colors.txt.lGrey),
          marginLeft: Metrics.widthRatio(4),
        }}>
        {review > 1 ? 'Reviews' : 'Review'}
      </Text>
    </View>
  </View>
);
export default ReviewCount;
