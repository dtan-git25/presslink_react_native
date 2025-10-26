import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import _ from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';

export default BottomSheetHandler = props => {
  useEffect(() => {
    props.isOpen === true
      ? BottomSheetRef.current.open()
      : BottomSheetRef.current.close();
  });
  const BottomSheetRef = useRef(null);

  return (
    <View style={styles.container}>
      <RBSheet
        animationType={'slide'}
        // closeOnPressMask={props.isOpen}
        ref={BottomSheetRef}
        keyboardAvoidingViewEnabled={true}
        height={props.bottomSheetHeight || 300}
        openDuration={250}
        closeDuration={250}
        closeOnPressBack={true}
        closeOnPressMask={false}>
        {props.children}
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // ...AppStyles.flex,
    // backgroundColor: 'green',
  },
});
