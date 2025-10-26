import React, {memo} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import ButtonView from '../ButtonView';
import {Metrics} from '../../theme';

interface IImageButton {
  style?: any;
  onPress?: () => void | [() => void];
  source: number[] | [{uri: string}] | number | {uri: string};
}

const ImageButton = ({
  style = {},
  onPress = () => {},
  source,
  ...rest
}: IImageButton) => {
  if (!Array.isArray(source)) {
    return (
      <ButtonView
        {...rest}
        style={[
          {
            padding: Metrics.smallMargin,
          },
          style,
        ]}
        onPress={Array.isArray(onPress) ? onPress[0] : onPress}>
        <Image source={source} resizeMode="contain" />
      </ButtonView>
    );
  }

  return (
    <View style={styles.container}>
      {source.map((item, index) => (
        <ButtonView
          {...rest}
          style={[
            style,
            {
              paddingVertical: Metrics.baseMargin,
            },
          ]}
          key={`button_${index}`}
          onPress={
            Array.isArray(onPress) ? onPress[index] || (() => {}) : onPress
          }>
          <Image source={source[index]} resizeMode="contain" />
        </ButtonView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ImageButton);
