import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppStyles, Metrics, Colors} from '@theme';
import {ButtonView} from '@reuseableComponents';

export function EarningCell(props) {
  const {name, style, price, onPress, date} = props;

  return (
    <View style={style}>
      <View style={styles.container}>
        <ButtonView onPress={onPress} style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{name}</Text>
          </View>
          <Text
            style={AppStyles.gbRe(
              20,
              name != 'Cash Out'
                ? Colors.primary.violet
                : Colors.SocialButton.red,
            )}>
            {'$' + price}
          </Text>
        </ButtonView>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.flex,
    paddingVertical: Metrics.baseMargin,
    borderBottomWidth: 0.3,
    borderColor: Colors.txt.lBlue,
    justifyContent: 'space-between',
    marginHorizontal: Metrics.doubleBaseMargin,
  },

  title: {
    ...AppStyles.gbRe(16, Colors.txt.lGrey),
  },
  date: {
    ...AppStyles.gbRe(12, Colors.txt.lGrey),
  },
});
