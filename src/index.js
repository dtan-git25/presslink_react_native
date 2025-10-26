import React, { Component, useEffect, useState } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import Spinner from 'react-native-globalspinner';
import { ModalPortal } from 'react-native-modals';

import _ from 'lodash';
import { useSelector, Provider } from 'react-redux';
import { LoginContext } from './contexts';
import { store, persistor } from './store';
import HttpServiceManager from './services/HttpServiceManager';
import constant from './constants';
import RootNavigator from './navigator';
import { Colors } from '@theme';
import utility from '@utils';
import { Popup } from '@reuseableComponents';
import { StripeProvider } from '@stripe/stripe-react-native';

export default class App extends Component {
  componentDidMount() {
    HttpServiceManager.initialize(constant.baseURL, {
      token: constant.applicationToken,
    });
    //set designedAtX verify it on Adobe XD Desgin file
    //Metrics.designedAtX = false;
    utility.setLogin(this.setLogin);
    utility.setServiceSeeker(this.setServiceSeeker);
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }
  }


  state = { isReduxLoaded: false, isLogin: false, isServiceSeeker: true };

  setLogin = isLogin => this.setState({ isLogin });
  setServiceSeeker = isServiceSeeker => this.setState({ isServiceSeeker });

  onBeforeLift = () => {
    //   singleton.storeRef = store;
    this.setState({ isReduxLoaded: true }, () => {
      if (!_.isEmpty(store.getState().userReducer.data)) {
        HttpServiceManager.getInstance().userToken =
          store.getState().userReducer.data.api_token;
        this.setLogin(true);
        this.setServiceSeeker(
          store.getState().userReducer.data.user_group_id == 1 ? true : false,
        );
        if (Platform.OS == 'ios') {
          setTimeout(() => {
            SplashScreen.hide();
          }, 3000);
        } else {
          setTimeout(() => {
            SplashScreen.hide();
          }, 1000);
        }
      }
      // else {
      //   setTimeout(() => {
      //     SplashScreen.hide();
      //   }, 3000);
      // }
    });
  };

  getNavigator = () => {
    if (!this.state.isReduxLoaded) {
      return () => { };
    } else {
      return rootNavigator(this.state.isLogin, this.state.isServiceSeeker);
      //!_.isEmpty(store.getState().loginReducer.data)
    }
  };

  render() {
    return (
      <Provider store={store}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={'white'}
        />
        <PersistGate onBeforeLift={this.onBeforeLift} persistor={persistor}>
          <StripeProvider
            publishableKey={constant.publishableKey}
          // merchantIdentifier="merchant.identifier"
          >

            <RootNavigator
              isLogin={this.state.isLogin}
              isServiceSeeker={this.state.isServiceSeeker}
            />
          </StripeProvider>
        </PersistGate>

        <FlashMessage position="top" />
        <Spinner type="MaterialIndicator" color={Colors.primary.violet} />
        <ModalPortal />
        <Popup />
      </Provider>
    );
  }
}
