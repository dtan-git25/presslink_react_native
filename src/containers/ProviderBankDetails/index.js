import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Image, Keyboard, Platform } from 'react-native';
import {
  AppButton,
  FormHandlerUpdated,
  ButtonView,
  InputTextField,
  ImageHandlerUpdated, Form, BlurHashPlaceholderImage, MaterialTextField
} from '@reuseableComponents';
import { Page } from '@components';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import { pop } from '@nav';
import { selectSingleImage } from '@multipicker';
import { INPUT_TYPES } from '../../reuseableComponents/FormHandlerUpdated/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../actions/ServiceAction';
import constant from '@constants';
import { DUMP } from '@actionTypes';
import { BANK_DETAILS } from '@actionTypes';

let formHandler = null;

const ProviderBankDetails = ({ params }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    mime: null,
    frontImg: bankDetails?.data[0]?.front_image?.image_src,
    backImg: bankDetails?.data[0]?.back_image?.image_src,
    frontImgIsSelected: false,
    backImg: '',
    backImgIsSelected: false
  })
  const isAccNoValid = useRef({ isValid: false });
  const isSSNoValid = useRef({ isValid: false });
  const isRoutingNoValid = useRef({ isValid: false });
  const dismissKeyboard = useCallback(() => Keyboard.dismiss())

  const onImagePicked = (photo) => () => {
    selectSingleImage()
      .then(({ path, mime, size }) => {
        console.log('path, mime, size', path, mime, size)
        if (photo == "frontImg") {
          setState(s => ({ ...s, mime, frontImg: path, frontImgIsSelected: true }))
        }
        else if (photo == "backImg") {
          setState(s => ({ ...s, backImg: path, mime, backImgIsSelected: true }))
        }
      })
  }

  const checkValidation = () => {
    var accNoValidate = /^\d{11}$/;
    var ssNoValidate = /^\d{9}$/;
    const payload = formHandler.onSubmitForm();
    if (accNoValidate.test(payload?.account_number) === false && payload != undefined) {
      formHandler.getRefByIdentifier("account_number").setError(true, "Account no must contains 11 digits");
      isAccNoValid.current = { isValid: false };
    }
    else {
      isAccNoValid.current = { isValid: true };
    }
    if (ssNoValidate.test(payload?.ss_number) === false && payload != undefined) {
      formHandler.getRefByIdentifier("ss_number").setError(true, "SSN no must contains 9 digits");
      isSSNoValid.current = { isValid: false };
    }
    else {
      isSSNoValid.current = { isValid: true };
    }
    if (ssNoValidate.test(payload?.routing_number) === false && payload != undefined) {
      formHandler.getRefByIdentifier("routing_number").setError(true, "Routing Number must contains 9 digits");
      isRoutingNoValid.current = { isValid: false };
    }
    else {
      isRoutingNoValid.current = { isValid: true };
    }
  }

  const submitBankDetails = () => {
    checkValidation()
    const payload = formHandler.onSubmitForm();
    if (payload && isAccNoValid.current.isValid && isSSNoValid.current.isValid && isRoutingNoValid.current.isValid) {
      let formData = new FormData()
      bankDetails?.data.length > 0 && formData.append('_method', 'PUT');
      Object.keys(payload).map(key => formData.append(key, payload[key]))
      if (state.frontImgIsSelected) {
        formData.append('front_image', {
          uri: state.frontImg,
          type: state.mime,
          name: 'image'
        });
      }
      if (state.backImgIsSelected) {
        formData.append('back_image', {
          uri: state.backImg,
          type: state.mime,
          name: 'image'
        });
      }
      const apiUrl = bankDetails?.data.length > 0
        ? constant.bankDetail + `/${bankDetails?.data[0].slug}`
        : constant.bankDetail;

      dispatch(
        request(
          apiUrl,
          constant.serviceTypes.POST,
          formData,
          DUMP,
          true,
          false,
          cbSuccess,
          cbFailure,
          DUMP
        )
      )
    }
  }

  function cbSuccess(response) { pop() }

  function cbFailure(err) { }


  const getBankDetails = () => {
    dispatch(
      request(
        constant.bankDetail,
        constant.serviceTypes.GET,
        {},
        BANK_DETAILS,
        false,
        false,
        cbGetBankDetailsSuccess,
        cbGetBankDetailsFailure,
        BANK_DETAILS
      )
    )
  }

  function cbGetBankDetailsSuccess(res) {
    if (res.length > 0) {
      setState(s => ({ ...s, backImg: res[0].back_image.image_src, frontImg: res[0].front_image.image_src, }))
    }
  }
  function cbGetBankDetailsFailure() { }


  useEffect(() => {
    getBankDetails()
  }, [])


  const bankDetails = useSelector(({ bankDetailsReducer }) => bankDetailsReducer)
  return (

    <Page
      bounces={false}
      style={{ padding: 0 }}>

      <Form ref={ref => (formHandler = ref)}>
        {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
          const { number } = Form.INPUTS(refCollector, onSubmitEditing);
          return (
            <>
              <MaterialTextField
                {...number({ identifier: "account_number" })}
                error={"Account number is required"}
                placeholder={"Enter your text here"}
                type={INPUT_TYPES.NUMBER}
                value={bankDetails?.data.length > 0 ? bankDetails?.data[0].account_number : ''}
                maxLength={11}
                isAnimate={false}
                LabelTxt={"Account Number*"}
                labelTxtStyle={styles.inputLabel}
                style={styles.inputTxt}
                subAnimated={styles.transparentBg}
                validationStyle={styles.mt10}

              />
              <MaterialTextField
                {...number({ identifier: "ss_number" })}
                value={bankDetails?.data.length > 0 ? bankDetails?.data[0].ss_number : ''}
                type={INPUT_TYPES.NUMBER}
                error={"SSN number is required"}
                maxLength={9}
                placeholder={'Enter your text here'}
                isAnimate={false}
                LabelTxt={"SSN Number*"}
                labelTxtStyle={styles.inputLabel}
                style={styles.inputTxt}
                subAnimated={styles.transparentBg}
                validationStyle={styles.mt10}
              />

              <MaterialTextField
                {...number({ identifier: "routing_number" })}
                value={bankDetails?.data.length > 0 ? bankDetails?.data[0].routing_number : ''}
                type={INPUT_TYPES.NUMBER}
                error={"Routing number is required"}
                maxLength={9}
                placeholder={'Enter your text here'}
                isAnimate={false}
                LabelTxt={"Routing Number*"}
                labelTxtStyle={styles.inputLabel}
                style={styles.inputTxt}
                subAnimated={styles.transparentBg}
                onSubmitEditing={dismissKeyboard}
                validationStyle={styles.mt10}
              />
            </>
          );
        }}
      </Form>
      <View style={styles.imgPickerContainer}>
        <Text style={styles.imgPickerTitle}>Upload Driving License</Text>
        <Text style={styles.imgPickerSubTitle}>
          Attach your driving licence card image (Front - Back)
        </Text>

        <View style={styles.imgPickerContent}>
          {/* <View> */}
          <ButtonView onPress={onImagePicked("frontImg")} style={styles.imgSelector}>
            {bankDetails?.data.length > 0 && !state.frontImgIsSelected ?

              <BlurHashPlaceholderImage
                uri={bankDetails?.data[0].front_image.image_src}
                width={Metrics.screenWidth / 2.47}
                height={Metrics.screenWidth / 3.9}
                blurhash={bankDetails?.data[0].front_image.image_info.blur_hash}
              />
              :

              <Image
                style={state.frontImg && styles.coverImage}
                source={state.frontImg ? { uri: state.frontImg } : Images.icPlus}
              />

            }

          </ButtonView>

          <ButtonView
            onPress={onImagePicked("backImg")} style={[styles.imgSelector, { backgroundColor: Colors.txt.lBlue }]}>
            {bankDetails?.data.length > 0 && !state.backImgIsSelected ?
              <BlurHashPlaceholderImage
                uri={bankDetails?.data[0].back_image.image_src}
                width={Metrics.screenWidth / 2.47}
                height={Metrics.screenWidth / 3.9}
                blurhash={bankDetails?.data[0].back_image.image_info.blur_hash}
              />
              :
              <Image
                style={state.backImg && styles.coverImage}
                source={state.backImg ? { uri: state.backImg } : Images.icPlus}
              />
            }

          </ButtonView>
        </View>
      </View>

      <AppButton onPress={submitBankDetails} title={bankDetails?.data.length > 0 ? 'Update Details' : 'Submit'} style={styles.btn} />

    </Page >
  )
}
export default ProviderBankDetails;

const styles = StyleSheet.create({
  inputTxt: {
    backgroundColor: Colors.bg.white,
    height: Metrics.heightRatio(80),
    borderBottomWidth: 0,
    paddingBottom: 20,
  },
  validationStyle: {
    marginTop: Metrics.heightRatio(5), height: Metrics.heightRatio(20), color: '#B00020',
  },
  transparentBg: {
    borderColor: 'transparent'
  },
  inputLabel: {
    backgroundColor: Colors.bg.white,
    marginBottom: Platform.OS == 'android' ? Metrics.heightRatio(-5) : Metrics.heightRatio(8),
    paddingTop: Metrics.heightRatio(15),
    marginHorizontal: Platform.OS == 'android' ? Metrics.heightRatio(15) : Metrics.heightRatio(12),
    ...AppStyles.gbRe(14),
    color: 'black'
  },
  imgSelector: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.widthRatio(64),
    borderWidth: 1,
    width: Metrics.screenWidth / 2.5,
    height: Metrics.screenWidth / 4,
    borderRadius: 5,
    borderColor: Colors.txt.lGrey,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  coverImage: {
    width: Metrics.screenWidth / 2.5,
    height: Metrics.screenWidth / 4,
    borderRadius: 4,
  },
  imgPickerContainer: {
    backgroundColor: 'white',
    marginTop: Metrics.heightRatio(12),
    paddingVertical: Metrics.smallMargin,
    paddingHorizontal: Metrics.baseMargin,
  },
  imgPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Metrics.baseMargin - 4,
  },
  imgPickerTitle: {
    ...AppStyles.gbSb(16),
    marginBottom: Metrics.heightRatio(10),
    marginTop: Metrics.heightRatio(10),
  },
  imgPickerSubTitle: {
    ...AppStyles.gbRe(15, Colors.txt.slate),
  },
  mt10: {
    marginTop: Platform.OS == 'android' ? Metrics.heightRatio(10) : Metrics.heightRatio(-4),
    marginBottom: Platform.OS == 'ios' ? Metrics.heightRatio(20) : 0
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    width: '94%',
    alignSelf: 'center',
    marginTop: Metrics.doubleBaseMargin,
    minHeight: Metrics.heightRatio(38),
  },

});
