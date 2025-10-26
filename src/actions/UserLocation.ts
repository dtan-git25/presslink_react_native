import * as types from './ActionTypes';

export function request(permissionGranted: any) {
  return {
    permissionGranted,
    type: types.USER_LOCATION.REQUEST,
  };
}

export function success(location: any) {
  return {
    location,
    type: types.USER_LOCATION.SUCCESS,
  };
}

export function failure(errorMessage: any) {
  return {
    errorMessage,
    type: types.USER_LOCATION.FAILURE,
  };
}
