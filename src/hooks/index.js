import  { useState, useEffect, useCallback } from 'react';
import { Keyboard } from 'react-native';
import WithKeyboardListener from './WithKeyboardListener'

export {
  WithKeyboardListener
}
export const useMergeState = (initialState) => {
  const [state, setState] = useState(initialState);
  const setMergedState = newState =>
    setState(prevState => Object.assign({}, prevState, newState)
    );
  return [state, setMergedState];
}

export const useKeyboard = () => {
  const [keyboard, setKeyboard] = useMergeState({
    visible: false,
    height: 0
  })

  useEffect(() => {
    const handleKeyboardShow = (e) => {
      setKeyboard({ visible: true, height: e.endCoordinates.height })
    };

    const handleKeyboardHide = () => setKeyboard({ visible: false, height: 0 });

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      }
    };
  }, []);

  return keyboard;
}

export const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};