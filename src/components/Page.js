import { Colors, Metrics } from '@theme';
import React from 'react';
import { StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Page({ children, style, safe = false, bounces = true }) {
  return (
    <>
      <ScrollView
        bounces={bounces}
        style={[styles.container, style]}>
        {safe && <SafeAreaView />}
        {children}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.bg.bg,
  },
});
