import React, {  useEffect, useState } from 'react';
import { AppStyles, Images, Metrics } from '@theme';
import { StyleSheet, Pressable, View, ImageBackground, Text, Alert } from 'react-native';
import { BottomModal, ModalContent } from 'react-native-modals';
import { AppButton } from '@reuseableComponents';
import { navigate } from '@nav';


export function LandingPage({ navigation }) {
  const [modelShown, setModelShown] = useState(true);

  const switchTo = (route) => {

    setModelShown(false);

    setTimeout(() => {
      navigate(route)
    }, 800);
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setModelShown(true);
    });
    return unsubscribe;
  }, [navigation]);


  return (
    <>
      <BottomModal overlayBackgroundColor={'#2a2e43'} visible={modelShown}>
        <ModalContent>
          <View styles={{ padding: Metrics.baseMargin }}>
            <Text style={[AppStyles.gbSb(30, '#000'), styles.title]}>
              Select your role
            </Text>
            <Text style={[AppStyles.gbRe(14, '#454f63'), styles.txt]}>
              The best way to navigate your world and discover {'\n'} new
              businesses. Let’s get started!
            </Text>
            <AppButton
              backgroundColor={'#3A1777'}
              title="Service Seeker"
              onPress={() => switchTo('Login')}
            />
            <AppButton
              title="Service Provider"
              onPress={() => switchTo('ProviderLogin')}
            />
          </View>
        </ModalContent>
      </BottomModal>
      <Pressable style={{ flex: 1 }} onPress={() => setModelShown(true)}>
        <ImageBackground
          source={Images.LandingPageBackground}
          style={{ flex: 1 }}
        />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: Metrics.smallMargin,
  },
  txt: {
    marginVertical: Metrics.smallMargin,
    lineHeight: 18,
  },
});
