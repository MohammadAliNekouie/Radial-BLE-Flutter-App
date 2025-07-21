// datetimepicker.ts
import { addWeeks, subWeeks } from 'date-fns';
import {
    AndroidDateInputMode,
    AndroidDatePickerType,
    AndroidPickerMode,
    AndroidTimeInputMode,
    MaterialDatetimePickerAndroid,
} from 'react-native-material-datetime-picker';

const today = new Date();

export const useMaterialPickers = () => {
  const showTimePicker = (initialTime: Date, onChange: (time: Date) => void) => {
    MaterialDatetimePickerAndroid.show({
      value: initialTime,
      titleText: 'Select flight time',
      mode: AndroidPickerMode.TIME,
      is24Hours: true,
      inputMode: AndroidTimeInputMode.CLOCK,
      onChange,
    });
  };

  const showDatePicker = (initialDate: Date, onChange: (date: Date) => void) => {
    MaterialDatetimePickerAndroid.show({
      value: initialDate,
      titleText: 'Select booking date',
      mode: AndroidPickerMode.DATE,
      minimumDate: subWeeks(today, 3),
      maximumDate: addWeeks(today, 4),
      inputMode: AndroidDateInputMode.CALENDAR,
      type: AndroidDatePickerType.DEFAULT,
      onChange,
    });
  };

  return { showTimePicker, showDatePicker };
};
