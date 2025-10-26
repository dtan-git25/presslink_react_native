import { StyleSheet } from "react-native";
import {  Metrics } from '../../theme';

export default StyleSheet.create({
  toolbarContainerStyle: {
    overflow: 'hidden',
    borderTopWidth: 0,
    borderTopColor: '#333',
    marginHorizontal: Metrics.baseMargin,
    borderRadius: 12,
    minHeight: 44,
    marginBottom: Metrics.baseMargin
  },
  toolbarContainerStyleFocused: {
    borderTopWidth: 0,
    minHeight: 44,
  }
})  