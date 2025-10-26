import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

import { AppStyles, Colors, Metrics, Images } from '@theme';
import { ButtonView } from '@reuseableComponents';

const Row = ({ img, title }) => (
  <View style={{ flexDirection: 'row', padding: Metrics.baseMargin }}>
    <Image source={img} style={{ marginRight: Metrics.baseMargin }} />
    <Text>{title}</Text>
  </View>
);

export default Schedule = ({ onPressDate, onPressStartTime, startTime, edit = true, selectedDay, weekday, selectedMonth }) => {
  return (
    <View style={[styles.content]}>
      <View style={styles.rowAlign}>
        <Row img={Images.icCalendar} title={'Schedule'} />
        {/* {edit && (
          <ButtonView style={{ marginRight: Metrics.baseMargin }}>
            <Image source={Images.icEditWhite} style={styles.editIcon} />
          </ButtonView>
        )} */}
      </View>

      <View style={styles.schedule}>
        <ButtonView style={styles.scheduleDate} onPress={onPressDate}>
          <Text style={styles.scheduleDateTxt}>{selectedMonth}</Text>
          <Text style={AppStyles.gbRe(18)}>{selectedDay}</Text>
        </ButtonView>
        <View
          style={[styles.justifyContentCenter, { flex: 1 }]}>
          <Text style={styles.scheduleDay}>{weekday}</Text>
          <View style={{ flexDirection: 'row' }}>
            <ButtonView onPress={onPressStartTime}>
              <Text style={AppStyles.gbRe(18)}>{startTime}</Text>
            </ButtonView>
            {/* <ButtonView onPress={onPressEndTime} >
              <Text style={AppStyles.gbRe(18)}> - {endTime}</Text>
            </ButtonView> */}
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: Metrics.heightRatio(2),
    backgroundColor: Colors.bg.white,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schedule: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: Metrics.baseMargin,
  },
  scheduleDate: {
    backgroundColor: Colors.bg.lGreyTwo,
    paddingVertical: Metrics.heightRatio(Platform.OS == 'android' ? 2 : 4),
    width: Metrics.widthRatio(Platform.OS == 'android' ? 46 : 42),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginHorizontal: Metrics.baseMargin,
  },
  scheduleDay: {
    ...AppStyles.gbRe(12),
    marginBottom: Metrics.heightRatio(3),
  },
  scheduleDateTxt: {
    ...AppStyles.gbRe(12),
    marginBottom: Metrics.heightRatio(3),
  },
  editIcon: {
    ...AppStyles.imgStyle(15),
    tintColor: Colors.txt.mGrey,
  },
});
