import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ButtonView from '../ButtonView';
import { Metrics, AppStyles, Colors } from '../../theme';

interface IAppButton {
  title: string;
  onPress: () => void;
  style?: {};
  textStyle?: {};
  disabled?: boolean;
  backgroundColor: string;
  left: any;
  right: any;
}

const AppButton = ({
  title = 'Click',
  onPress = () => null,
  style = {},
  textStyle = {},
  backgroundColor = '#788484',
  disabled = false,
  left = null,
  right = null,
  isGradient = false,
}: IAppButton) => {
  return isGradient ? (
    <ButtonView disabled={disabled} style={[styles.containerGradient, style]} onPress={onPress}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={Colors.gradient.purpleGradient}
        style={styles.gradient}>
        <View style={styles.containerTitle}>
          <Text style={[styles.txtTitle, textStyle]}>{title}</Text>
        </View>
      </LinearGradient>
    </ButtonView>
  ) : (
    //@ts-ignore
    <ButtonView
      disabled={disabled}
      style={[styles.container, { backgroundColor }, style]}
      onPress={onPress}>
      <View style={styles.iconContainer}>{left}</View>
      {/*//@ts-ignore*/}
      <Text style={[styles.title, textStyle]}>{title}</Text>
      <View style={styles.iconContainer}>{right}</View>
    </ButtonView>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Metrics.smallMargin * 0.8,
    height: Metrics.heightRatio(35),
    width: '100%',
    ...AppStyles.centerAligned,
    borderRadius: Metrics.smallMargin / 2,
    backgroundColor: '#ff0',
  },
  iconContainer: { width: Metrics.widthRatio(45), alignItems: 'center' },
  title: {
    flex: 3,
    textAlign: 'center',
    ...AppStyles.gbRe(16, Colors.txt.white),
  },
  containerGradient: {
    flexDirection: 'row',
    backgroundColor: 'yellow',
    height: Metrics.widthRatio(45),
  },
  gradient: { width: '100%', borderRadius: Metrics.widthRatio(4) },
  containerTitle: { ...AppStyles.centerAligned, flex: 1 },
  txtTitle: AppStyles.gbRe(16, Colors.txt.white),
});
