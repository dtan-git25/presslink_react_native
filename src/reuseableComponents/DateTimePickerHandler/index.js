import React, {useState, forwardRef, useImperativeHandle} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import utility from '@utils';

const DateTimePickerHandler = forwardRef((props, ref) => {
  const [isDatePickerVisible, setVisiblity] = useState(false);

  useImperativeHandle(ref, () => ({
    showHideDatePicker() {
      setDatePickerVisibility(true);
    },
  }));
  function setDatePickerVisibility(isDatePickerVisible = false) {
    setVisiblity(isDatePickerVisible);
  }

  const handleConfirm = date => {
    setDatePickerVisibility(false);
    const {cbOnPressDateTimePicker} = props;
    cbOnPressDateTimePicker(date);
  };

  const {minimumDate, maximumDate, date, mode} = props;

  return (
    <DateTimePickerModal
      // isDarkModeEnabled
      // textColor="#FFFFFF"
      date={utility.isEmpty(date) ? new Date() : new Date(date)}
      isVisible={isDatePickerVisible}
      mode={mode || 'date'}
      onConfirm={handleConfirm}
      onCancel={() => setDatePickerVisibility()}
      is24Hour={false}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
});

export default DateTimePickerHandler;
