import React, { useLayoutEffect } from 'react';
import { WebViewComponent } from '@reuseableComponents';
import { Colors } from '@theme';
import { SafeAreaView, StyleSheet } from 'react-native';

const ContentPage = props => {
  const { navigation } = props;
  const { title } = props.route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation, title]);

  return (
    <SafeAreaView
      style={styles.safeArea}>
      <WebViewComponent {...props} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.white,
  }
})

export default ContentPage;
