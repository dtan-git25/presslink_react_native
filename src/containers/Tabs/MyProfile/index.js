import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import {
  NavTitle,
  ImageHandlerUpdated,
  MaterialTextField,
  ButtonView,
} from '@reuseableComponents';

import { AppStyles, Colors, Images, Metrics } from '@theme';
import { push } from '@nav';
import { useSelector } from 'react-redux';
import { Page } from '@components';

export default params => {
  const user = useSelector(({ userReducer }) => userReducer.data)
  const { name, mobile_no, email, address, image_url } = user
  const pushTo = (screenName) => () => { push(screenName) }

  params.navigation.setOptions({
    headerRight: () => (
      <ButtonView style={styles.rightBtn} onPress={pushTo('EditProfile')}>
        <Image source={Images.edit} />
      </ButtonView>
    ),
    headerTitleAlign: 'center',
  });

  const Profile = () => {

    return (
      <View style={styles.container}>
        <ImageHandlerUpdated
          source={{ uri: image_url }}
          style={styles.profileImg}
        />
        <Text style={styles.profileTxt}>
          {name}
        </Text>
      </View>
    );
  };

  const Input = ({ img, label, placeholder, val }) => (
    <View style={styles.input}>
      <Image source={img} style={styles.iconStyle} />
      <View style={styles.flex}  >
        <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>{label}</Text>
        <Text style={styles.inputTxt}>
          {val}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Page bounces={false} style={styles.page}>
        <Profile />
        <View
          style={styles.mainView}>
          <Input
            img={Images.phone}
            label="Phone Number"
            placeholder="Enter your phone number"
            val={mobile_no}
          />
          <Input
            img={Images.email}
            label="Email Address"
            placeholder="Enter your email address"
            val={email}
          />
          <Input
            img={Images.location}
            label="My Address"
            placeholder="Enter your address"
            val={address}
            selectionColor="green"
          />
          <View style={styles.mapView}>
            <Image
              source={Images.icMap}
              style={styles.mapImg}
            />
          </View>
        </View>
      </Page>
    </View>
  );
};
const styles = StyleSheet.create({
  rightBtn: {
    paddingRight: Metrics.baseMargin,
  },
  flex: {
    flex: 1,
  },
  page: { flex: 1, backgroundColor: Colors.bg.bg, padding: 0 },
  inputTxt: {
    ...AppStyles.gbRe(16, Colors.txt.mGrey),
    marginTop: Metrics.smallMargin,
  },
  container: { backgroundColor: Colors.bg.bg, ...AppStyles.centerAligned },
  profileImg: {
    ...AppStyles.roundImage(130),
    marginVertical: Metrics.doubleBaseMargin,
    borderWidth: Metrics.widthRatio(2),
    borderColor: Colors.bg.white,
  },
  iconStyle: { marginRight: Metrics.baseMargin },
  profileTxt: {
    ...AppStyles.gbSb(24, Colors.txt.mGrey),
    marginBottom: Metrics.doubleBaseMargin,
  },
  input: {
    flexDirection: 'row',
    marginHorizontal: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
  },
  mainView: {
    backgroundColor: Colors.bg.white,
    paddingBottom: Metrics.doubleBaseMargin,
    paddingTop: Metrics.baseMargin,
  },
  mapImg: {
    marginLeft: Metrics.heightRatio(30),
    marginTop: Metrics.heightRatio(5),
    width: Metrics.screenWidth - 60,
    resizeMode: 'contain'
  },
  mapView: { width: '100%', alignItems: 'center', },

});
