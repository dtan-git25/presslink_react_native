import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Fonts, Metrics} from '../../../theme';
import Text from '../Text';

interface ITitle {
  style?: {};
  size?: number;
  color?: string;
  children: string;
}

const Title = ({
  style,
  size = 16,
  color = useTheme().colors.text,
  children = '',
  ...rest
}: ITitle) => (
  <Text
    {...rest}
    style={[
      styles.text,
      style,
      {
        fontSize: Metrics.generatedFontSize(size),
      },
    ]}>
    {children}
  </Text>
);

export default Title;

const styles = StyleSheet.create({
  text: {
    marginVertical: 2,
    fontFamily: Fonts.Type.GSemiBold,
  },
});
