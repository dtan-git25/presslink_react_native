import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { ButtonView, NavTitle } from '@reuseableComponents';

import { AppStyles, Colors, Images, Metrics } from '@theme';
import utility from '@utils';
import { navigate, push } from '@nav';
import HttpServiceManager from '../../../services/HttpServiceManager';
import { logout } from '@serviceAction';
import { store } from '../../../store/index';
import { useSelector } from 'react-redux';

export default params => {
  const user = useSelector(({ userReducer }) => userReducer.data)
  const { email } = user
  const Row = ({ title, onPress, img }) => (
    <ButtonView onPress={onPress} style={styles.containerRow}>
      <Image source={img} />
      <Text style={styles.txtRowTitle}>{title}</Text>
      <Image source={Images.icRightArrow} />
    </ButtonView>
  );

  const onLogout = () => {
    HttpServiceManager.getInstance().userToken = '';
    utility.getSetLogin()(false)
    store.dispatch(logout());
  };
  return (
    <View
      style={styles.container}>
      {/* <NavTitle title="Settings" /> */}
      <View style={styles.containerWhite}>
        <Row
          title="Change Password"
          img={Images.icLock}
          onPress={() => navigate('ChangePassword')}
        />
        <Row
          title="Payment Method"
          img={Images.icPayment}
          onPress={() => {
            navigate('PaymentMethod');
          }}
        />
        <Row
          title="FAQs"
          img={Images.icFaqs}
          onPress={() => {
            navigate('ContentPage', {
              link: 'https://press-link-web-api.dev.retrocubedev.com/content/faqs',
              title: 'FAQs',
            });
          }}
        />
        <Row
          title="Terms of Use"
          img={Images.icTerms}
          onPress={() => {
            navigate('ContentPage', {
              link: 'https://press-link-web-api.dev.retrocubedev.com/content/terms-condition',
              title: 'Terms of Use',
            });
          }}

        />
        <Row
          title="Privacy Policy"
          img={Images.icPrivacy}
          onPress={() => {
            navigate('ContentPage', {
              link: 'https://press-link-web-api.dev.retrocubedev.com/content/privacy-policy',
              title: 'Privacy Policy',
            });
          }}
        />

        <View style={styles.containerSeparator}>
          <View style={styles.separator} />
        </View>
        <ButtonView style={styles.conatainerLogout} onPress={onLogout}>
          <Text style={styles.txtLogout}>Logout</Text>
          <Text style={styles.txtEmail}>{email}</Text>
        </ButtonView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.bg },
  containerRow: {
    flexDirection: 'row',
    padding: Metrics.baseMargin,
    justifyContent: 'center',
  },
  txtRowTitle: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin,
    ...AppStyles.gbRe(13, Colors.txt.vdGrey),
  },
  containerWhite: {
    backgroundColor: Colors.bg.white,
    margin: Metrics.baseMargin,
  },
  containerSeparator: {
    backgroundColor: Colors.bg.white,
    height: 1,
    width: '100%',
    marginVertical: Metrics.doubleBaseMargin,
    justifyContent: 'center',
  },
  separator: {
    flex: 1,
    backgroundColor: Colors.bg.bg,
    marginHorizontal: Metrics.baseMargin,
  },
  conatainerLogout: { padding: Metrics.baseMargin, paddingTop: 0 },
  txtLogout: AppStyles.gbRe(14, Colors.txt.vdGrey),
  txtEmail: {
    ...AppStyles.gbRe(13, Colors.txt.lGrey),
    marginTop: Metrics.smallMargin,
  },
});
