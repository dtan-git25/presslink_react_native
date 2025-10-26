import MultiPicker from 'react-native-image-crop-picker';

/*
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
*/

// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-picker';
import Utils from '@utils';

const VIDEO_PICKER_OPTIONS = {
  mediaType: 'video',
  videoQuality: 'medium',
  durationLimit: 120,
  allowsEditing: true,
  storageOptions: {
    cameraRoll: true,
    waitUntilSaved: true,
  },
};

const IMAGE_CONFIG = {
  multiple: true,
  maxFiles: 6,
  mediaType: 'photo',
  // compressImageMaxWidth: 1024,
  // compressImageMaxHeight: 1024,
  // compressImageQuality: 1,
};

const IMAGE_CONFIG_LOW_QUALITY = {
  // compressImageMaxWidth: 800,
  // compressImageMaxHeight: 600,
  compressImageQuality: 1,
};

const CROP_CONFIG = {
  // width: 1600,
  // height: 1200,
  avoidEmptySpaceAroundImage: true,
};

const IMAGE_PICKER_CONST = {
  mediaType: 'video',
  videoQuality: 'high',
};

// const openImagePickerVideoGallery = cb => {
//   launchImageLibrary(IMAGE_PICKER_CONST, ({uri}) => {
//     uri &&
//       cb({
//         mime: getUriType(uri),
//         path: uri,
//       });
//   });
// };
// ImagePicker.launchImageLibrary(IMAGE_PICKER_CONST, cb);

/*
const openDocumentPicker = async (cbSuccess, cbFailure) => {
  // Pick a single file
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    cbSuccess(res[0]);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};
*/

const getUriType = uri => {
  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  return fileType;
};

// returns promise
const selectMultipleImages = (
  config: Object = Utils.isPlatformAndroid()
    ? {
      ...IMAGE_CONFIG_LOW_QUALITY,
      multiple: true,
      maxFiles: 6,
    }
    : IMAGE_CONFIG,
) => MultiPicker.openPicker(config);

const selectSingleImage = (config: Object = IMAGE_CONFIG) =>
  MultiPicker.openPicker({
    ...config,
    multiple: false,
    mediaType: 'photo',
    compressImageQuality: 0.4,
  });

const selectVideo = () =>
  MultiPicker.openPicker({
    mediaType: 'video',
  });

const selectCameraVideo = () =>
  MultiPicker.openCamera({
    mediaType: 'video',
    duration: 120000,
  });

const selectCameraImage = () =>
  MultiPicker.openCamera(
    Utils.isPlatformAndroid() ? IMAGE_CONFIG_LOW_QUALITY : {},
  );

//const pickVideo = (cb) => ImagePicker.showImagePicker(VIDEO_PICKER_OPTIONS, (video) => cb(video));

const cropImage = imgObj => {
  return MultiPicker.openCropper({ ...imgObj, ...CROP_CONFIG });
};

export {
  selectMultipleImages,
  selectVideo,
  selectSingleImage,
  selectCameraVideo,
  cropImage,
  IMAGE_CONFIG_LOW_QUALITY,
  //pickVideo,
  selectCameraImage,
  // openDocumentPicker,
  // openImagePickerVideoGallery,
  // openGallery,
};
