import { ImageHandlerUpdated } from '@reuseableComponents';
import { Metrics, AppStyles, Colors, Images } from '@theme';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
const Review = ({ reviewData, bgColor = Colors.bg.white }) => {
  return (
    < View style={{
      backgroundColor: bgColor,
    }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: Metrics.baseMargin,
        }}>
        <ImageHandlerUpdated
          source={{
            uri: reviewData?.user?.image_url,
          }}
          style={AppStyles.roundImage(36)}
        />
        <View style={{ marginLeft: Metrics.smallMargin }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={AppStyles.gbSb(14, Colors.txt.mGrey)}>{reviewData?.user?.name}</Text>
            <Image
              source={Images.icStar}
              style={{ marginHorizontal: Metrics.widthRatio(4) }}
            />
            <Text style={AppStyles.gbRe(14, Colors.txt.mGrey)}>
              {/* {rating} */}
              {reviewData?.rating}
            </Text>
          </View>
          <Text style={AppStyles.gbRe(11, Colors.txt.lGrey)}>
            {moment(reviewData?.created_at).format('LL')}

          </Text>
        </View>
      </View>
      <Text
        style={{
          ...AppStyles.gbRe(12, Colors.txt.lGrey),
          marginHorizontal: Metrics.baseMargin,
          marginBottom: Metrics.baseMargin,
        }}>
        {reviewData?.feedback}
      </Text>
    </View >
  )
};

export default Review;
