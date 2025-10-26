const INPUT_TYPES = {
  TEXT: 'TEXT',
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  CONFIRM_PASSWORD: 'CONFIRM_PASSWORD',
  NUMBER: 'NUMBER',
  PHONE: 'PHONE',
  OPTIONAL: 'OPTIONAL',
  WEBSITE: 'WEBSITE',
};

const INPUTS = (refCollector, onSubmitEditing) => ({
  text: (updatedProps = {}) => {
    // respresents default props of this input types
    const props = {
      type: INPUT_TYPES.TEXT,
      label: 'Text',
      identifier: 'text',
      error: 'text is required',
      blurOnSubmit: false,
      returnKeyType: 'next',
    };
    return {
      // if there is a change in identifier push new identifier in ref collector
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },

  email: (updatedProps = {}) => {
    // respresents default props of this input types
    const props = {
      type: INPUT_TYPES.EMAIL,
      label: 'Email',
      identifier: 'email',
      error: 'email is required',
      blurOnSubmit: false,
      returnKeyType: 'next',
      keyboardType: 'email-address',
    };
    return {
      // if there is a change in identifier push new identifier in ref collector
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },

  password: (updatedProps = {}) => {
    const props = {
      type: INPUT_TYPES.PASSWORD,
      label: 'Password',
      identifier: 'password',
      error: 'password is required',
      secureTextEntry: true,
      blurOnSubmit: false,
      returnKeyType: 'next',
    };
    return {
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },

  confirmPassword: (updatedProps = {}) => {
    const props = {
      type: INPUT_TYPES.CONFIRM_PASSWORD,
      label: 'Confirm Passowrd',
      identifier: 'confirmPassword',
      error: 'Confirm Password is required',
      secureTextEntry: true,
      blurOnSubmit: false,
      returnKeyType: 'next',
    };

    return {
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },

  number: (updatedProps = {}) => {
    const props = {
      type: INPUT_TYPES.NUMBER,
      label: 'Enter phone numbner',
      identifier: 'number',
      error: 'Phone number is required',
      blurOnSubmit: false,
      returnKeyType: 'next',
      keyboardType: 'numeric',
    };

    return {
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },

  optional: (updatedProps = {}) => {
    const props = {
      type: INPUT_TYPES.OPTIONAL,
      label: 'Enter optional field',
      identifier: 'field',
      error: 'Field is required',
      blurOnSubmit: false,
      returnKeyType: 'next',
    };

    return {
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },

  website: (updatedProps = {}) => {
    const props = {
      type: INPUT_TYPES.WEBSITE,
      label: 'Enter Website url',
      identifier: 'website',
      error: 'Field is required',
      blurOnSubmit: false,
      returnKeyType: 'next',
    };

    return {
      ref: refCollector(updatedProps.identifier || props.identifier),
      onSubmitEditing: onSubmitEditing(
        updatedProps.identifier || props.identifier,
      ),
      ...props,
      ...updatedProps,
    };
  },
});

export { INPUTS, INPUT_TYPES };
