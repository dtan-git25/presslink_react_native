import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { AppStyles, Colors, Metrics, Images } from '@theme';
import { BlurHashPlaceholderImage, ButtonView, ImageHandlerUpdated } from '@reuseableComponents';
import { push } from '@nav';

const OrderPackageCard = ({ showOrderId = true, data, orderItemCompleteDetails = {}, orderPrice, orderId, onPress, deleted = false, onDelete, isSeeker = false }) => {

  const { title, description, slug, price } = data;
  return (
    <ButtonView onPress={onPress}>
      <View style={styles.mainCont}>
        {isSeeker &&
          <View style={styles.row}>
            <ImageHandlerUpdated
              source={{
                uri: orderItemCompleteDetails?.provider_id?.image_url,
              }}
              style={{
                ...AppStyles.roundImage(40),
              }}
            />
            <View
              style={[
                styles.containerRow,
                {
                  width:
                    Metrics.screenWidth - Metrics.widthRatio(deleted ? 160 : 120),
                },
              ]}>
              <Text numberOfLines={2} style={styles.txtTitle}>{orderItemCompleteDetails?.provider_id?.business_name}</Text>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.txtDesc}>
                Order ID: {orderItemCompleteDetails?.order_id}
              </Text>
            </View>
          </View>
        }


        <View style={styles.container}>
          <BlurHashPlaceholderImage
            uri={data.image.image_src}
            height={Metrics.widthRatio(91)}
            width={Metrics.widthRatio(91)}
            blurhash={data.image.image_info.blur_hash}
          />


          <View
            style={[
              styles.containerRow,
              {
                width:
                  Metrics.screenWidth - Metrics.widthRatio(deleted ? 160 : 120),
              },
            ]}>
            <Text style={styles.txtTitle}>{title}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.txtDesc}>
              {description}
            </Text>
            <Text style={styles.txtPrice}>${orderPrice ? orderPrice : price}</Text>
            {(!isSeeker && showOrderId) &&
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.txtDesc}>
                Order ID: {orderId}
              </Text>
            }
          </View>
          {deleted && (
            <ButtonView onPress={onDelete}>
              <Image
                source={Images.icTrashCircle}
                style={styles.mtSmall}
              />
            </ButtonView>

          )}
        </View>
      </View>

    </ButtonView>

  );
};

export default OrderPackageCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.white,
    // paddingHorizontal: Metrics.baseMargin,
    // paddingHorizontal: Metrics.baseMargin,
    width: Metrics.screenWidth,
    // paddingVertical: Metrics.baseMargin

  },
  row: {
    flexDirection: 'row',
    marginBottom: Metrics.heightRatio(10)
  },
  mainCont: {
    backgroundColor: Colors.bg.white,
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin
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
  txtTitle: AppStyles.gbSb(14, Colors.txt.vdGrey),
  txtDesc: {
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
    marginVertical: Metrics.smallMargin,
    lineHeight: 17,
  },
  mtSmall: {
    marginTop: Metrics.smallMargin
  },
  txtPrice: AppStyles.gbRe(12, Colors.primary.violet),
});