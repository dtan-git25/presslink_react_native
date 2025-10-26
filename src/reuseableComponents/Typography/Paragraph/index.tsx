import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Fonts, Metrics} from '../../../theme';
import Text from '../Text';

interface IParagraph {
  style?: {};
  size?: number;
  color?: string;
  children: string;
}

const Paragraph = ({
  style,
  size = 15,
  color = useTheme().colors.text,
  children = '',
  ...rest
}: IParagraph) => (
  <Text
    {...rest}
    style={[
      styles.text,
      style,
      {
        color: color,
        fontSize: Metrics.generatedFontSize(size),
      },
    ]}>
    {children}
  </Text>
);

export default Paragraph;

const styles = StyleSheet.create({
  text: {
    marginVertical: 2,
    fontFamily: Fonts.Type.GRegular,
  },
});
