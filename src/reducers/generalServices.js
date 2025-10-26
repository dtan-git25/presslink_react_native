//
//  serviceReducer.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:22:21 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import * as types from '../actions/ActionTypes';
import _ from 'lodash';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  data: {},
  deleted: [],
  added: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GENERAL_SERVICES: {
      return Immutable.merge(state, {
        ...state,
        data: { ...state.data, ...action.data },
      });
    }

    case types.UPDATE_SERVICE: {
      return Immutable.merge(state, {
        data: { ...state.data, [action.data.id]: action.data },
      });
    }

    case types.ADD_DELETE_SERVICE: {
      if (action.data.isDeleted) {
        return Immutable.merge(state, {
          deleted: [...state.deleted, action.data.id],
        });
      }

      if (action.data.isAdded) {
        const obj = {}
        obj[action.data.id] = action.data
        return Immutable.merge(state, {
          added: [...state.added, action.data.id],
          data: { ...state.data, ...obj }
        });
      }
    }



    default:
      return state;
  }
};
