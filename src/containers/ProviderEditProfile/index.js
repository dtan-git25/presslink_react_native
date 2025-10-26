import React, { useCallback, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, Keyboard, ScrollView, Platform, BackHandler } from 'react-native';
import {
  AppButton,
  ButtonView,
  InputTextField, Form,
  ImageHandlerUpdated,
  DatePickerField,
  DateTimePickerHandler,
  FlashMessage,
  MaterialTextField,
  Screen,
  TagInputContainer,
} from '@reuseableComponents';
import { Page } from '@components';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import { useDispatch, useSelector } from 'react-redux';
import { selectSingleImage } from '@multipicker';
import constant from '@constants';
import { USER } from '@actionTypes';
import moment from 'moment';
import { request } from '../../actions/ServiceAction';
import { pop } from '@nav';
import Modal, { ModalContent } from 'react-native-modals';
import { CATEGORY } from '@actionTypes';


let formHandler = null
const ProviderEditProfile = ({ params }) => {
  const user = useSelector(({ userReducer }) => userReducer.data)
  const categoryList = useSelector(({ categoryReducer }) => categoryReducer.data)
  const dispatch = useDispatch();
  const dateTimePickerRef = useRef()
  const { image_url, cover_image_url, business_timings, mobile_no, about_business, business_name, business_category, address, city, zipcode, keywords, slug } = user

  let businessStartTime = business_timings?.split('-')[0].toString().trim()
  let businessEndTime = business_timings?.split("-").pop().toString().trim()

  const [state, setState] = React.useState({
    coverImage: cover_image_url,
    profileImg: image_url,
    mime: null,
    selectedItem: { title: business_category },
    itemSelected: false,
    imgIsSelected: false,
    profileImgIsSelected: false,
    showCatModal: false,
    startTime: business_timings?.split('-')[0].toString().trim(),
    endTime: business_timings?.split("-").pop().toString().trim(),
    isStartOrEndTime: false,
    isRequired: false,
    pickedStartTime: moment(businessStartTime, ["h:mm A"]).format("HH:mm"),
    pickedEndTime: moment(businessEndTime, ["h:mm A"]).format("HH:mm"),
    keywordsArray: keywords

  })
  console.log('keywords', keywords)
  const setDate = (res) => {


    let time = moment(res).format('LT');
    console.log("picked time : ", res, "formatted : ", time)
    let pickedStartTime = moment(res).format('HH:mm')
    let pickedEndTime = moment(res).format('HH:mm')

    if (state.isStartOrEndTime == "isStartTime") {
      setState(s => ({ ...s, startTime: time, pickedStartTime }));
    }
    else if (state.isStartOrEndTime == "isEndTime") {
      setState(s => ({ ...s, endTime: time, pickedEndTime }));
    }
  }


  const openPicker = (isStartOrEndTime) => () => {
    setState(s => ({ ...s, isStartOrEndTime }))
    dateTimePickerRef.current.showHideDatePicker()
  }

  const onPickImg = (photo) => (ev) => {
    selectSingleImage()
      .then(({ path, mime, size }) => {
        if (photo == "isProfilePhoto") {
          console.log('size', size)
          setState(s => ({ ...s, mime, profileImg: path, profileImgIsSelected: true }))
        }
        else if (photo == "isCoverPhoto") {
          console.log('size', size)

          setState(s => ({ ...s, coverImage: path, mime, imgIsSelected: true }))
        }
      })
      .catch(err => console.log('error picking img : ', err));
  }

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
        CATEGORY
      )
    )
  }

  function cbCategorySuccess(res) { }

  function cbCategoryFailure() { }
  useEffect(() => {
    getCategories()
  }, [])


  useEffect(() => {
    const backAction = () => {
      setState(s => ({ ...s, showCatModal: false }))
      if (state.showCatModal == false) {
        pop()
      }
      if (state.showCatModal == true) {
        setState(s => ({ ...s, showCatModal: false }))
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  });

  // const validateTime = () => {
  //   //only checking if both are AM or PM
  //   if (state.startTime.split(" ")[1] == state.endTime.split(" ")[1]) {

  //     const t1 = moment().format("YYYY-MM-DD") + ` ${ state.startTime }`;
  //     const t2 = moment().format("YYYY-MM-DD") + ` ${ state.endTime }`;
  //     console.log("date : ", t1, " : ", t2)
  //     console.log("check : ", moment(t1).isBefore(moment(t2)));
  //     if (moment(t1).isBefore(moment(t2)))
  //       return true
  //     else {
  //       FlashMessage({ message: 'Pick start time that is before end time' })
  //       return false
  //     }
  //   }
  //   return true
  // }
  console.log('state.pickedEndTime', state.pickedEndTime)
  console.log('state.pickedStartTime', state.pickedStartTime)

  const validateTime = () => {
    //only checking if both are AM or PM
    // if (state.startTime.split(" ")[1] == state.endTime.split(" ")[1]) {
    console.log('state.pickedEndTime', state.pickedEndTime)
    if (state.pickedStartTime != undefined && state.pickedEndTime != undefined) {
      const t1 = moment().format("YYYY-MM-DD") + ` ${state.pickedStartTime}`;
      const t2 = moment().format("YYYY-MM-DD") + ` ${state.pickedEndTime}`;
      console.log("date : ", t1, " : ", t2)
      console.log("check : ", moment(t1).isBefore(moment(t2)));
      if (moment(t1).isBefore(moment(t2)))
        return true
      else {
        FlashMessage({ message: 'Pick start time that is before end time' })
        return false
      }
    }
    else {
      console.log("undefined data")
    }
    return true
    // }
  }


  const onUpdateProfileApiRequest = () => {
    // const isValidTime = validateTime()
    let businesstimings = state.startTime + ' - ' + state.endTime
    const payload = formHandler.onSubmitForm();
    // console.log('isValidTime', isValidTime)
    let isValid = formHandler.checkValidation();
    if (state.startTime == state.endTime) {
      FlashMessage({ message: "Start time and End Time cannot be same" })
    }

    else {
      // if (isValidTime) {
      console.log('else called')

      let formData = new FormData();
      formData.append('_method', 'PUT');
      if (state.itemSelected) { formData.append('business_category', state?.selectedItem.id) }
      formData.append('business_name', payload?.business_name ? payload?.business_name : business_name)
      formData.append('business_timings', businesstimings)
      formData.append('about_business', payload?.about_business ? payload?.about_business : about_business)
      formData.append('address', payload?.address ? payload?.address : address)
      formData.append('city', payload?.city ? payload?.city : city)
      formData.append('state', payload?.state ? payload?.state : state)
      formData.append('zipcode', payload?.zipcode ? payload?.zipcode : zipcode)
      formData.append('user_role', '2')
      state.keywordsArray.forEach((x) => {
        let replaceHash = x.replace('#', '')
        formData.append("keywords[]", replaceHash)
      })
      if (state.imgIsSelected) {
        formData.append('cover_image_url', {
          uri: state.coverImage,
          type: state.mime,
          name: 'image'
        });
      }
      if (state.profileImgIsSelected) {
        formData.append('image_url', {
          uri: state.profileImg,
          type: state.mime,
          name: 'image'
        });
      }
      if (state.selectedItem == '' || state.startTime == '' || state.endTime == '') {
        setState(s => ({ ...s, isRequired: true }));
      }
      else {
        dispatch(
          request(
            constant.user + `/${slug}`,
            constant.serviceTypes.POST,
            formData,
            USER,
            true,
            false,
            cbSuccess,
            cbFailure,
            USER
          )
        )
      }
      // }
    }
  }

  function cbSuccess(response) {
    pop()
  }

  function cbFailure(error) { }


  const dismissKeyboard = useCallback(() => Keyboard.dismiss())

  const selectItem = (selectedItem) => (ev) => { setState(s => ({ ...s, selectedItem, itemSelected: true, showCatModal: false })) }
  const toggleCatModal = useCallback(() => setState(s => ({ ...s, showCatModal: !s.showCatModal })))


  const CategoryModal = () => {
    return (
      <>
        <View style={styles.Msg}>
          <Text style={styles.submitedMsgTxt}>Please select any one Category</Text>
          {categoryList.map(item => {
            return (
              <ButtonView onPress={selectItem(item)} style={[styles.keyStyle, { backgroundColor: state.selectedItem.title != item.title ? 'white' : Colors.bg.lightPurple }]}>
                <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
                  {item.title}
                </Text>
              </ButtonView>
            )
          })}
        </View>
      </>

    )
  }





  return (
    <Screen style={styles.conatainer}>
      <ScrollView bounces={false} style={styles.scrollCont}>

        <View>
          <ImageHandlerUpdated
            style={styles.coverImage}
            source={{
              uri: state.coverImage,
            }}
          />
          <AppButton
            onPress={onPickImg("isCoverPhoto")}
            title={'Change Cover'}
            style={styles.changeCoverBtn}
            textStyle={styles.changeCoverBtnTxt}
          />
        </View>

        <ButtonView
          onPress={onPickImg("isProfilePhoto")}
          style={styles.imagePicker}>
          <ImageHandlerUpdated
            source={{
              uri: state.profileImg,
            }}
            style={styles.avater}
          />
          <Text style={AppStyles.gbRe(14, Colors.txt.dGrey)}>
            Change Profile Photo
          </Text>
        </ButtonView>

        <Text style={styles.detailStyle}>DETAILS</Text>
        <Form ref={ref => (formHandler = ref)}>
          {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
            const { text, optional, number } = Form.INPUTS(refCollector, onSubmitEditing);
            return (
              <>
                <View style={styles.Inputcontainer}>
                  <DatePickerField
                    label="Business Category*"
                    dateStyle={styles.catStyle}
                    labelTxtStyle={AppStyles.gbRe(13, Colors.primary.violet)}
                    // valStyle={AppStyles.gbRe(14)}
                    valStyle={{ ...AppStyles.gbRe(14), color: 'black', }}

                    onPress={toggleCatModal}
                    value={state.selectedItem == '' ? '' : state.selectedItem.title}
                    isRequired={state.isRequired}
                    validationText="Please select Business Category"
                  />
                  <MaterialTextField
                    {...text({ identifier: 'business_name' })}
                    label={'Name of the Business*'}
                    style={styles.inputTxt}
                    value={business_name}
                    maxLength={50}
                    error="Please enter business name"
                    validationStyle={styles.validationStyle}
                    subAnimated={styles.borderStyle}
                    onSubmitEditing={dismissKeyboard}
                  />

                  <View style={[styles.row]}>

                    <DatePickerField
                      label="Start Time*"
                      dateStyle={styles.btmLine}
                      labelTxtStyle={AppStyles.gbRe(13, Colors.primary.violet)}
                      onPress={openPicker("isStartTime")}
                      valStyle={{ ...AppStyles.gbRe(14), color: state.startTime == '' ? '#aaa' : 'black', }}
                      value={state.startTime}
                      isRequired={state.isRequired}
                      validationText={`Please select Start Time`}
                      placeHolderText="Select Start Time"
                      displayPlaceHolder={true}
                    />

                    <DatePickerField
                      label="End Time*"
                      dateStyle={styles.btmLine}
                      onPress={openPicker("isEndTime")}
                      labelTxtStyle={AppStyles.gbRe(13, Colors.primary.violet)}

                      valStyle={{ ...AppStyles.gbRe(14), color: state.endTime == '' ? '#aaa' : 'black' }}
                      value={state.endTime}
                      isRequired={state.isRequired}
                      validationText={`Please select End Time`}
                      placeHolderText="Select End Time"
                      displayPlaceHolder={true}
                    />
                  </View>
                  <MaterialTextField
                    {...text({ identifier: 'about_business' })}
                    label={'About Business*'}
                    style={[styles.inputTxt, styles.aboutText]}
                    textInputStyle={[styles.aboutTextInput,
                    { marginTop: Metrics.heightRatio(12) }]}
                    labelStyle={styles.inputLabel}
                    txtLabel={styles.txtLabel}
                    multiline={true}
                    value={about_business}
                    error="Please give some description about the business"
                    validationStyle={styles.validationStyle}
                    subAnimated={styles.borderStyle}
                  />


                  {/* <MaterialTextField
                    {...text({ identifier: 'address' })}
                    label={'Location of Business*'}
                    style={styles.inputTxt}
                    value={address}
                    error="Please enter Location of Business*"
                    validationStyle={styles.validationStyle}
                    subAnimated={styles.borderStyle}

                  /> */}
                  <MaterialTextField
                    {...text({ identifier: 'address' })}
                    label={'Location of Business*'}
                    style={[styles.inputTxt, styles.aboutText, { height: Metrics.heightRatio(50), marginBottom: Metrics.heightRatio(20), }]}
                    textInputStyle={[styles.aboutTextInput,
                    { marginTop: Metrics.heightRatio(12), height: Metrics.heightRatio(50), }]}
                    labelStyle={styles.inputLabel}
                    txtLabel={styles.txtLabel}
                    multiline={true}
                    value={address}
                    error="Please enter Location of Business"
                    validationStyle={styles.validationStyle}
                    subAnimated={styles.borderStyle}
                  />

                  <View style={styles.row}>
                    <MaterialTextField
                      {...text({ identifier: 'city' })}
                      label={'City*'}
                      style={[styles.inputTxt, { flex: 1 }]}
                      value={city}
                      error="Please enter city"
                      validationStyle={styles.validationStyle}
                      subAnimated={styles.borderStyle}

                    />


                    <MaterialTextField
                      {...text({ identifier: 'state' })}
                      label={'State*'}
                      style={[styles.inputTxt, { flex: 1 }]}
                      value={user.state}
                      error="Please enter state"
                      validationStyle={styles.validationStyle}
                      subAnimated={styles.borderStyle}

                    />
                  </View>


                  <MaterialTextField
                    {...number({ identifier: 'zipcode' })}
                    label={'Zipcode*'}
                    style={styles.inputTxt}
                    value={zipcode}
                    error="Please enter zipcode"
                    validationStyle={styles.validationStyle}
                    subAnimated={styles.borderStyle}

                  />
                  <TagInputContainer
                    selectedTags={(keywordsArray) => setState(s => ({ ...s, keywordsArray }))}
                    style={styles.keywordsInput}
                    oldTags={state.keywordsArray}
                  />
                  {/* {state.keywordsArray.length == 0 &&
                    <Text style={styles.keywordStyle}>Max 5 keywords can be added</Text>
                  } */}
                </View>
              </>
            )
          }}
        </Form>

        <AppButton
          isGradient
          onPress={onUpdateProfileApiRequest}
          title={'Save'} style={styles.btn} />


        <DateTimePickerHandler
          ref={dateTimePickerRef}
          cbOnPressDateTimePicker={res => setDate(res)}
          mode={'time'}
        />

        <Modal
          visible={state.showCatModal}
          onTouchOutside={toggleCatModal}
        >
          <ModalContent style={styles.modalContent}>
            <CategoryModal />
          </ModalContent>
        </Modal>
      </ScrollView>
    </Screen>
  );
};

export default ProviderEditProfile;

const styles = StyleSheet.create({
  conatainer: {
    paddingTop: Metrics.smallMargin,
    flex: 1,
    paddingHorizontal: Metrics.smallMargin + 6,
    backgroundColor: 'rgb(247,247,250)'
  },
  scrollCont: {
    paddingTop: Platform.OS == 'ios' ? 0 : Metrics.baseMargin,
  },
  aboutTextInput: { height: Metrics.heightRatio(80), marginTop: Metrics.heightRatio(10) },
  catStyle: { width: Metrics.screenWidth - 40, borderBottomColor: "black", paddingHorizontal: Metrics.heightRatio(6) },
  submitedMsgTxt: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    marginBottom: Metrics.smallMargin,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  btmLine: {
    borderBottomColor: 'black',
    width: Metrics.halfScreenWidth - Metrics.heightRatio(20),
    paddingHorizontal: Metrics.heightRatio(6)
  },
  row: {
    flexDirection: 'row',
    width: '100%',

  },
  validationStyle: {
    marginTop: 0, height: Metrics.heightRatio(20), color: 'red'
  },
  flex: {
    flex: 1
  },
  aboutText: { height: Metrics.heightRatio(100), marginTop: Metrics.heightRatio(10) },
  keywordsInput: { backgroundColor: 'transparent', borderBottomColor: 'black', borderBottomWidth: 1 },
  aboutStyles: {
    height: Metrics.heightRatio(104), paddingBottom: Metrics.heightRatio(10)
  },
  changeCoverBtnTxt: {
    flex: 0,
    color: Colors.primary.violet,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.smallMargin,
    backgroundColor: Colors.bg.white,
    marginBottom: Metrics.baseMargin,
  },
  detailStyle: {
    marginHorizontal: 15,
    ...AppStyles.gbSb(14, Colors.txt.dGrey),

  },
  keywordStyle: {
    ...AppStyles.gbRe(14, Colors.primary.violet),
    marginHorizontal: Metrics.heightRatio(10),
    marginTop: Metrics.heightRatio(10)
  },
  avater: {
    ...AppStyles.roundImage(45),
    marginRight: Metrics.baseMargin,
  },
  keyStyle: {
    paddingVertical: Metrics.heightRatio(10),
    borderBottomColor: '#aaa',
    borderBottomWidth: 1
  },
  inputTxt: {
    padding: 0,
    // height: Metrics.heightRatio(30),
    // borderBottomWidth: 1,
    color: 'black',
    // flex: 1,
  },
  Inputcontainer: {
    // flexDirection: 'row',
    flexWrap: 'wrap',
  },
  coverImage: {
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: Metrics.screenWidth / 2,
    alignSelf: 'center',
    borderRadius: 4,
    marginBottom: Metrics.smallMargin,
  },
  inputLabel: {
    paddingTop: Metrics.heightRatio(4),
    width: '100%',
  },
  txtLabel: {
    ...AppStyles.gbRe(14, Colors.primary.violet),
  },
  inputSmall: {
    width: '45%',
    marginRight: '4%',
  },
  borderStyle: {
    borderBottomColor: 'black',
  },
  changeCoverBtn: {
    position: "absolute", alignSelf: 'center', top: '35%', width: '40%',
    backgroundColor: Colors.bg.white,
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: Colors.SocialButton.purple,
    marginTop: Metrics.heightRatio(10),
    marginBottom: Metrics.heightRatio(50),
    // minHeight: Metrics.heightRatio(40),
  },
});
