import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { AppStyles, Colors, Metrics, Images } from '@theme';
import { BlurHashPlaceholderImage, ButtonView, ImageHandlerUpdated } from '@reuseableComponents';
import { push } from '@nav';

const OrdersCard = ({ data }) => {
  const { cover_image_url, business_name, about_business, business_timings, image_url_blur, total_ratings, rating, total_reviews } = data;
  const width =
    Metrics.screenWidth / 2 - (Metrics.baseMargin + Metrics.widthRatio(4));
  const height = width - Metrics.doubleBaseMargin;

  const onServiceDetail = useCallback(() => {
    push('ServiceDetail', { providerDetails: data });
  });

  return (
    <ButtonView style={{ ...styles.container, width }} onPress={onServiceDetail}>
      <BlurHashPlaceholderImage
        uri={cover_image_url}
        height={height}
        width={width - Metrics.smallMargin}
        blurhash={image_url_blur}
      />
      <View style={styles.txtTitleCon}>
        <View style={styles.flex}>
          <Text style={styles.txtTitle} numberOfLines={2}>{business_name}</Text>
        </View>
        {total_ratings != 0 && total_reviews != 0 &&
          (
            <>
              <Image source={Images.icStar} style={styles.imgStar} />
              <Text style={styles.mb2}>{rating}</Text>
            </>
          )
        }

      </View>
      <Text style={styles.txtDesc} numberOfLines={2} ellipsizeMode="tail">
        {about_business}
      </Text>

      <View style={styles.containerTimings}>
        <Image source={Images.clock} />
        <Text style={styles.txtTimings}>{business_timings}</Text>
      </View>
    </ButtonView>
  );
};

export default OrdersCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.white,
    borderRadius: Metrics.smallMargin,
    marginRight: Metrics.smallMargin,
    marginBottom: Metrics.smallMargin,
    alignItems: 'center',
  },
  mb2: {
    marginTop: Metrics.heightRatio(-2)
  },
  img: {
    margin: Metrics.widthRatio(4),
    borderRadius: Metrics.widthRatio(4),
  },
  txtTitle: {
    ...AppStyles.gbSb(13, Colors.txt.vdGrey),
    textTransform: 'capitalize',

  },
  txtDesc: {
    ...AppStyles.gbRe(11, Colors.txt.lGrey),
    paddingHorizontal: Metrics.smallMargin,
    width: '100%',
    marginVertical: Metrics.smallMargin,
  },
  containerTimings: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Metrics.smallMargin,
    alignSelf: 'flex-end',
    width: '100%',
    paddingHorizontal: Metrics.smallMargin,
  },
  flex: { flex: 1 },
  txtTimings: {
    ...AppStyles.gbRe(11, Colors.primary.violet),
    paddingHorizontal: Metrics.smallMargin,
  },
  txtTitleCon: {
    flexDirection: 'row',
    // alignItems: 'flex-start',
    paddingHorizontal: Metrics.smallMargin,
    width: '100%',
    marginTop: Metrics.smallMargin,
  },
  imgStar: { marginHorizontal: Metrics.heightRatio(4) },
});
