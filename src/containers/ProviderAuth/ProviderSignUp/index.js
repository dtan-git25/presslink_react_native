import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View, ScrollView, Keyboard } from 'react-native';
import { AppButton, MaterialTextField, Form, FlashMessage, Screen } from '@reuseableComponents';
import { AuthHeader, Page, Checkbox } from '@components';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import { push, pop } from '@nav';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { request } from '../../../actions/ServiceAction';
import constant from '@constants';
import { DUMP } from '@actionTypes';
import { INPUT_TYPES } from '../../../reuseableComponents/FormHandlerUpdated/Constants';

let formHandler = null

export default function ProviderSignUp() {
  const dispatch = useDispatch()
  const [state, setState] = React.useState({
    isCheckbox: false,
    isPassword: true,
    isConfirmPassword: true,
    isEmailExist: false,
    isPhoneNoExist: false,
    showTermAndCondtionValid: false
  });

  const isEmailValid = useRef({ isValid: false });
  const isPhoneNoValid = useRef({ isValid: false });
  const isPassValid = useRef({ isValid: false });

  // const checkValidation = () => {
  //   var passValidate = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  //   const payload = formHandler.onSubmitForm();
  //   if (passValidate.test(payload?.password) === true) {
  //     formHandler.getRefByIdentifier("password").setError(true, "Password length must be atleast 8 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
  //     isPassValid.current = { isValid: false };
  //   }
  //   else {
  //     isPassValid.current = { isValid: true };
  //     // return
  //   }
  // }

  const onSignUpApiRequest = () => {
    // checkValidation()

    const payload = formHandler.onSubmitForm();
    console.log('payload', payload)
    // if (payload?.mobile_no.length < 3) {
    //   isPhoneNoValid.current = { isValid: false };
    //   formHandler.getRefByIdentifier("mobile_no").setError(true, "Phone no is required");
    //   return
    // }
    if (!state.isCheckbox) {
      setState(s => ({ ...s, showTermAndCondtionValid: true }))
    }
    else {
      if (payload && !isEmailValid.current.isValid && !isPhoneNoValid.current.isValid) {
        console.log("payload >>>>>>", payload)
        push("ProviderDetailedSignUp", { initialData: payload })
      }
      else {
        console.log("else", payload, isEmailValid.current.isValid, isPhoneNoValid.current.isValid)

      }
    }
  }

  const cbOnEmailEnter = (key, txt) => {
    let formData = new FormData();
    if (txt == '') return
    if (key == "isEmail") { formData.append('email', txt); }
    if (key == "isNumber") { formData.append('mobile_no', txt); }
    dispatch(
      request(
        constant.existingUser,
        constant.serviceTypes.POST,
        formData,
        DUMP,
        false,
        false,
        cbSuccessOnEmailEnter,
        cbFailureOnEmailEnter,
        DUMP,
      ),
    );
  }
  function cbSuccessOnEmailEnter(res) {
    if (res.isEmailExist == false)
      isEmailValid.current = { isValid: false };

    if (res.isPhoneNoExist == false)
      isPhoneNoValid.current = { isValid: false };
    if (res.isEmailExist == true) {
      formHandler.getRefByIdentifier("email").setError(true, "Email already exist");
      isEmailValid.current = { isValid: true };
      return
    }
    if (res.isPhoneNoExist == true) {
      formHandler.getRefByIdentifier("mobile_no").setError(true, "Phone no already exist");
      isPhoneNoValid.current = { isValid: true };
      return
    }

  }

  function cbFailureOnEmailEnter(err) { }


  const onTerms = useCallback(() => setState(s => ({ ...s, isCheckbox: !s.isCheckbox })));
  const togglePassword = useCallback(() => setState(s => ({ ...s, isPassword: !s.isPassword })));
  const toggleConfirmPassword = useCallback(() => setState(s => ({ ...s, isConfirmPassword: !s.isConfirmPassword })));
  const pushTo = (screenName) => (ev) => { push(screenName) }
  const popScreen = useCallback(() => pop());
  const dismissKeyboard = useCallback(() => Keyboard.dismiss())

  return (
    <Screen style={styles.container}>
      <ScrollView bounces={false}>
        <AuthHeader
          title="Your first step with us"
          description={`Please register your account to start using mobile \n app`}
          style={{ description: AppStyles.gbRe(14, Colors.txt.mGrey) }}
        />

        <Form ref={ref => (formHandler = ref)}>
          {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
            const { email, text, number, password, confirmPassword } = Form.INPUTS(refCollector, onSubmitEditing, focusByRefCollectorKey);
            return (
              <>
                <MaterialTextField
                  {...text({ identifier: "name" })}
                  label="Full Name*"
                  error="Name is required"
                // value={"Jose"}
                />
                <MaterialTextField
                  {...email()}
                  label="Email Address*"
                  onChangeText={_.debounce((txt) => cbOnEmailEnter('isEmail', txt), 300)}
                  error="Invalid email format"
                  type={INPUT_TYPES.EMAIL}
                // value={"josesa@yopmail.com"}

                />
                <MaterialTextField
                  {...number({ identifier: 'mobile_no' })}
                  countryField
                  label="Phone Number*"
                  type={INPUT_TYPES.PHONE}
                  getCode={() => { }}
                  onChangePhoneNumber={_.debounce((txt) => cbOnEmailEnter('isNumber', txt), 300)}
                  error={"Valid phone number is required"}

                />

                <MaterialTextField
                  {...password({ identifier: 'password' })}
                  label="Password*"
                  secureTextEntry={state.isPassword}
                  rightIcon={state.isPassword ? Images.icCloseEye : Images.icOpenEye}
                  onRightPress={togglePassword}
                  type={INPUT_TYPES.PASSWORD}
                // validationStyle={{ fontSize: 12 }}
                // value="Abc123@@"

                />
                <MaterialTextField
                  {...confirmPassword({ identifier: 'confirm_password' })}
                  label="Confirm Password*"
                  secureTextEntry={state.isConfirmPassword}
                  rightIcon={state.isConfirmPassword ? Images.icCloseEye : Images.icOpenEye}
                  onRightPress={toggleConfirmPassword}
                  onSubmitEditing={dismissKeyboard}
                  subAnimated={{}}
                // value="Abc123@@"

                />
              </>
            )
          }}
        </Form>
        <View
          style={styles.row}>
          <Checkbox value={state.isCheckbox} onPress={onTerms} />
          <Text
            style={styles.aggreeTxt}>
            I’ve read and agree with the {'  '}
            <Text
              onPress={() => {
                push('ContentPage', {
                  link: 'https://press-link-web-api.dev.retrocubedev.com/content/terms-condition',
                  title: 'Terms Of Services',
                });
              }}
              style={styles.termsTxt}>
              Terms of Service
            </Text>
            {'  '}and{'\n'}
            <Text
              onPress={() => {
                push('ContentPage', {
                  link: 'https://press-link-web-api.dev.retrocubedev.com/content/privacy-policy',
                  title: 'Privacy Policy',
                });
              }}
              style={styles.privTxt}>
              Privacy Policy
            </Text>
          </Text>

        </View>
        {(state.showTermAndCondtionValid && !state.isCheckbox) &&
          <Text
            style={styles.errorStyle}>
            Please accept Terms of Service and Privacy Policy
          </Text>
        }
        <View style={{ marginBottom: Metrics.baseMargin }}>
          <AppButton
            onPress={onSignUpApiRequest}
            backgroundColor={Colors.SocialButton.purple}
            title="Next"
          />
        </View>
        <View style={styles.btmView}>
          <TouchableOpacity
            onPress={popScreen}
          >
            <Text
              style={styles.haveAndAcc}>
              Already have an account?{' '}
              <Text style={AppStyles.gbSb(12, Colors.primary.violet)}>
                Sign in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.bg.bg,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginTop: Metrics.smallMargin,
  },
  aggreeTxt: {
    flex: 1,
    marginVertical: Metrics.smallMargin - 2,
    ...AppStyles.gbRe(12, Colors.txt.black),
    lineHeight: 16,
  },
  haveAndAcc: {
    textAlign: 'center',
    ...AppStyles.gbRe(12, Colors.txt.black),
  },
  termsTxt: {
    ...AppStyles.gbSb(12, Colors.primary.violet),
    textDecorationLine: 'underline',
  },
  privTxt: {
    ...AppStyles.gbSb(12, Colors.primary.violet),
    textDecorationLine: 'underline',
  },
  errorStyle: {
    color: '#B00020',
    paddingLeft: 15,
    // marginTop: 5,
    marginBottom: 5, fontSize: 13
  },
  baseMg: { marginBottom: Metrics.baseMargin },
  btmView: { height: Metrics.screenHeight * 0.1 }
});
