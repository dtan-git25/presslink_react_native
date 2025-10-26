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
  isFetching: false,
  failure: false,
  errMessage: '',
  data: [],
  meta: {
    current_page: 0,
    from: 0,
    last_page: 0,
    to: 0,
    total: 0,
  },
});

export default type => {
  return (state = initialState, action) => {
    switch (action.type) {
      case types.GENERAL_ACTION:
        if (action.actionType || action.referencedReducer) {
          if (
            // if passed action type the result is stored on that reducer after success
            // if reducer is not passed then checking if it has a refrence reducer as
            // to cater is fetching state
            (action.actionType && action.actionType.REQUEST == type.REQUEST) ||
            (action.referencedReducer &&
              action.referencedReducer.REQUEST == type.REQUEST)
          ) {
            return Immutable.merge(state, {
              ...state,
              isFetching: true,
            });
          } else {
            return state;
          }
        } else {
          return state;
        }

      case type.SUCCESS:
        if (action.isConcat) {
          return Immutable.merge(state, {
            failure: false,
            isFetching: false,
            errorMessage: '',
            data: _.concat(state.data, action.data),
            meta:
              action.meta && Object.keys(action.meta).length
                ? action.meta
                : state.meta,
          });
        }
        return Immutable.merge(state, {
          failure: false,
          isFetching: false,
          errorMessage: '',
          data: action.data,
          meta:
            action.meta && Object.keys(action.meta).length
              ? action.meta
              : state.meta,
        });

      case type.FAILURE:
        return Immutable.merge(state, {
          failure: true,
          isFetching: false,
          errorMessage: action.errorMessage,
        });

      case type.DELETE: {
        // if intended reducer is holding array of object then run if case
        // or if holding array of ids then run else case
        if (action.data.isDeleteObj) {
          const indexOfItemToDelete = state.data.findIndex(
            obj => obj.id == action.data.id,
          );
          if (indexOfItemToDelete !== -1) {
            const tempData = _.cloneDeep(state.data);
            tempData.splice(indexOfItemToDelete, 1);
            return Immutable.merge(state, {
              data: tempData,
            });
          }
          return state;
        } else {
          let indexOfItemToDelete = state.data.indexOf(action.data.id);
          if (indexOfItemToDelete !== -1) {
            const tempData = _.cloneDeep(state.data);
            tempData.splice(indexOfItemToDelete, 1);
            return Immutable.merge(state, {
              data: tempData,
            });
          }
          return state;
        }
      }

      case type.UPDATE:
        const indexOfItemToUpdate = state.data.findIndex(
          obj => obj.id == action.data.id,
        );
        if (indexOfItemToUpdate !== -1) {
          const tempData = _.cloneDeep(state.data);
          tempData[indexOfItemToUpdate] = action.data;
          return Immutable.merge(state, {
            data: tempData,
          });
        }
        return state;

      // case type.ADD:
      //   return Immutable.merge(state, {
      //     data: _.concat(action.data, state.data),
      //     isFetching: false,
      //   });
      case type.ADD:
        const tempData = _.cloneDeep(state.data);
        const meta = _.cloneDeep(state.meta);
        if (action.data.isAddAtZero) {
          tempData.unshift(action.data);
          ++meta.total;
        } else {
          tempData.push(action.data);
          ++meta.total;
        }

        return Immutable.merge(state, {
          data: tempData,
          meta,
        });

      default:
        return state;
    }
  };
};
