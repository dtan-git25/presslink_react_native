import _ from 'lodash';
import constant from '../../constants';

const Messages = {
  empty: 'Please enter your ',
  password: 'Password must be at-least of 8 characters', //'Use 8 or more characters with a mix of letters, numbers & symbols',
  email: 'Please enter a valid Email Address',
};
function isEmpty(data: any) {
  return _.isEmpty(data);
}

function isEmailValid(email: string) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

function isPasswordValid(password: string) {
  if (password.length >= 6) {
    return true;
  }
  return false;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
  return re.test(password);
}

function isInputValid(value, type, label) {
  const { INPUT_TYPES } = constant;
  switch (type) {
    case INPUT_TYPES.EMAIL: {
      if (isEmpty(value)) {
        return Messages.empty + label;
      } else if (!isEmailValid(value)) {
        return Messages.email;
      }
      return true;
    }
    case INPUT_TYPES.PASSWORD: {
      if (isEmpty(value)) {
        return Messages.empty + label;
      } else if (!isPasswordValid(value)) {
        return Messages.password;
      }
      return true;
    }
    case INPUT_TYPES.NON_EMPTY:
      if (isEmpty(value)) {
        return 'required*';
      }
      return true;
    case INPUT_TYPES.PASSWORD_LOGIN:
    case INPUT_TYPES.NUMBER:
    case INPUT_TYPES.NUMERIC:
    case INPUT_TYPES.DECIMAL:
    case INPUT_TYPES.PHONE:
    case INPUT_TYPES.NAME: {
      if (isEmpty(value)) {
        return Messages.empty + label;
      }
      return true;
    }
    default: {
      return true;
    }
  }
}

// showPassword is passed to input to as props
function isSecureTextEntry(type, override) {
  const { INPUT_TYPES } = constant;
  switch (type) {
    case INPUT_TYPES.PASSWORD:
    case INPUT_TYPES.PASSWORD_LOGIN: {
      return true;
    }
    default: {
      return false;
    }
  }
}

function getKeyboardType(type) {
  const { INPUT_TYPES } = constant;

  if (type) {
    switch (type) {
      case INPUT_TYPES.EMAIL: {
        return 'email-address';
      }
      case INPUT_TYPES.NUMBER: {
        return 'number-pad';
      }
      case INPUT_TYPES.PHONE: {
        return 'phone-pad';
      }
      default:
        return 'default';
    }
  }
  return 'default';
}

export { getKeyboardType, isInputValid, isSecureTextEntry };
