import React, { useCallback, useEffect, useState } from 'react';
import { ButtonView, ConfirmationModal, ImageHandlerUpdated } from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import { Text, ScrollView, View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStyles, Images } from '@theme';
import { Switch } from 'react-native-paper';
import { pop, push } from '@nav';
import { DUMP } from '@actionTypes';
import constant from '@constants';
import { useDispatch, useSelector } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import { SERVICE_DETAIL, SERVICE } from '@actionTypes';
import { ADD_DELETE_SERVICE } from '@actionTypes';
import LinearGradient from 'react-native-linear-gradient';
import { UPDATE_SERVICE } from '@actionTypes';

const MenuDetail = ({ navigation, route }) => {
  const { title, description, keywords, slug, price, image_url, status, id, order_count, } = route.params.serviceDetails
  const dispatch = useDispatch()
  const [state, setState] = useState({
    showModal: false,
    isSwitchOn: status == 0 ? false : true,
    title: title,
    description: description,
    keywords: keywords,
    price: price,
    slug: slug,
    image_url: route.params.serviceDetails?.image?.image_src
  })

  console.log('route.params.serviceDetails', route.params.serviceDetails)
  const cbOnEdit = (data) => {
    console.log('cbOnEdit', data)
    setState(s => ({
      ...s,
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      price: data.price,
      image_url: data.image.image_src,
    }))
  }

  navigation.setOptions({

    headerRight: () => (
      // order_count == 0 &&
      <View style={styles.row}>
        <ButtonView style={styles.paddingR}
          onPress={toggleModal}
        >
          <Image source={Images.icTrash} style={styles.imgTintColor} />
        </ButtonView>
        <ButtonView
          style={styles.paddingR}
          onPress={() => push('ProviderCreateService', { edit: true, cbOnEdit, serviceDetails: state, orderCountIsZero: order_count == 0 ? true : false })}>
          <Image source={Images.icEditWhite} style={styles.imgTintColor} />
        </ButtonView>
      </View>
    ),
    headerTransparent: false,
    title: state.title,
    headerTitleAlign: 'center',
    headerTitleStyle: styles.titleStyle,
  });


  const deleteItem = () => {
    toggleModal()
    dispatch(
      request(
        constant.service + `/${slug}`,
        constant.serviceTypes.DELETE,
        {},
        DUMP,
        true,
        false,
        cbDeleteSuccess,
        cbDeleteFailure,
        DUMP
      )
    )
  }

  const cbDeleteSuccess = (item) => {
    dispatch(
      generalSaveAction(ADD_DELETE_SERVICE,
        { id, isDeleted: true }
      )
    )
    pop()
  }

  function cbDeleteFailure() { }

  const activeDeactiveMeal = () => {
    let formData = new FormData();
    let status = state.isSwitchOn == false ? 1 : 0
    formData.append('_method', 'PUT');
    formData.append('status', status)
    state.keywords.forEach((x) => {
      let replaceHash = x.replace('#', '')
      formData.append("keywords[]", replaceHash)
    })
    // formData.append('keywords[]', keywords)
    dispatch(
      request(
        constant.service + `/${slug}`,
        constant.serviceTypes.POST,
        formData,
        DUMP,
        true,
        false,
        cbactiveDeactiveMealSuccess,
        cbactiveDeactiveMealFailure,
        DUMP
      )
    )
  }

  const cbactiveDeactiveMealSuccess = (res) => {
    onToggleSwitch()
    dispatch(generalSaveAction(UPDATE_SERVICE, res));
  }

  function cbactiveDeactiveMealFailure() { }



  useEffect(() => {
  }, [])


  const Header = () => {
    return (
      <View style={{ flex: 1 }}>
        <ImageHandlerUpdated
          style={styles.coverImage}
          source={{
            uri: state.image_url,
          }}
        />
        <View style={{ backgroundColor: 'black', width: '100%', height: '100%', opacity: 0.3, position: 'absolute' }} />
      </View>
    );
  };
  const toggleModal = useCallback(() => setState(s => ({ ...s, showModal: !s.showModal })), [])
  const onToggleSwitch = () => setState(s => ({ ...s, isSwitchOn: !s.isSwitchOn }))

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView bounces={false}>
        <Header />
        <View style={styles.topbar}>
          <Text style={styles.txtTitle}>
            {state.title}
          </Text>
          <Text style={AppStyles.gbSb(15, Colors.primary.violet)}>${state.price}</Text>
        </View>
        <Text style={styles.pragraph}>
          {state.description}
        </Text>
        <Text style={styles.tags}>
          {state.keywords?.length > 0 &&
            `#${state.keywords.toString().replace(/,/g, ' #')}`
          }
        </Text>
        <View style={styles.bottom}>
          <View>
            <Text style={styles.mark}>Active/Deactive</Text>
            <Text style={AppStyles.gbRe(12, Colors.txt.lGrey)}>
              Mark this meal active or deactive
            </Text>
          </View>
          <Switch
            value={state.isSwitchOn}
            onValueChange={activeDeactiveMeal}
            color={Colors.primary.violet}
          />
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={state.showModal}
        onTouchOutside={toggleModal}
        title="Delete Service"
        description="Are you sure you want to delete this service?"
        onPressOk={deleteItem}
        onPressCancel={toggleModal}

      />
    </SafeAreaView>
  );
};

export default MenuDetail;
const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row' },
  paddingR: { paddingRight: Metrics.baseMargin },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
  },
  txtTitle: {
    ...AppStyles.gbSb(15, Colors.txt.slate),
    textTransform: 'capitalize',

  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Metrics.baseMargin,
    backgroundColor: Colors.txt.white,
  },
  imgTintColor: {
    tintColor: Colors.txt.slate
  },
  pragraph: {
    lineHeight: 17,
    paddingTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
  },
  mark: {
    ...AppStyles.gbSb(15, Colors.txt.slate),
    marginBottom: Metrics.smallMargin,
  },
  coverImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.3,
  },
  tags: {
    ...AppStyles.gbRe(12, Colors.primary.violet),
    margin: Metrics.baseMargin,
  },
  linearGradient: {
    // flex: 1,
    width: '100%',
    position: 'absolute',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400',
    textTransform: 'capitalize',

  },
});
