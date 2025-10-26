import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from 'rn-range-slider';

import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';
import {Metrics} from '@theme';
import _ from 'lodash';

const RangeSlider = props => {
  const {
    thumbBorderColor,
    thumbColor,
    selectionColor,
    labelBackgroundColor,
    blankColor,
    labelBottomTextColor,
    max,
    min,
    step,
  } = props;

  const [low, setLow] = useState(min);
  const [high, setHigh] = useState(max);

  const onValueChanged = (low, high) => {
    setLow(low);
    setHigh(high);
    _.debounce(function () {
      props.valueChanged(low, high);
    }, 250);
  };

  const renderThumb = useCallback(
    () => (
      <Thumb
        style={{
          borderColor: thumbBorderColor,
          backgroundColor: thumbColor,
        }}
      />
    ),
    [],
  );
  const renderRail = useCallback(
    () => <Rail style={{backgroundColor: blankColor}} />,
    [],
  );
  const renderRailSelected = useCallback(
    () => (
      <RailSelected
        style={{
          backgroundColor: selectionColor,
        }}
      />
    ),
    [],
  );
  const renderLabel = useCallback(
    value => (
      <Label text={value} style={{backgroundColor: labelBackgroundColor}} />
    ),
    [],
  );
  const renderNotch = useCallback(
    () => <Notch style={{borderTopColor: labelBackgroundColor}} />,
    [],
  );

  return (
    <View style={styles.root}>
      <Slider
        style={styles.slider}
        min={min}
        max={max}
        step={step}
        floatingLabel={true}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        gravity={'center'}
        // onValueChanged={onValueChanged}
      />
      <View style={styles.horizontalContainer}>
        <Text
          style={[styles.valueText, labelBottomTextColor]}>{`${low} mi`}</Text>
        <Text style={[styles.valueText, labelBottomTextColor]}>
          {`${high} mi`}
        </Text>
      </View>
    </View>
  );
};

export default RangeSlider;

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    marginVertical: Metrics.baseMargin,
  },
  slider: {height: 14},
  button: {},
  header: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 12,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  valueText: {
    // width: 50,
    color: 'white',
    fontSize: 20,
  },
});
