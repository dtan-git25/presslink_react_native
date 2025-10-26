import React from 'react';
import { View, Text, Image, StyleSheet, ImageURISource } from 'react-native';
import { Metrics } from '../../theme';

const icon = require('./img/icNotifications.png');

interface IBadgeCount {
  source?: number | ImageURISource | undefined;
  badgeCount: number;
  style?: {};
}

const BadgeCount = ({
  source = icon,
  badgeCount = 0,
  style = {},
}: IBadgeCount) => {
  return (
    <View>
      <Image source={source} resizeMode="contain" style={styles.icon} />
      {badgeCount > 0 && (
        <View style={[styles.container, style]}>
          <Text style={styles.count}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: -2,
    top: -4,
    backgroundColor: '#B00020',
    borderRadius: Metrics.widthRatio(14 / 2),
    width: Metrics.widthRatio(14),
    height: Metrics.widthRatio(14),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  icon: { height: Metrics.widthRatio(20), width: Metrics.widthRatio(20) },
  count: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 11,
  },
});

export default BadgeCount;
