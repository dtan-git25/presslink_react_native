import ImagePicker from 'react-native-image-crop-picker';
import { Alert, Linking } from 'react-native';
const IMAGE_CONFIG = {
  multiple: true,
  mediaType: 'photo',
  compressImageMaxWidth: 800,
  compressImageMaxHeight: 600,
  compressImageQuality: 0.8,
};

const SINGLE_IMAGE_CONFIG = {
  multiple: false,
  mediaType: 'photo',
  compressImageMaxWidth: 800,
  compressImageMaxHeight: 600,
  compressImageQuality: 0.8,
};

const _showPermissionPop = () => {
  Alert.alert(
    'Camera Permission',
    'Please go to setting and open camera permission',
    [
      {
        text: 'Settings',
        onPress: () => {
          Linking.openSettings();
        },
      },
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
    ],
    { cancelable: false },
  );
};

errorCaseMatching = errorMessage => {
  switch (errorMessage) {
    case 'Error: User cancelled image selection':
      console.log('error  switch  : ', errorMessage);
      break;

    default:
      _showPermissionPop();
      break;
  }
};

// returns promise
const selectMultipleImages = cb => {
  ImagePicker.openPicker(IMAGE_CONFIG)
    .then(response => {
      console.log('openPicker single  : ', response);
      if (cb) cb(response);
    })
    .catch(error => {
      const errorMessage = error + '';
      this.errorCaseMatching(errorMessage);
    });
};

const selectSingleImages = cb => {
  ImagePicker.openPicker(SINGLE_IMAGE_CONFIG)
    .then(response => {
      console.log('ImagePicker response', response)
      if (cb) cb(response);
    })
    .catch(error => {
      const errorMessage = error + '';
      this.errorCaseMatching(errorMessage);
    });
};

const openCamera = cb => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
  })
    .then(response => {
      if (cb) cb(response);
    })
    .catch(error => {
      console.log('openCamera catch : ', error);
      const errorMessage = error + '';
      this.errorCaseMatching(errorMessage);
    });
};
export { selectMultipleImages, selectSingleImages, openCamera };
