import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EventBusSingleton } from 'light-event-bus';

import { ButtonView, Modal } from '@reuseableComponents';

import { AppStyles, Colors, Metrics } from '@theme';

const Popup = () => {
  const vals = {
    logout: {
      title: 'Logout?',
      desc: 'Are you sure you want to logout',
      accept: 'Yes, Logout',
      acceptColor: Colors.primary.clearblue,
    },
    deleteService: {
      title: 'Delete Service',
      desc: 'Are you sure you want to delete this service?',
      accept: 'Confirm',
      acceptColor: Colors.primary.vermillion,
    },
  };

  const modal = useRef();
  const [state, setState] = React.useState({
    ...vals['logout'],
    cbOnAccept: null,
  });

  useEffect(() => {
    EventBusSingleton.subscribe('popup', ({ val, onAccept, is401 }) => {
      if (is401) logout();
      else {
        setState(s => ({ ...vals[val], cbOnAccept: onAccept }));
        setTimeout(() => modal?.current?.setModalVisibility(true), 300);
      }
    });
  }, []);

  const hide = useCallback(() => modal.current.setModalVisibility(false));
  const onConfirm = useCallback(() => {
    modal?.current?.setModalVisibility(false);
    setState(s => {
      s.cbOnAccept && s.cbOnAccept();
      return { ...s };
    });
  }, []);

  return (
    <Modal ref={modal}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.submitedMsg}>
            <Text style={styles.submitedMsgTxt}>{state.title}</Text>
            <Text style={styles.CheckoutTitle}>{state.desc}</Text>
          </View>
          <View style={styles.CheckoutBottom}>
            <ButtonView onPress={hide} style={styles.CheckoutBtnC}>
              <Text style={AppStyles.gbRe(16, Colors.SocialButton.red)}>
                Cancel
              </Text>
            </ButtonView>
            <ButtonView onPress={onConfirm} style={[styles.CheckoutBtnConfirm]}>
              <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
                {state.accept}
              </Text>
            </ButtonView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  container: {
    ...AppStyles.centerAligned,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,


  },
  submitedMsg: {
    marginBottom: Metrics.heightRatio(52),
    alignItems: 'center',
  },
  modalContent: {
    width: Metrics.screenWidth - Metrics.widthRatio(52),
    backgroundColor: 'white',
    borderRadius: Metrics.heightRatio(10)

  },

  Msg: {
    // marginBottom: Metrics.heightRatio(52),
    // alignItems: 'center',
  },
  submitedMsgTxt: {
    marginTop: Metrics.baseMargin,
    ...AppStyles.gbSb(18),
    marginBottom: Metrics.smallMargin,
    color: 'black',
  },
  CheckoutTitle: {
    ...AppStyles.gbRe(16),
    paddingHorizontal: Metrics.baseMargin,
    textAlign: 'center',
    lineHeight: 20,
    color: 'black',
    marginBottom: Metrics.baseMargin,
  },
  CheckoutBtnTxt: {
    flex: 0,
    color: Colors.primary.violet,
  },
  CheckoutBtnC: {
    padding: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomLeftRadius: Metrics.heightRatio(10),
    borderColor: Colors.bg.lGrey,
  },
  CheckoutBtnConfirm: {
    padding: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomRightRadius: Metrics.heightRatio(10),
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
