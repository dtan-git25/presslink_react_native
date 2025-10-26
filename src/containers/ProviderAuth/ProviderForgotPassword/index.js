import {AuthHeader, Page} from '@components';
import {pop} from '@nav';
import {AppButton, MaterialTextField} from '@reuseableComponents';
import {AppStyles, Colors, Metrics} from '@theme';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function ProviderForgotPassword() {
  return (
    <Page>
      <AuthHeader
        title="Forgot Password?"
        description={`Enter the email address associated with your \n account.`}
        style={{description: AppStyles.gbRe(14, Colors.txt.mGrey)}}
      />

      <MaterialTextField
        label="Email"
        // placeholder="Enter your registered email address"
      />

      <View style={{marginTop: Metrics.baseMargin * 2}}>
        <AppButton
          onPress={() => pop()}
          backgroundColor={Colors.SocialButton.purple}
          title="Submit"
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({});
