// @flow
import * as types from '../actions/ActionTypes';

const initialState = {
  data: true,
};

export default (state: any = initialState, action: any) => {
  switch (action.type) {
    case types.IS_FIRST_RUN:
      return {
        ...state,
        data: false,
      };
    default:
      return state;
  }
};
