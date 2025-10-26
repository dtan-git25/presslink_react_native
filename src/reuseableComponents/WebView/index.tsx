import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, StyleSheet,View} from 'react-native';
import {Metrics} from '../../theme';

const WebViewComponent = props => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <WebView
        source={{uri: props.route.params.link}}
        renderLoading={true}
        onLoadEnd={() => {
          setLoading(false);
        }}
      />
      {loading && <ActivityIndicator style={styles.indicator} size="large" />}
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: (Metrics.screenHeight - 200) / 2,
    left: (Metrics.screenWidth - 40) / 2,
  },
});

export default WebViewComponent;
