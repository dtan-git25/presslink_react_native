import React from 'react';
import { Image, Platform, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppStyles, Colors, DefaultTheme, Fonts, Images, Metrics } from '../../theme';
import Home from '../../containers/Tabs/Home';
import MyOrders from '../../containers/Tabs/MyOrders';
import MyProfile from '../../containers/Tabs/MyProfile';
import Settings from '../../containers/Tabs/Settings';
import { Chat } from '@containers';

const Tab = createBottomTabNavigator();
export default function SeekerNavTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconColor;
          if (route.name === 'Home') {
            iconName = Images.home;
            iconColor = focused
              ? Colors.primary.violet
              : Colors.bg.tabGray;
          } else if (route.name === 'MyOrders') {
            iconName = Images.orders;
            iconColor = focused
              ? Colors.primary.violet
              : Colors.bg.tabGray;
          } else if (route.name === 'MyProfile') {
            iconName = Images.profile;
            iconColor = focused
              ? Colors.primary.violet
              : Colors.bg.tabGray;
          }
          // else if (route.name === 'Inbox') {
          //   iconName = Images.chat;
          //   iconColor = focused
          //     ? Colors.primary.violet
          //     : Colors.bg.tabGray;
          // }
          else if (route.name === 'Settings') {
            iconName = Images.settings;
            iconColor = focused
              ? Colors.primary.violet
              : Colors.bg.tabGray;
          }
          return (
            <View style={[styles.mainView, { borderTopWidth: focused ? 2 : 0 }]}>
              <Image source={iconName} style={{ tintColor: iconColor }} />
            </View>
          )
        },
        tabBarActiveTintColor: Colors.primary.violet,
        tabBarInactiveTintColor: Colors.bg.tabGray,
        tabBarStyle: styles.tabStyles,
        headerTitleStyle: styles.titleStyle,
        headerStyle: styles.whitebg,
        tabBarLabelStyle: {
          ...AppStyles.tabReg(),
        }

      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          title: "My Menu",
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          title: "My Orders",
          headerTitleAlign: 'center'
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          title: "My Profile",
          headerTitleAlign: 'center'
        }}
      />
      {/* <Tab.Screen
        name="Inbox"
        component={Chat}
        options={{
          title: "Chat",
          headerTitleAlign: 'center'
        }}
      /> */}
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          headerTitleAlign: 'center'
        }}
      />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: -2, width: 50, alignItems: 'center', borderTopColor: Colors.primary.violet
  },
  tabStyles: {
    shadowColor: 'rgba(0, 0, 0, 0.09)',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    paddingBottom: Platform.OS == 'ios' ? Metrics.heightRatio(15) : Metrics.heightRatio(10),
    height: Platform.OS == 'ios' ? 65 : Metrics.heightRatio(55)
  },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400'
  },
  whitebg: {
    backgroundColor: 'white',
  }
})