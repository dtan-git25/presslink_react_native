import * as types from '../actions/ActionTypes';

const initialState = {
  isFetching: false,
  failure: false,
  errorMessage: '',
  coordinate: {
    latitude: 0,
    longitude: 0,
  },
  permissionGranted: null,
};

export default (state: any = initialState, action: any) => {
  switch (action.type) {
    case types.USER_LOCATION.REQUEST:
      return {
        ...state,
        isFetching: action.permissionGranted === 'granted',
        failure: false,
        errorMessage: '',
        permissionGranted: action.permissionGranted,
      };
    case types.USER_LOCATION.SUCCESS:
      return {
        ...state,
        isFetching: false,
        failure: false,
        errorMessage: '',
        coordinate: {
          latitude: action.location.coords.latitude,
          longitude: action.location.coords.longitude,
        },
      };
    case types.USER_LOCATION.FAILURE:
      return {
        ...state,
        isFetching: false,
        failure: true,
        errorMessage: action.errorMessage,
      };

    default:
      return state;
  }
};
