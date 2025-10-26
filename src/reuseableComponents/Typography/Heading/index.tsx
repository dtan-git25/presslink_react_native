import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Fonts, Metrics} from '../../../theme';
import Text from '../Text';

interface IHeading {
  style: {};
  size: number;
  color: string;
}

const Heading = ({
  style,
  size = 24,
  color = useTheme().colors.text,
  ...rest
}: IHeading) => (
  <Text
    {...rest}
    style={[
      styles.text,
      style,
      {
        fontSize: Metrics.generatedFontSize(size),
      },
    ]}
  />
);

export default Heading;

const styles = StyleSheet.create({
  text: {
    marginVertical: Metrics.heightRatio(2),
    fontFamily: Fonts.Type.GSemiBold,
  },
});
