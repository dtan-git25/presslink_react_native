import {USER} from '@actionTypes';
import constant from '@constants';
import {selectSingleImage} from '@multipicker';
import {pop} from '@nav';
import {
  AppButton,
  ButtonView,
  ImageHandlerUpdated,
  MaterialTextField,
  Form,
  Screen,
} from '@reuseableComponents';
import {AppStyles, Colors, Images, Metrics} from '@theme';
import React, {useCallback} from 'react';
import {View, Image, StyleSheet, Keyboard} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {request} from '../../actions/ServiceAction';

let formHandler = null;
const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(({userReducer}) => userReducer.data);
  const {name, mobile_no, address, image_url, slug} = user;

  const [state, setState] = React.useState({
    img: image_url,
    mime: null,
    isSelected: false,
  });

  const dismissKeyboard = useCallback(() => Keyboard.dismiss());

  const onPickImg = () =>
    selectSingleImage()
      .then(({path, mime}) =>
        setState(s => ({...s, img: path, mime, isSelected: true})),
      )
      .catch(err => console.log('error picking img : ', err));

  const editProfile = () => {
    const payload = formHandler.onSubmitForm();
    let isValid = formHandler.checkValidation();
    if (isValid) {
      let formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('mobile_no', mobile_no);
      formData.append('address', payload.address);
      formData.append('user_role', '1');
      if (state.isSelected) {
        formData.append('image_url', {
          uri: state.img,
          type: state.mime,
          name: 'image',
        });
      }

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
          USER,
        ),
      );
    }
  };

  function cbSuccess(response, meta, msg) {
    pop();
  }
  function cbFailure(error) {}

  const Profile = () => (
    <View style={styles.containerProfile}>
      <ButtonView onPress={onPickImg}>
        <ImageHandlerUpdated
          source={state.img ? {uri: state.img} : Images.icProfile}
          style={styles.imgProfile}
        />
        <Image source={Images.icAdd} style={styles.imgAdd} />
      </ButtonView>
    </View>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Profile />
        <View style={styles.containerFields}>
          <Form ref={ref => (formHandler = ref)}>
            {(refCollector, onSubmitEditing) => {
              const {text, email, optional} = Form.INPUTS(
                refCollector,
                onSubmitEditing,
              );
              return (
                <>
                  <MaterialTextField
                    {...text({identifier: 'name'})}
                    label="Full Name"
                    value={name}
                    onSubmitEditing={dismissKeyboard}
                    error="Full name is required"
                  />
                  <MaterialTextField
                    editable={false}
                    countryField
                    label="Phone Number"
                    disabled={true}
                    initialValue={mobile_no}
                    labelStyle={{color: 'gray'}}
                    inactiveColor={Colors.primary.violet}
                    activeTextColor={'gray'}
                    subAnimated={{borderBottomColor: 'gray', marginTop: 10}}
                  />
                  <MaterialTextField
                    editable={false}
                    {...email()}
                    label="Email Address"
                    value={user.email}
                    textInputStyle={{borderBottomColor: 'gray'}}
                    activeTextColor={'gray'}
                    labelStyle={{color: 'gray'}}
                    subAnimated={{borderBottomColor: 'gray', marginTop: 10}}
                  />
                  <MaterialTextField
                    {...optional({identifier: 'address'})}
                    label="Address"
                    value={address == null ? '' : address}
                    error="Address is required"
                    subAnimated={{marginTop: 10}}
                    onSubmitEditing={dismissKeyboard}
                  />
                  <AppButton
                    isGradient
                    title="Save"
                    style={styles.appBtn}
                    onPress={editProfile}
                  />
                </>
              );
            }}
          </Form>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.bg,
    flex: 1,
    padding: 0,
  },
  containerFields: {flex: 1, paddingHorizontal: Metrics.baseMargin},
  imgProfile: {
    ...AppStyles.roundImage(110, 'contain'),
  },
  appBtn: {
    marginTop: Metrics.doubleBaseMargin * 2.5,
  },
  containerProfile: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 2,
    ...AppStyles.centerAligned,
  },
  imgAdd: {
    position: 'absolute',
    right: -Metrics.widthRatio(18),
    top: Metrics.widthRatio(25),
  },
});
