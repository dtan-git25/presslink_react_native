import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Login,
  SignUp,
  ForgotPassword,
  LandingPage,
  Tabs,
  Categories,
  EditProfile,
  Search,
  Notifications,
  ServiceDetail,
  ScheduleDetail,
  ServiceCheckout,
  MenuDetail,
  OrderDetail,
  ContentPage,
  // Chat,
  RateReview,
  ProviderLogin,
  ProviderTabs,
  ProviderSignUp,
  ProviderForgotPassword,
  ProviderDetailedSignUp,
  ProviderMyEarnings,
  PaymentMethod,
  AddPaymentMethod,
  OrdersGrid,
  PackageDetail,
  ProviderBankDetails,
  ProviderMoreReviews,
  MoreServices,
  ProviderChangePassword,
  ProviderCreateService,
  ProviderEditProfile,
  PrivacyPolicy,
  Chat,
  ChatScreen,
} from '@containers';

import { setNavigatorRef } from '@nav';
import { header, headersTransparent, centerTitle } from './navigatorHelper';
import { LocationPicker } from '@reuseableComponents';
import { enableScreens } from 'react-native-screens';
import ProviderNavTabs from './ProviderNavTabs';
import SeekerNavTabs from './SeekerNavTabs';
import { Colors, Images } from '@theme';
import { backButton } from './navigatorHelper';

enableScreens(true)

const Stack = createStackNavigator();

const Auth = () => (
  <Stack.Navigator
    screenOptions={{
      ...backButton(),
      headerStyle: {
        backgroundColor: Colors.bg.bg
      }
    }}>
    <Stack.Screen name="LandingPage" component={LandingPage}

      options={{
        headerShown: false
      }} />
    <Stack.Screen name="Login" component={Login} options={{ title: '' }} />
    <Stack.Screen name="SignUp" component={SignUp} options={{ title: '' }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: '' }} />

    <Stack.Screen name="ProviderLogin" component={ProviderLogin} options={{ title: '' }} />
    <Stack.Screen name="ProviderSignUp" component={ProviderSignUp} options={{ title: '' }} />
    <Stack.Screen
      name="ProviderForgotPassword"
      component={ProviderForgotPassword}
      options={{ title: '' }} />

    <Stack.Screen
      name="ProviderDetailedSignUp"
      component={ProviderDetailedSignUp}
      options={{ title: '' }} />
    <Stack.Screen
      name="ContentPage"
      // options={header('Notifications')}
      component={ContentPage}
      options={{
        headerTitleAlign: 'center',
        ...header('Notifications')
      }}
    />


  </Stack.Navigator >
);

const Home = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={SeekerNavTabs} options={{ headerShown: false }} />
    <Stack.Screen
      name="Categories"
      component={Categories}
      options={header('Categories')}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}

      options={{
        headerTitleAlign: 'center',
        ...header('Edit Profile')
      }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerTitleAlign: 'center', ...header('Skin cleaning') }}
    />
    <Stack.Screen
      name="Location"
      component={LocationPicker}
      options={{
        headerTitleAlign: 'center',
        ...header('Location')
      }}
    />
    <Stack.Screen
      name="Search"
      component={Search}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      // options={{ headerShown: false }}
      options={{
        headerTitleAlign: 'center',
        ...header('Notifications')
      }}

    />
    <Stack.Screen
      name="ServiceDetail"
      component={ServiceDetail}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="ContentPage"
      // options={header('Notifications')}
      component={ContentPage}
      options={{
        headerShown: true,
        headerTitleAlign: 'center',
        ...header('Notifications')
      }}
    />

    <Stack.Screen
      name="OrdersGrid"
      component={OrdersGrid}
      options={header('Orders')}
    />

    <Stack.Screen
      name="PaymentMethod"
      options={{
        headerTitleAlign: 'center',
        ...header('Payment Method')
      }}
      component={PaymentMethod}
    />

    <Stack.Screen
      name="AddPaymentMethod"
      options={{ headerTitleAlign: 'center', ...header('Add Payment Method') }}
      component={AddPaymentMethod}
    />

    <Stack.Screen
      name="PackageDetail"
      component={PackageDetail}
      options={{ headerShown: true, headerTransparent: true }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ProviderChangePassword}
      // options={header('Change Password')}
      options={{
        headerShown: true,
        headerTitleAlign: 'center',
        ...header('Change Password')
      }}
    />

    <Stack.Screen
      name="ProviderMoreReviews"
      component={ProviderMoreReviews}
      options={{
        headerTitleAlign: 'center',
        ...header('Reviews')
      }}
    />
    <Stack.Screen
      name="MoreServices"
      component={MoreServices}
      options={{
        headerTitleAlign: 'center',
        ...header('Services')
      }}
    />

    <Stack.Screen
      name="ScheduleDetail"
      component={ScheduleDetail}
      options={{ ...header('') }}
    />
    <Stack.Screen
      name="ServiceCheckout"
      component={ServiceCheckout}
      options={{
        headerTitleAlign: 'center',
        ...header('Checkout')
      }}
    />
    <Stack.Screen
      name="RateReview"
      component={RateReview}
      options={{ headerTitleAlign: 'center', ...header('Rate and Review') }}
    />
  </Stack.Navigator>
);

const ProviderHome = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProviderHome"
      component={ProviderNavTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProviderNotifications"
      component={Notifications}
      options={{
        headerShown: true,
        ...header('Notifications'),
        headerTitleAlign: 'center',
      }} />
    <Stack.Screen
      name="MenuDetail"
      component={MenuDetail}
      options={header('')}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetail}
      options={header()}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerTitleAlign: 'center', ...header('Skin cleaning') }}
    />

    <Stack.Screen
      name="Inbox"
      component={Chat}
      options={header('Inbox')}
    />

    <Stack.Screen
      name="ProviderMyEarnings"
      component={ProviderMyEarnings}
      options={headersTransparent('My Earnings')}
    />
    <Stack.Screen
      name="ProviderBankDetails"
      component={ProviderBankDetails}
      options={{ headerTitleAlign: 'center', ...header('Bank Details') }}
    />
    <Stack.Screen
      name="ProviderMoreReviews"
      component={ProviderMoreReviews}
      options={{
        headerTitleAlign: 'center',
        ...header('Reviews')
      }}
    />
    <Stack.Screen
      name="MoreServices"
      component={MoreServices}
      options={{
        headerTitleAlign: 'center',
        ...header('Services')
      }}
    />
    <Stack.Screen
      name="ProviderChangePassword"
      component={ProviderChangePassword}
      options={{
        headerShown: true,
        headerTitleAlign: 'center',
        ...header('Change Password')
      }} />
    <Stack.Screen
      name="ProviderCreateService"
      component={ProviderCreateService}
      options={header('Create Service')}

    />
    <Stack.Screen
      name="ProviderEditProfile"
      component={ProviderEditProfile}
      options={{
        // header('Edit Profile')
        headerTitleAlign: 'center',
        ...header('Edit Profile')
      }}
    />

    <Stack.Screen
      name="ContentPage"
      component={ContentPage}
      options={{
        headerShown: true,
        headerTitleAlign: 'center',
        ...header('ContentPage')
      }}
    />
  </Stack.Navigator>
);

// Use this for only drawer in your app.
const RootNavigator = ({ isLogin, isServiceSeeker }) => {
  const HomeScreen = isServiceSeeker ? Home : ProviderHome;
  const Flow = isLogin ? HomeScreen : Auth;
  return (
    <NavigationContainer ref={setNavigatorRef}>
      <Flow />
    </NavigationContainer>
  );
};

export default RootNavigator;
