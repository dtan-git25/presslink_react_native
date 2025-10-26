import { pop } from '@nav';
import { ButtonView } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import * as React from 'react';
import { Image } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import utility from '@utils';

const removeHeader = {
  headerShown: false,
};

const headerTransparent = {
  headerTransparent: true,
};

const centerTitle = {
  headerTitleAlign: 'center'
}

const removeTitle = {
  title: '',
};

const header = (title = '') => ({
  title,
  headerTitleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: undefined,
  },
  headerLeft: props => (
    <ButtonView
      onPress={() => pop()}
      style={{
        width: Metrics.widthRatio(45),
        height: '100%',
        ...AppStyles.centerAligned,
      }}>
      <Image source={Images.icLeftArrow} />
    </ButtonView>
  ),
});

const headersTransparent = (title = '') => ({
  title,
  headerTitleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.white),
    fontWeight: undefined,
  },
  headerTitleAlign: 'center',
  ...headerTransparent,

  headerLeft: props => (
    <ButtonView
      onPress={() => pop()}
      style={{
        width: Metrics.widthRatio(45),
        height: '100%',
        ...AppStyles.centerAligned,
      }}>
      <Image
        style={{ tintColor: Colors.txt.white }}
        source={Images.icLeftArrow}
      />
    </ButtonView>
  ),
});

const backButton = () => {
  return {
    headerLeft: props => (
      <HeaderBackButton
        backImage={() => (
          <Image
            source={Images.NavigationIcons.Back}
            resizeMode="contain"
          />
        )}
        labelVisible={false}
        onPress={() => pop()}
        style={{
          height: 30,
          width: 30,
          ...AppStyles.centerAligned,
          paddingHorizontal: utility.isPlatformAndroid() ? 0 : 16,
          marginLeft: utility.isPlatformAndroid() ? 4 : 8,
        }}
      />
    ),
  };
};


export {
  removeHeader,
  headerTransparent,
  removeTitle,
  centerTitle,
  header,
  headersTransparent,
  backButton
};
