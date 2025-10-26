import { showMessage } from 'react-native-flash-message';

const Message = (props: any) => {
  const {
    message,
    type,
    hideOnPress,
    onPress,
    animated,
    autoHide,
    duration,
    hideStatusBar,
    floating,
    position,
    icon,
    canRegisterAsDefault,
  } = props;

  showMessage({
    message: message,
    type: type || 'danger',
    hideOnPress: hideOnPress || true,
    onPress: onPress || 'none',
    animated: animated || true,
    autoHide: autoHide || true,
    duration: duration || 3500,
    hideStatusBar: hideStatusBar || true,
    floating: floating || false,
    position: position || 'top',
    icon: icon || 'auto',
    canRegisterAsDefault: canRegisterAsDefault || true,
  });
};

export default Message;
