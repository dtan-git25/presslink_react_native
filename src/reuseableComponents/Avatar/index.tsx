import React from 'react';
import {StyleSheet, ImageURISource, Image} from 'react-native';
import {Metrics} from '../../theme';
import {ButtonView} from '../../reuseableComponents';

const profileHolder = require('./img/profileHolder.png');

interface IAvatar {
  source: number | ImageURISource | undefined;
  onPress?: () => void;
  imgViewStyle?: {};
  imgStyle?: {};
  defaultSource?: number | ImageURISource | undefined;
  disabled?: boolean;
}

const Avatar = ({
  source,
  onPress = () => {},
  imgViewStyle,
  imgStyle,
  defaultSource = profileHolder,
  disabled = false,
}: IAvatar) => {
  return (
    <ButtonView
      style={{...styles.imgViewStyle, ...imgViewStyle}}
      disabled={disabled}
      onPress={onPress}>
      <Image
        source={source}
        defaultSource={defaultSource}
        style={{...styles.imgStyle, ...imgStyle}}
      />
    </ButtonView>
  );
};

const styles = StyleSheet.create({
  imgViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    height: Metrics.widthRatio(50),
    width: Metrics.widthRatio(50),
    borderRadius: Metrics.widthRatio(50 / 2),
    borderWidth: 3,
    borderColor: '#fff',
  },
});

export default Avatar;
