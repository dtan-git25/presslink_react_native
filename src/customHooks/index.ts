import  { useState} from 'react';

const useMergeState = (initialState = {}) => {
  const [state, regularSetState] = useState(initialState);

  const setState = newState => {
    regularSetState(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  return [state, setState];
};

export {useMergeState};
