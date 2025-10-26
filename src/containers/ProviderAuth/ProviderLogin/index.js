import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard } from 'react-native';
import {
  AppButton,
  FlashMessage,
  Form,
  MaterialTextField,
} from '@reuseableComponents';
import utility from '@utils';
import { push } from '@nav';
import constant from '@constants';
import { USER } from '@actionTypes';
import { useDispatch } from 'react-redux';
import { AuthHeader, Page } from '@components';
import { AppStyles, Metrics, Colors, Images } from '@theme';
import { request } from '../../../actions/ServiceAction';
import HttpServiceManager from '../../../services/HttpServiceManager';

let formHandler = null;

export default function ProviderLogin() {
  const [isPassword, setPassword] = useState(true);
  const dispatch = useDispatch();

  const _onLoginApiRequest = () => {
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();
    if (isValid) {
      let formData = new FormData();
      formData.append('email', payload.email);
      formData.append('password', payload.password);
      formData.append(
        'device_type',
        utility.isPlatformAndroid() ? 'android' : 'ios',
      );
      formData.append('device_token', 'asdasd');

      dispatch(
        request(
          constant.login,
          constant.serviceTypes.POST,
          formData,
          USER,
          true,
          false,
          cbSuccess,
          cbFailure,
          USER,
        ),
      );
    }
  };

  function cbSuccess(response, meta, msg) {
    HttpServiceManager.getInstance().userToken = response.api_token;
    console.log('response.api_token', response.api_token)
    if (response.user_group_id == 1) {
      utility.getSetServiceSeeker()(true)
    }
    else {
      utility.getSetServiceSeeker()(false)
    }
    utility.getSetLogin()(true)
  }
  function cbFailure(error) { }

  const pushTo = (screenName) => (ev) => { push(screenName) }
  const togglePassword = useCallback(() => setPassword(prevVal => !prevVal), [])
  const dismissKeyboard = useCallback(() => Keyboard.dismiss())

  return (
    <Page bounces={false}>
      <AuthHeader
        title="Login"
        description="Please login to your account."
      />
      <Form ref={ref => (formHandler = ref)}>
        {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
          const { email, text } = Form.INPUTS(refCollector, onSubmitEditing);
          return (
            <>
              <MaterialTextField
                label="Email"
                {...email()}
              // value="john@yopmail.com"

              />
              <MaterialTextField
                {...text()}
                label="Password"
                secureTextEntry={isPassword}
                rightIcon={isPassword ? Images.icCloseEye : Images.icOpenEye}
                onRightPress={togglePassword}
                identifier={'password'}
                error={'Password is required'}
                blurOnSubmit={true}
                // value="Abc123@@"
                onSubmitEditing={dismissKeyboard}

              />
            </>
          );
        }}
      </Form>
      <View
        style={styles.forgotPassCont}>
        <TouchableOpacity
          onPress={pushTo('ForgotPassword')}>
          <Text
            style={styles.forgotPassTxt}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btmCont}>
        <AppButton
          backgroundColor={Colors.SocialButton.purple}
          title="Login"
          onPress={_onLoginApiRequest}
        />
        <Text
          style={styles.medTxt}>
          or you can also :
        </Text>
        <AppButton
          left={<Image source={Images.SocialIcons.Facebook} />}
          backgroundColor={Colors.SocialButton.blue}
          title="Continue with Facebook"
        />
        <AppButton
          left={<Image source={Images.SocialIcons.Google} />}
          backgroundColor={Colors.SocialButton.green}
          title="Continue with Google"
        />
        <AppButton
          left={<Image source={Images.SocialIcons.Apple} />}
          backgroundColor={Colors.SocialButton.gray}
          title="Continue with Apple ID"
        />
      </View>
      <View style={styles.signUpView}>
        <TouchableOpacity
          onPress={pushTo('ProviderSignUp')}>
          <Text
            style={styles.medTxt}>
            Don’t have an account?{' '}
            <Text style={AppStyles.gbSb(12, Colors.primary.violet)}>
              Sign up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({

  forgotPassCont: {
    marginBottom: Metrics.screenHeight * 0.07,
    marginTop: Metrics.screenHeight * 0.02,
  },

  forgotPassTxt: {
    textAlign: 'right',
    ...AppStyles.gbSb(12, Colors.primary.violet),
  },
  btmCont: { height: Metrics.screenHeight * 0.38 },
  medTxt: {
    ...AppStyles.gbRe(13, Colors.txt.black),
    marginVertical: Metrics.baseMargin,
    alignSelf: 'center',
  },
  signUpView: { height: Metrics.screenHeight * 0.1 }

});

