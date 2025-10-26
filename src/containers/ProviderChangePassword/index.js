import React, { useCallback, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import {
  AppButton,
  InputTextField, Form, FlashMessage, MaterialTextField,
} from '@reuseableComponents';
import { Page } from '@components';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import { pop } from '@nav';
import { useDispatch } from 'react-redux';
import { request } from '../../actions/ServiceAction';
import constant from '@constants';
import { USER } from '@actionTypes';

let formHandler = null;
const ProviderChangePassword = ({ params }) => {
  const [state, setState] = React.useState({
    isOldPassword: true,
    isNewPassword: true,
    isConfirmPassword: true,
  });

  const dispatch = useDispatch()

  const changePasswordRequest = () => {
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();
    if (isValid) {
      let formData = new FormData();
      formData.append('current_password', payload.current_password);
      formData.append('new_password', payload.new_password);
      formData.append('confirm_password', payload.confirm_password);
      dispatch(
        request(
          constant.changePassword,
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
  }

  function cbSuccess(response, message) {
    FlashMessage({
      message: "Password has been updated successfully",
      type: 'success',
    });
    pop();
  }

  function cbFailure(error) { }

  const toggleConfirmPassword = useCallback(() => setState(s => ({ ...s, isConfirmPassword: !s.isConfirmPassword })));
  const toggleNewPassword = useCallback(() => setState(s => ({ ...s, isNewPassword: !s.isNewPassword })));
  const toggleOldPassword = useCallback(() => setState(s => ({ ...s, isOldPassword: !s.isOldPassword })));
  const dismissKeyboard = useCallback(() => Keyboard.dismiss())


  return (
    <Page
      bounces={false}
      style={styles.container}>
      <Form ref={ref => (formHandler = ref)}>
        {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
          const { password, confirmPassword, text } = Form.INPUTS(refCollector, onSubmitEditing);
          return (
            <>
              <MaterialTextField
                {...text({ identifier: 'current_password' })}
                label="Old Password"
                secureTextEntry={state.isOldPassword}
                rightIcon={state.isOldPassword ? Images.icCloseEye : Images.icOpenEye}
                onRightPress={toggleOldPassword}
                error={'Old Password is required'}
                blurOnSubmit={true}
              />


              <MaterialTextField
                {...text({ identifier: 'new_password' })}
                label="New Password"
                secureTextEntry={state.isNewPassword}
                rightIcon={state.isNewPassword ? Images.icCloseEye : Images.icOpenEye}
                onRightPress={toggleNewPassword}
                error={'New Password is required'}
                blurOnSubmit={true}
              />


              <MaterialTextField
                {...text({ identifier: 'confirm_password' })}
                label="Confirm Password"
                secureTextEntry={state.isConfirmPassword}
                rightIcon={state.isConfirmPassword ? Images.icCloseEye : Images.icOpenEye}
                onRightPress={toggleConfirmPassword}
                error={'Confirm Password is required'}
                onSubmitEditing={dismissKeyboard}
              />

            </>
          );
        }}
      </Form>
      <AppButton title={'Save'} style={styles.btn} onPress={changePasswordRequest} />
    </Page>
  );
};

export default ProviderChangePassword;

const styles = StyleSheet.create({
  inputTxt: {
    borderBottomWidth: 0,
    ...AppStyles.gbRe(15),
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.txt.lBlue,
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    alignSelf: 'center',
    marginTop: Metrics.xDoubleBaseMargin,
    minHeight: 48,
  },
  container: { padding: Metrics.baseMargin, paddingTop: 0 }
});
