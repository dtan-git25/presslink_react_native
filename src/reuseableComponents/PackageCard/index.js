import React, { useCallback } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { AppStyles, Colors, Metrics, Images } from '@theme';
import { BlurHashPlaceholderImage, ButtonView } from '@reuseableComponents';
import { useSelector } from 'react-redux';
import { push } from '@nav';

const PackageCard = ({ data, deleted = false, onDelete }) => {
  const serviceDetails =
    typeof data === 'object' ? data :
      useSelector(
        ({ generalServices }) => generalServices.data[data],
      );

  // const { price, image_url_blur } = serviceDetails;
  const onPress = () => {
    push('MenuDetail', { serviceDetails })
  };
  return (
    <ButtonView style={styles.container} onPress={onPress}>
      <BlurHashPlaceholderImage
        uri={serviceDetails?.image?.image_src}
        height={Metrics.widthRatio(91)}
        width={Metrics.widthRatio(91)}
        blurhash={serviceDetails?.image?.image_info?.blur_hash}
      />
      <View
        style={[
          styles.containerRow,
          {
            width:
              Metrics.screenWidth - Metrics.widthRatio(deleted ? 160 : 120),
          },
        ]}>
        <Text style={styles.txtTitle}>{serviceDetails?.title}</Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.txtDesc}>
          {serviceDetails?.description}
        </Text>
        <Text style={styles.txtPrice}>${serviceDetails?.price}</Text>
      </View>
      {deleted && (
        <ButtonView onPress={() => { onDelete(serviceDetails) }}>
          <Image source={Images.icTrashCircle} style={styles.mtSmall} />
        </ButtonView>
      )}
    </ButtonView>
  );
};

export default PackageCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.white,
    padding: Metrics.baseMargin,
    width: Metrics.screenWidth,
  },
  img: {
    width: Metrics.widthRatio(91),
    height: Metrics.widthRatio(91),
    borderRadius: Metrics.smallMargin,
  },
  containerRow: {
    paddingLeft: Metrics.baseMargin,
    marginRight: Metrics.smallMargin,
    justifyContent: 'center',
  },
  txtTitle: {
    ...AppStyles.gbSb(14, Colors.txt.vdGrey),
    textTransform: 'capitalize',

  },
  txtDesc: {
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
    marginVertical: Metrics.smallMargin,
    lineHeight: 17,
  },
  mtSmall: {
    marginTop: Metrics.smallMargin,
  },
  txtPrice: AppStyles.gbRe(12, Colors.primary.violet),
});
