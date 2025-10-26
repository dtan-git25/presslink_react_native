import React, {useCallback, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  AppButton,
  ButtonView,
  ImageHandlerUpdated,
  MaterialTextField,
  DateTimePickerHandler,
  Form,
  DatePickerField,
  FlashMessage,
  Screen,
  TagInputContainer,
} from '@reuseableComponents';
import {AuthHeader} from '@components';
import {AppStyles, Colors, Metrics, Images} from '@theme';
import {selectSingleImage} from '@multipicker';
import Modal, {ModalContent} from 'react-native-modals';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import utility from '@utils';
import constant from '@constants';
import {request} from '../../../actions/ServiceAction';
import {DUMP, CATEGORY} from '@actionTypes';
import {push, pop} from '@nav';

let formHandler = null;
const ProviderDetailedSignUp = ({route}) => {
  let paramData = route.params.initialData;
  const categoryList = useSelector(({categoryReducer}) => categoryReducer.data);
  const dateTimePickerRef = useRef();
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    img: '',
    profileImg: '',
    mime: null,
    showModal: false,
    showCatModal: false,
    startTime: '',
    endTime: '',
    pickedEndTime: '',
    pickedStartTime: '',
    isRequired: false,
    isStartOrEndTime: false,
    businesstimings: '',
    selectedItem: '',
    keywordsArray: [],
  });

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const backAction = () => {
      setState(s => ({...s, showCatModal: false}));
      if (state.showCatModal == false) {
        pop();
      }
      if (state.showCatModal == true) {
        setState(s => ({...s, showCatModal: false}));
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  const setDate = res => {
    let time = moment(res).format('LT');
    let pickedStartTime = moment(res).format('HH:mm');
    let pickedEndTime = moment(res).format('HH:mm');
    console.log(
      'picked time : ',
      pickedStartTime,
      'pickedEndTime : ',
      pickedEndTime,
    );

    if (state.isStartOrEndTime == 'isStartTime') {
      setState(s => ({...s, startTime: time, pickedStartTime}));
    } else if (state.isStartOrEndTime == 'isEndTime') {
      setState(s => ({...s, endTime: time, pickedEndTime}));
    }
  };

  const validateTime = () => {
    if (
      state.pickedStartTime != undefined &&
      state.pickedEndTime != undefined
    ) {
      const t1 = moment().format('YYYY-MM-DD') + ` ${state.pickedStartTime}`;
      const t2 = moment().format('YYYY-MM-DD') + ` ${state.pickedEndTime}`;
      console.log('date : ', t1, ' : ', t2);
      console.log('check : ', moment(t1).isBefore(moment(t2)));
      if (moment(t1).isBefore(moment(t2))) return true;
      else {
        FlashMessage({message: 'Pick start time that is before end time'});
        return false;
      }
    } else {
      console.log('undefined data');
    }
    return true;
  };

  const switchToLogin = useCallback(() => {
    toggleModal();
    push('ProviderLogin');
  });

  const getCategories = () => {
    dispatch(
      request(
        constant.categoryList,
        constant.serviceTypes.GET,
        {},
        CATEGORY,
        false,
        false,
        cbCategorySuccess,
        cbCategoryFailure,
        CATEGORY,
      ),
    );
  };

  function cbCategorySuccess(response) {}

  function cbCategoryFailure(error) {}

  const onSignUpApiRequest = () => {
    let businesstimings = state.startTime + ' - ' + state.endTime;
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();
    if (
      state.selectedItem == '' ||
      state.startTime == '' ||
      state.endTime == ''
    ) {
      setState(s => ({...s, isRequired: true}));
      return;
    }
    if (state.startTime == state.endTime) {
      FlashMessage({message: 'Start time and End Time cannot be same'});
    } else {
      console.log('else called', paramData.mobile_no.value);
      if (isValid) {
        let formData = new FormData();
        Object.keys(paramData).map(key => {
          if (key == 'mobile_no') {
            formData.append('mobile_no', paramData.mobile_no.value);
          } else {
            formData.append(key, paramData[key]);
          }
        });
        Object.keys(payload).map(key => {
          formData.append(key, payload[key]);
        });
        state.keywordsArray.forEach(x => {
          let replaceHash = x.replace('#', '');
          formData.append('keywords[]', replaceHash);
        });
        formData.append(
          'device_type',
          utility.isPlatformAndroid() ? 'android' : 'ios',
        );
        formData.append('device_token', '1234567890');
        formData.append('user_role', '2');
        if (state?.selectedItem) {
          formData.append('business_category', state.selectedItem.id);
        }
        if (state.startTime) {
          formData.append('business_timings', businesstimings);
        }
        if (state.img != '') {
          formData.append('cover_image_url', {
            uri: state.img,
            type: state.mime,
            name: 'image',
          });
        }
        if (state.profileImg != '') {
          formData.append('image_url', {
            uri: state.profileImg,
            type: state.mime,
            name: 'image',
          });
        }
        console.log('api calle', formData);
        dispatch(
          request(
            constant.user,
            constant.serviceTypes.POST,
            formData,
            DUMP,
            true,
            false,
            cbSuccess,
            cbFailure,
            DUMP,
          ),
        );
      }
    }
  };

  function cbSuccess(response) {
    toggleModal();
  }

  function cbFailure(error) {}

  const ThankYouModal = () => {
    return (
      <>
        <View style={styles.submitedMsg}>
          <Text style={styles.submitedMsgTxt}>Thank You!</Text>
          <Text style={styles.CheckoutTitle}>
            An email has been sent verify your account
          </Text>
        </View>
        <View style={styles.CheckoutBottom}>
          <ButtonView onPress={switchToLogin} style={styles.CheckoutBtnC}>
            <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>OK</Text>
          </ButtonView>
        </View>
      </>
    );
  };

  const CategoryModal = () => {
    return (
      <>
        <View style={styles.Msg}>
          <Text style={styles.submitedMsgTxt}>
            Please select any one Category
          </Text>
          {categoryList.map(item => {
            return (
              <ButtonView onPress={selectItem(item)} style={styles.keyStyle}>
                <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
                  {'\uFF65'} {item.title}
                </Text>
              </ButtonView>
            );
          })}
        </View>
      </>
    );
  };

  const onPickImg = photo => ev => {
    selectSingleImage()
      .then(({path, mime, size}) => {
        console.log('size', size);
        if (photo == 'isProfilePhoto') {
          setState(s => ({...s, mime, profileImg: path}));
        } else if (photo == 'isCoverPhoto') {
          setState(s => ({...s, img: path, mime}));
        }
      })
      .catch(err => console.log('error picking img : ', err));
  };

  const openPicker = isStartOrEndTime => () => {
    setState(s => ({...s, isStartOrEndTime}));
    dateTimePickerRef.current.showHideDatePicker();
  };

  const toggleModal = useCallback(() =>
    setState(s => ({...s, showModal: !s.showModal})),
  );
  const selectItem = selectedItem => ev => {
    setState(s => ({...s, selectedItem, showCatModal: false}));
  };
  const toggleCatModal = useCallback(() =>
    setState(s => ({...s, showCatModal: !s.showCatModal})),
  );
  const cbOnPressDateTimePicker = useCallback(res => setDate(res));

  return (
    <Screen style={styles.container}>
      <ScrollView bounces={false}>
        <AuthHeader
          title="Complete Your Profile"
          description={`Please register your account to start using mobile \n app`}
          style={{description: AppStyles.gbRe(14, Colors.txt.mGrey)}}
          viewStyle={styles.topHeader}
        />
        <View style={styles.coverImage}>
          {state.img != '' && (
            <ImageHandlerUpdated
              style={styles.coverImage}
              source={{uri: state.img}}
            />
          )}
          <ButtonView
            style={styles.changeCoverBtn}
            onPress={onPickImg('isCoverPhoto')}>
            {state.img == '' ? (
              <View style={styles.centerElement}>
                <ImageHandlerUpdated
                  source={Images.icPlaceholder}
                  style={styles.avater}
                />
                <Text style={styles.addCvTxt}>Add Cover Photo</Text>
              </View>
            ) : (
              <AppButton
                onPress={onPickImg('isCoverPhoto')}
                title={'Change Cover'}
                textStyle={styles.changeCoverBtnTxt}
                style={styles.whiteBg}
              />
            )}
          </ButtonView>
        </View>

        <ButtonView
          onPress={onPickImg('isProfilePhoto')}
          style={styles.imagePicker}>
          <ImageHandlerUpdated
            source={
              state.profileImg ? {uri: state.profileImg} : Images.icImagePicker
            }
            style={styles.profileavater}
          />
          <Text style={AppStyles.gbRe(14, Colors.txt.dGrey)}>
            {state.profileImg ? `Change Profile Photo` : `Add Profile Photo`}
          </Text>
        </ButtonView>
        <Text style={[styles.details]}>DETAILS</Text>
        <Form ref={ref => (formHandler = ref)}>
          {(refCollector, onSubmitEditing) => {
            const {text, number} = Form.INPUTS(refCollector, onSubmitEditing);
            return (
              <>
                <DatePickerField
                  label="Business Category*"
                  style={styles.flex}
                  onPress={toggleCatModal}
                  value={
                    state.selectedItem == '' ? '' : state.selectedItem.title
                  }
                  isRequired={state.isRequired}
                  validationText="Please select Business Category"
                />

                <MaterialTextField
                  {...text({identifier: 'business_name'})}
                  label="Name of the Business*"
                  error="Name of the Business is required"
                  onSubmitEditing={Keyboard.dismiss}
                  maxLength={50}
                />
                <View style={styles.row}>
                  <DatePickerField
                    label="Start Time*"
                    dateStyle={styles.halfScreen}
                    valStyle={{color: state.startTime == '' ? '#aaa' : 'black'}}
                    onPress={openPicker('isStartTime')}
                    value={state.startTime == '' ? '' : state.startTime}
                    isRequired={state.isRequired}
                    validationText={`Please select Start Time`}
                    placeHolderText="Select Start Time"
                    displayPlaceHolder={true}
                  />

                  <DatePickerField
                    label="End Time*"
                    dateStyle={styles.halfScreen}
                    onPress={openPicker('isEndTime')}
                    valStyle={{color: state.endTime == '' ? '#aaa' : 'black'}}
                    value={state.endTime == '' ? '' : state.endTime}
                    isRequired={state.isRequired}
                    validationText={`Please select End Time`}
                    placeHolderText="Select End Time"
                    displayPlaceHolder={true}
                  />
                </View>
                <MaterialTextField
                  {...text({identifier: 'about_business'})}
                  label="About Business*"
                  multiline={true}
                  textInputStyle={styles.mtpt10}
                  error="Please give some description about the business"
                />
                <MaterialTextField
                  {...text({identifier: 'address'})}
                  style={styles.mt22}
                  label="Location of Business*"
                  error="Location of the Business is required"
                />
                <View style={styles.row}>
                  <MaterialTextField
                    {...text({identifier: 'city'})}
                    label="City*"
                    style={styles.flex}
                    error="City is required"
                  />
                  <MaterialTextField
                    {...text({identifier: 'state'})}
                    label="State*"
                    style={styles.flex}
                    error="State is required"
                  />
                </View>
                <MaterialTextField
                  {...number({identifier: 'zipcode'})}
                  label="Zip Code*"
                  error="Zip code is required"
                />
                <TagInputContainer
                  selectedTags={keywordsArray =>
                    setState(s => ({...s, keywordsArray}))
                  }
                  style={{
                    backgroundColor: 'transparent',
                    borderBottomColor: '#aaa',
                    borderBottomWidth: 1,
                    marginBottom:
                      Platform.OS == 'android' ? 7 : Metrics.heightRatio(10),
                  }}
                />
              </>
            );
          }}
        </Form>

        <AppButton
          title={'Submit'}
          onPress={onSignUpApiRequest}
          style={styles.btn}
        />

        <DateTimePickerHandler
          ref={dateTimePickerRef}
          cbOnPressDateTimePicker={cbOnPressDateTimePicker}
          mode={'time'}
        />

        <Modal visible={state.showModal} onTouchOutside={toggleModal}>
          <ModalContent style={styles.modalContent}>
            <ThankYouModal />
          </ModalContent>
        </Modal>

        <Modal visible={state.showCatModal} onTouchOutside={toggleCatModal}>
          <ModalContent style={styles.modalContent}>
            <CategoryModal />
          </ModalContent>
        </Modal>
      </ScrollView>
    </Screen>
  );
};

export default ProviderDetailedSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.bg.bg,
  },
  mt22: {marginTop: Metrics.heightRatio(22)},
  mtpt10: {
    marginTop: Metrics.heightRatio(10),
    paddingTop: Metrics.heightRatio(10),
  },

  conatainer: {
    paddingTop: Metrics.smallMargin,
    paddingHorizontal: Metrics.smallMargin + 6,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  details: {
    ...AppStyles.gbSb(14, Colors.txt.dGrey),
    marginHorizontal: Metrics.heightRatio(5),
  },
  whiteBg: {
    backgroundColor: Colors.bg.white,
  },
  keyStyle: {
    paddingVertical: Metrics.heightRatio(10),
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  h6: {
    ...AppStyles.gbSb(30, Colors.txt.dGrey),
  },
  flex: {flex: 1},
  changeCoverBtnTxt: {
    flex: 0,
    color: Colors.primary.violet,
  },
  halfScreen: {width: Metrics.halfScreenWidth - 40},
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.smallMargin,
    backgroundColor: Colors.bg.white,
    marginBottom: Metrics.baseMargin,
  },
  topHeader: {
    justifyContent: 'flex-start',
  },
  avater: {
    height: Metrics.heightRatio(30),
    width: Metrics.heightRatio(30),
    marginRight: Metrics.baseMargin,
    alignItems: 'center',
  },
  profileavater: {
    ...AppStyles.roundImage(45),
    height: Metrics.heightRatio(30),
    width: Metrics.heightRatio(30),
    marginRight: Metrics.baseMargin,
  },
  centerElement: {alignItems: 'center'},
  inputTxt: {
    padding: 0,
    height: Metrics.heightRatio(30),
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  modalCont: {
    backgroundColor: 'red',
    width: Metrics.widthRatio(230),
    alignItems: 'center',
  },

  modalTitle: {
    ...AppStyles.gbSb(20, Colors.txt.dGrey),
  },
  modalTxt: {
    ...AppStyles.gbRe(12, Colors.txt.dGrey),
    textAlign: 'center',
    marginVertical: Metrics.heightRatio(10),
  },
  addCvTxt: {
    ...AppStyles.gbRe(14, Colors.txt.dGrey),
    marginTop: Metrics.heightRatio(10),
  },
  Inputcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  coverImage: {
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenWidth / 2,
    alignSelf: 'center',
    borderRadius: 4,
    marginBottom: Metrics.smallMargin,
    backgroundColor: 'white',
  },
  inputLabel: {
    paddingTop: Metrics.heightRatio(4),
    width: '100%',
  },
  txtLabel: {
    ...AppStyles.gbRe(14, Colors.primary.violet),
  },
  keywordStyle: {
    ...AppStyles.gbRe(14, Colors.primary.violet),
    marginHorizontal: Metrics.heightRatio(10),
    marginTop: Metrics.heightRatio(10),
  },
  inputSmall: {
    width: '45%',
    marginRight: '4%',
  },
  changeCoverBtn: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: Colors.SocialButton.purple,
    marginTop:
      Platform.OS == 'ios' ? Metrics.heightRatio(5) : Metrics.heightRatio(0),

    marginBottom: Metrics.heightRatio(50),
    minHeight: Metrics.heightRatio(40),
  },
  submitedMsg: {
    marginBottom: Metrics.heightRatio(52),
    alignItems: 'center',
  },
  Msg: {
    // marginBottom: Metrics.heightRatio(52),
    // alignItems: 'center',
  },
  submitedMsgTxt: {
    ...AppStyles.gbSb(18),
    marginBottom: Metrics.smallMargin,
    color: 'black',
  },
  CheckoutModalContent: {marginBottom: Metrics.heightRatio(46)},
  modalContent: {width: Metrics.screenWidth - Metrics.widthRatio(52)},
  CheckoutBtn: {
    width: '30%',
    backgroundColor: Colors.bg.white,
  },
  CheckoutTitle: {
    ...AppStyles.gbRe(16),
    paddingHorizontal: Metrics.baseMargin,
    textAlign: 'center',
    lineHeight: 20,
    color: 'black',
  },
  CheckoutBtnTxt: {
    flex: 0,
    color: Colors.primary.violet,
  },
  CheckoutBtnC: {
    padding: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: Colors.bg.lGrey,
  },
  CheckoutBottom: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
