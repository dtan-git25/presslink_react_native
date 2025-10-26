import { Colors } from '@theme';
import _ from 'lodash';
import { Alert, Linking, Platform, StatusBar } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

class utility {
  setLoginRef = null;
  setLogin = ref => (this.setLoginRef = ref);
  getSetLogin = () => this.setLoginRef;

  setServiceSeekerRef = null;
  setServiceSeeker = ref => (this.setServiceSeekerRef = ref);
  getSetServiceSeeker = () => this.setServiceSeekerRef;

  isEmpty(value) {
    return _.isEmpty(value);
  }
  _isUndefined(value) {
    return _.isUndefined(value);
  }

  isNull(value) {
    return _.isNull(value);
  }
  isPlatformAndroid = () => Platform.OS === 'android';
  isPlatformIOS = () => Platform.OS === 'ios';
  openCall(url) {
    return Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  }
  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    }
    return true;
  };
  alerts = (title, description, onPress) => {
    Alert.alert(
      title,
      description,
      [
        { text: 'OK', onPress: onPress },
        { text: 'Cancel', onPress: () => { } },
      ],
      {
        cancelable: false,
      },
    );
  };

  getStatusbar = (color = '#fff') => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(color);
      StatusBar.setTranslucent(true);
    }
  };

  imagePickr = cbSuccess => {
    const options = {
      title: 'Select Profile',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        quality: 0,
      },
    };
    launchImageLibrary(options, response => {
      console.log('res', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        cbSuccess(response.assets[0].uri);
      }
    });
  };
}

export default new utility();
