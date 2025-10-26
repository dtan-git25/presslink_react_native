import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {Colors} from '../../theme';

const SafeArea = props => {
  const {children, backgroundColor} = props;
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background.white}
      />
      {children}
    </SafeAreaView>
  );
};

// Set default props
SafeArea.defaultProps = {
  backgroundColor: Colors.background.white,
};

export default SafeArea;

const styles = {
  safeArea: {
    flex: 1,
  },
};
