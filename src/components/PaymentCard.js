import { AppButton, ButtonView, ImageHandlerUpdated } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export function PaymentCard({ data, onCardPress, onDeletePress }) {
  const { brand,  last4, status, created_at } = data;

  return (
    <ButtonView style={styles.container} onPress={onCardPress}>
      <View style={styles.subContainer}>
        <ImageHandlerUpdated
          isResizeModeContain
          style={styles.img}
          source={brand == "Visa" ? Images.Visa : Images.MasterCard}
        />
        {status == 1 ? (
          <Image style={styles.imgTick} source={Images.icTick} />
        ) : (
          <Image style={styles.imgTick} source={Images.icUnTick} />
        )}
      </View>

      <View
        style={{
          marginVertical: Metrics.smallMargin,
        }}>
        <Text style={styles.number}>{`✶✶✶✶ ✶✶✶✶ ✶✶✶✶ ${last4}`}</Text>
        <Text style={styles.AddedDate}>{`Added ${moment(created_at).format("DD-MM-YYYY")}`}</Text>
      </View>
      <AppButton
        isGradient
        style={styles.deleteText}
        title={'Delete Card'}
        onPress={onDeletePress}
      />
    </ButtonView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Metrics.doubleBaseMargin,
    backgroundColor: Colors.bg.white,
    borderRadius: Metrics.smallMargin,
    margin: Metrics.smallMargin,
  },
  img: { width: Metrics.widthRatio(72), height: Metrics.heightRatio(23) },
  number: {
    marginVertical: Metrics.smallMargin,
    fontWeight: 'normal',
    letterSpacing: 0.12,
    textAlign: 'left',
    ...AppStyles.gbRe(16, Colors.txt.slate),
  },
  AddedDate: {
    fontWeight: 'normal',
    letterSpacing: 0.16,
    textAlign: 'left',
    ...AppStyles.gbRe(12, Colors.txt.lBlue),
  },
  deleteText: {
    fontWeight: 'normal',
    letterSpacing: 0.16,
    textAlign: 'left',
    ...AppStyles.gbRe(12, Colors.SocialButton.red),
    alignSelf: 'flex-end',
    width: Metrics.heightRatio(100)
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
