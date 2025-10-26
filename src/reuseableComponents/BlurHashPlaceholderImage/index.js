import { Metrics } from '@theme';
import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Blurhash } from 'react-native-blurhash';

const GradientPlaceHolderImage = props => {
  const { blurhash, uri, width, height, containerStyle, ...imageProps } = props;

  const [isFadeInFinished, toggleFadeInFinished] = React.useState(false);
  const imageDimensions = { width, height };

  const animatedOpacityValue = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={{ borderRadius: 10, overflow: 'hidden' }}>
      {!isFadeInFinished && (
        <Blurhash
          blurhash={blurhash}
          decodeAsync={true}
          style={[{ position: 'absolute', left: 0, top: 0 }, imageDimensions]}
        />
      )}
      <Animated.Image
        source={{ uri: uri }}
        {...imageDimensions}
        style={[
          imageDimensions,
          imageProps.style,
          { opacity: animatedOpacityValue, borderRadius: Metrics.smallMargin, },
        ]}
        onLoad={() => {
          if (isFadeInFinished) {
            return;
          }

          Animated.timing(animatedOpacityValue, {
            toValue: 1,
            delay: 0,
            isInteraction: false,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }).start(() => toggleFadeInFinished(true));
        }}
      />
    </View>
  );
};

export default GradientPlaceHolderImage;
