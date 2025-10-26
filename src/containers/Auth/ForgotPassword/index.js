import { DUMP } from '@actionTypes';
import { AuthHeader, Page } from '@components';
import constant from '@constants';
import { pop } from '@nav';
import { AppButton, FlashMessage, Form, MaterialTextField } from '@reuseableComponents';
import { AppStyles, Colors, Metrics } from '@theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { request } from '../../../actions/ServiceAction';

let formHandler = null
export function ForgotPassword() {
  const dispatch = useDispatch()

  const onForgotPasswordRequest = () => {
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();

    if (isValid) {
      let formData = new FormData()
      formData.append('email', payload.email)

      dispatch(
        request(
          constant.forgotPassword,
          constant.serviceTypes.POST,
          formData,
          DUMP,
          true,
          false,
          cbSuccess,
          cbFailure,
          DUMP
        )
      )
    }
  }

  function cbSuccess() {
    FlashMessage({
      message: 'Verification Link has been sent to your email address',
      type: 'success',
    })
    pop()
  }

  function cbFailure(err) {
    console.log('err', err)
  }

  return (
    <Page>
      <AuthHeader
        title="Forgot Password?"
        description={`Enter the email address associated with your \n account.`}
        style={{ description: AppStyles.gbRe(14, Colors.txt.mGrey) }}
      />
      <Form ref={ref => (formHandler = ref)}>
        {(refCollector, onSubmitEditing) => {
          const { email } = Form.INPUTS(refCollector, onSubmitEditing);
          return (
            <>
              <MaterialTextField
                {...email()}
                label="Email"
              />
            </>
          )
        }}
      </Form>
      <View style={styles.mt}>
        <AppButton
          onPress={onForgotPasswordRequest}
          backgroundColor={Colors.SocialButton.purple}
          title="Submit"
        />
      </View>
    </Page >
  );
}

const styles = StyleSheet.create({
  mt: { marginTop: Metrics.baseMargin * 2 }
});
