import React, {useEffect, useState} from 'react';
import {AppStyles, Images, Metrics} from '@theme';
import {View, StyleSheet, Image} from 'react-native';
import {
  ButtonView,
  ConfirmationModal,
  FlatListHandler,
} from '@reuseableComponents';
import {PaymentCard} from '@components';
import {navigate} from '@nav';
import {useDispatch, useSelector} from 'react-redux';
import {generalSaveAction, request} from '../../actions/ServiceAction';
import constant from '@constants';
import {USER_CARDS} from '@actionTypes';
import {DUMP} from '@actionTypes';

const PaymentMethod = ({navigation}) => {
  const [selectedItem, setselectedItem] = useState({});
  const [showModal, setModal] = useState(false);
  const dispatch = useDispatch();

  const toggleModal = () => setModal(!showModal);

  navigation.setOptions({
    headerRight: () => (
      <ButtonView
        onPress={() => navigate('AddPaymentMethod')}
        style={styles.addIcon}>
        <Image source={Images.icAddCard} />
      </ButtonView>
    ),
  });

  const getUserCards = (isConcat = false, page = 1) => {
    let params = {page, limit: 10};

    dispatch(
      request(
        constant.userCard,
        constant.serviceTypes.GET,
        params,
        USER_CARDS,
        false,
        isConcat,
        cbUserCardsSuccess,
        cbUserCardsFailure,
        USER_CARDS,
      ),
    );
  };

  function cbUserCardsSuccess(res) {}

  function cbUserCardsFailure() {}

  const makeCardDefault = id => () => {
    let formData = new FormData();
    formData.append('card_id', id);
    dispatch(
      request(
        constant.makeCardDefault,
        constant.serviceTypes.POST,
        formData,
        DUMP,
        true,
        false,
        cbSuccess,
        cbFailure,
      ),
    );
  };

  function cbSuccess(res) {
    getUserCards();
  }

  function cbFailure() {}

  const deleteCard = () => () => {
    dispatch(
      request(
        constant.userCard + `/${selectedItem.slug}`,
        constant.serviceTypes.DELETE,
        {},
        DUMP,
        true,
        false,
        () => cbDeleteSuccess(selectedItem),
        cbDeleteFailure,
        DUMP,
      ),
    );
  };

  function cbDeleteSuccess(item) {
    dispatch(
      generalSaveAction(USER_CARDS.DELETE, {...item, isDeleteObj: true}),
    );
    toggleModal();
  }

  function cbDeleteFailure() {
    toggleModal();
  }

  useEffect(() => {
    getUserCards();
  }, []);

  const deleteModal = item => () => {
    console.log('item', item);
    setselectedItem(item);
    toggleModal();
  };

  const cards = useSelector(({userCardReducer}) => userCardReducer);
  const {data, isFetching} = cards;

  const _renderItem = ({item}) => {
    return (
      <PaymentCard
        isActive={item.status}
        onCardPress={makeCardDefault(item.id)}
        data={item}
        onDeletePress={deleteModal(item)}
      />
    );
  };

  return (
    <View style={styles.flex}>
      <FlatListHandler
        data={data}
        renderItem={_renderItem}
        fetchRequest={getUserCards}
        isFetching={isFetching}
      />
      <ConfirmationModal
        visible={showModal}
        onTouchOutside={toggleModal}
        title="Delete Card"
        description="Are you sure you want to delete this Card?"
        onPressOk={deleteCard()}
        onPressCancel={toggleModal}
      />
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  row: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  addIcon: {
    marginTop: Metrics.baseMargin,
    ...AppStyles.centerAligned,
  },
  flex: {flex: 1},
});
