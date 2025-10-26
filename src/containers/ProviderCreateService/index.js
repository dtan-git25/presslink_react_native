import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import {
  AppButton,
  FormHandlerUpdated,
  ButtonView,
  InputTextField,
  ImageHandlerUpdated,
  ImageButton,
  Form,
  TagInputContainer,
  FlashMessage,
  MaterialTextField,
} from '@reuseableComponents';
import { Page } from '@components';
import { AppStyles, Colors, Metrics, Images } from '@theme';
import utility from '@utils';
import { pop, push } from '@nav';
import { selectSingleImage } from '@multipicker';
import constant from '@constants';
import { useDispatch, useSelector } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import { DUMP, SERVICE, SERVICE_DETAIL, UPDATE_SERVICE } from '@actionTypes';
import { ADD_DELETE_SERVICE } from '@actionTypes';
import { INPUT_TYPES } from '../../reuseableComponents/FormHandlerUpdated/Constants';
// import {  } from '@actionTypes';
let formHandler = null;

const ProviderCreateService = ({ navigation, route }) => {
  // const { title, description, price, image_url, keywords, slug } = route.params.serviceDetails
  const edit = !utility._isUndefined(route?.params?.edit);
  const { orderCountIsZero } = route?.params
  console.log('route.params.serviceDetails', route?.params?.orderCountIsZero)
  console.log('edit', edit)
  const dispatch = useDispatch();
  let data = {};
  if (edit) {
    data = {
      title: route.params.serviceDetails.title,
      desc: route.params.serviceDetails.description,
      price: `${route.params.serviceDetails.price}`,
      tag:
        route.params.serviceDetails.keywords.length > 0 &&
        '#' +
        route.params.serviceDetails.keywords.toString().replace(/,/g, ' #'),
      imgUrl: route.params.serviceDetails?.image_url,
    };
  } else {
    data = {
      title: '',
      desc: '',
      price: '',
      tag: '',
      imgUrl: '',
    };
  }
  const [state, setState] = React.useState({
    img: data?.imgUrl,
    mime: null,
    imgIsSelected: false,
    keywordsArray: edit ? route.params.serviceDetails.keywords : []
  });

  navigation.setOptions({
    headerRight: () => (
      <ButtonView onPress={createService}>
        <Text style={styles.submitBtn}>{edit ? 'Save' : 'Submit'}</Text>
      </ButtonView>
    ),
    title: edit ? 'Edit Service' : 'Create Service',
    headerTitleAlign: 'center',
  });

  const handleImageSelect = () => {
    selectSingleImage()
      .then(({ path, mime, size }) => {
        console.log('size', size)
        setState(s => ({ ...s, mime, img: path, imgIsSelected: true }));
      })
      .catch(err => console.log('error picking img : ', err));
  };

  const emptyImg = useCallback(() => {
    setState(s => ({ ...s, img: '' }));
  }, []);

  const createService = () => {
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();
    if (payload?.price <= 0) { FlashMessage({ message: 'Price must be greater than 0' }); return }
    if (isValid) {
      let formData = new FormData();
      if (state.img == '') {
        FlashMessage({ message: 'Please add image' });
        return;
      }
      if (edit) {
        formData.append('_method', 'PUT');
      }
      Object.keys(payload).map(key => {
        formData.append(key, payload[key])
      })
      state.keywordsArray.forEach((x) => {
        let replaceHash = x.replace('#', '')
        formData.append("keywords[]", replaceHash)
      })
      if (state.imgIsSelected) {
        formData.append('image_url', {
          uri: state.img,
          type: state.mime,
          name: 'image',
        });
      }
      const apiUrl = !edit
        ? constant.service
        : constant.service + `/${route.params.serviceDetails.slug}`;
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
        )
      )
    }
  };

  function cbSuccess(res) {
    if (edit) {
      dispatch(generalSaveAction(UPDATE_SERVICE, res));
    }
    else {
      dispatch(generalSaveAction(ADD_DELETE_SERVICE, {
        ...res, isAdded: true
      }));

    }
    if (edit) { route.params.cbOnEdit(res) }
    pop()
  }
  function cbFailure() { }

  return (
    <Page bounces={false} style={{ padding: 0 }}>
      <Form ref={ref => (formHandler = ref)}>
        {(refCollector, onSubmitEditing, focusByRefCollectorKey) => {
          const { text, number, optional } = Form.INPUTS(
            refCollector,
            onSubmitEditing,
          );
          return (
            <>

              <MaterialTextField
                {...text({ identifier: 'title' })}
                error="Title is required"
                placeholder={'Title of the service* '}
                placeholderTextColor={Colors.txt.lGrey}
                value={data?.title}
                isAnimate={false}
                activeTextColor={!edit || orderCountIsZero ? "black" : "gray"}
                editable={!edit || orderCountIsZero ? true : false}
                style={styles.inputTxt}
                subAnimated={styles.transparentBg}
              />
              <MaterialTextField
                {...text({ identifier: 'description' })}
                error="Description is required"
                placeholder={'Description*'}
                placeholderTextColor={Colors.txt.lGrey}
                value={data?.desc}
                isAnimate={false}
                activeTextColor={!edit || orderCountIsZero ? "black" : "gray"}

                editable={!edit || orderCountIsZero ? true : false}
                multiline={true}
                style={[styles.inputTxt, styles.desc, styles.ptBase]}
                subAnimated={styles.transparentBg}
                validationStyle={styles.mt10}
              />

              <MaterialTextField
                {...number({ identifier: 'price' })}
                error="Price is required"
                placeholder={'Price*'}
                placeholderTextColor={Colors.txt.lGrey}
                type={INPUT_TYPES.NUMBER}
                value={data?.price}
                isAnimate={false}
                style={styles.inputTxt}
                subAnimated={styles.transparentBg}
              />

              <TagInputContainer
                selectedTags={(keywordsArray) => setState(s => ({ ...s, keywordsArray }))}
                oldTags={state.keywordsArray}
                style={{ marginTop: -10 }}
                editable={!edit || orderCountIsZero ? true : false}

              />
            </>
          );
        }}
      </Form>
      <View style={styles.imgPickerContainer}>
        {!state.img ? (
          <ButtonView style={styles.rowAlign} onPress={handleImageSelect}>
            <Image source={Images.icImagePicker} />
            <Text style={styles.imgPickerSubTitle}>Add Photo</Text>
          </ButtonView>
        ) : (
          <View>
            <Image source={{ uri: state.img }} style={styles.previewImg} />
            {(!edit || orderCountIsZero) &&
              <ImageButton
                source={Images.icCross}
                onPress={emptyImg}
                style={styles.crossBtn}
              />
            }

          </View>
        )}
      </View>
    </Page>
  );
};

export default ProviderCreateService;

const styles = StyleSheet.create({
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  inputTxt: {
    backgroundColor: Colors.bg.white,
    borderBottomWidth: 0,
    marginTop: 5,
    paddingBottom: 20,
  },
  transparentBg: {
    borderColor: 'transparent'
  },
  mt10: {
    marginTop: Platform.OS == 'android' ? Metrics.heightRatio(50) : Metrics.heightRatio(38),
  },
  desc: { height: Metrics.heightRatio(95) },
  inputLabel: {
    backgroundColor: Colors.bg.white,
    paddingLeft: Metrics.baseMargin,
    marginTop: Metrics.heightRatio(3),
  },

  imgPickerContainer: {
    backgroundColor: Colors.bg.white,
    marginTop: Metrics.heightRatio(6),
    paddingVertical: Metrics.smallMargin,
    paddingHorizontal: Metrics.baseMargin,
  },
  ptBase: {
    paddingTop: Metrics.baseMargin,
  },

  imgPickerSubTitle: {
    ...AppStyles.gbRe(14, Colors.txt.slate),
    marginLeft: Metrics.smallMargin,
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    width: '94%',
    alignSelf: 'center',
    marginTop: Metrics.doubleBaseMargin,
    minHeight: 48,
  },
  submitBtn: {
    ...AppStyles.gbRe(16, Colors.txt.azure),
    marginRight: Metrics.baseMargin,
  },
  previewImg: {
    height: Metrics.heightRatio(160),
    width: Metrics.screenWidth - Metrics.xDoubleBaseMargin,

    alignSelf: 'center',
    // resizeMode: 'cover'
  },
  blueTxt: { color: Colors.txt.VBlue },
  crossBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  keywordStyle: {
    ...AppStyles.gbRe(14, Colors.primary.violet),
    marginHorizontal: Metrics.heightRatio(10),
    marginTop: Metrics.heightRatio(10),
    marginBottom: Metrics.heightRatio(10)
  },
});
