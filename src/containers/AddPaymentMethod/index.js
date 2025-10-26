import { pop } from '@nav';
import { AppButton, ButtonView, FlashMessage } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import React, { useEffect, useState } from 'react';
import { Checkbox } from '@components';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
import utility from '@utils';
import {
  CardField,
  CardFieldInput,
  useStripe,
} from '@stripe/stripe-react-native';
import constant from '@constants';
import { DUMP } from '@actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { generalSaveAction, request } from '../../actions/ServiceAction';
import { USER_CARDS } from '@actionTypes';
import { push } from '@nav';


const AddPaymentMethod = ({ props, navigation, route }) => {
  const selectPaymentMode = !utility._isUndefined(route?.params?.selectPaymentMode);
  const user = useSelector(({ userReducer }) => userReducer.data)
  const { name } = user
  const [isCheckbox, setCheckbox] = useState(true);
  const [btndisable, setbtndisable] = useState(false);
  const { createToken } = useStripe();

  const dispatch = useDispatch()
  const _createToken = async (type: 'Card' | 'BankAccount') => {
    setbtndisable(true)
    const { error, token } = await createToken(
      { type: 'Card', name: name, currency: 'eur' }
    )
    if (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      FlashMessage({
        message: error.message,
      })
      setbtndisable(false)
    } else if (token) {
      sendToken(token.id)
    }
  };


  const sendToken = (token) => {
    let formData = new FormData();
    formData.append('card_token', token);
    dispatch(
      request(
        constant.userCard,
        constant.serviceTypes.POST,
        formData,
        DUMP,
        true,
        false,
        cbSuccess,
        cbFailure,
        DUMP,
      ),
    )
  }

  function cbSuccess(res) {
    dispatch(generalSaveAction(USER_CARDS.ADD, { isAddAtZero: true, ...res }))
    pop()
    setbtndisable(false)
  }

  function cbFailure() {
    setbtndisable(false)
  }


  useEffect(() => {
    if (selectPaymentMode) {
      navigation.setOptions({
        headerRight: () => (
          <ButtonView onPress={onSave}>
            <Text style={styles.submitBtn}>{'Save'}</Text>
          </ButtonView>
        ),
      });

    }

  }, [])


  const onSave = () => {
    _createToken('Card')
  };

  return (
    <View
      style={styles.mainView}>
      {selectPaymentMode &&
        <View>
          <Text style={AppStyles.gbSb(12, Colors.txt.dGrey)}>
            Select Mode of Payment
          </Text>
          <ButtonView onPress={() => push("PaymentMethod")} style={styles.pickerBtn}>
            <Image
              style={[styles.iconContainer, { width: Metrics.widthRatio(45) }]}
              source={Images.MasterCard}
            />
            <Text style={styles.pickerTxt}>
              Credit Card
            </Text>
            <Image
              style={[styles.iconContainer, { tintColor: Colors.txt.dGrey }]}
              source={Images.icArrowDropUp}
            />
          </ButtonView>

        </View>

      }

      <Text style={AppStyles.gbSb(12, Colors.txt.dGrey)}>
        Enter your payment details
      </Text>

      <CardField
        cardStyle={styles.inputStyles}
        style={styles.cardField}
        postalCodeEnabled={false}
      />

      {!selectPaymentMode &&
        <AppButton title="Save" onPress={onSave} disabled={btndisable} isGradient />
      }
      {selectPaymentMode &&
        <View
          style={styles.checkedView}>
          <Checkbox value={isCheckbox} onPress={() => setCheckbox(!isCheckbox)} />
          <Text
            style={styles.remeberTxt}>
            Remember this card
          </Text>
        </View>
      }
    </View>
  );
};

export default AddPaymentMethod;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.bg.bg,
    padding: Metrics.baseMargin,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },

  row: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  iconContainer: { resizeMode: 'contain', justifyContent: 'flex-end' },
  pickerBtn: {
    flexDirection: 'row',
    marginBottom: Metrics.heightRatio(20),
    marginTop: Metrics.heightRatio(15),
    height: Metrics.heightRatio(39),
    width: '100%',
    alignItems: 'center',

    ...AppStyles.lightShadow,
    borderRadius: Metrics.smallMargin / 2,
    backgroundColor: 'white',
    paddingHorizontal: Metrics.heightRatio(15),
    justifyContent: 'space-between'
  },
  checkedView: {
    flexDirection: 'row',
    flex: 1,
    marginTop: Metrics.smallMargin,
  },
  submitBtn: {
    ...AppStyles.gbRe(16, Colors.primary.violet),
    marginRight: Metrics.baseMargin,
  },
  input: {
    ...AppStyles.gbSb(12, Colors.txt.vdGrey),
    padding: Metrics.baseMargin,
    backgroundColor: Colors.bg.white,
    borderWidth: 1,
    borderColor: Colors.border.murkey,
    marginTop: Metrics.baseMargin,
    borderRadius: Metrics.widthRatio(6),
  },
  inputStyles: CardFieldInput.Styles = {
    padding: Metrics.baseMargin,
    backgroundColor: Platform.OS == 'ios' ? Colors.bg.white : 'white',
    borderWidth: 1,
    marginTop: Metrics.baseMargin,
    borderRadius: Metrics.widthRatio(6),
  },

  remeberTxt: {
    flex: 1,
    marginVertical: Metrics.smallMargin - 2,
    ...AppStyles.gbRe(12, Colors.primary.violet),
    lineHeight: 16,
  },
  errTxt: {
    marginVertical: Metrics.smallMargin - 2,
    ...AppStyles.gbRe(12, 'red'),
  },
  pickerTxt: {
    ...AppStyles.gbSb(14, Colors.txt.vdGrey),
    marginRight: Metrics.baseMargin,
    flex: 1,
    paddingHorizontal: Metrics.heightRatio(10)
  },
  row: { flexDirection: 'row', marginBottom: Metrics.baseMargin },
});
