import {SOCKET_WRITE} from './ActionTypes';

var callbackRef: any[] = [];
export function write(
  types: any,
  service: any,
  data: {},
  showHud = false,
  success = () => {},
  failure = () => {},
  showMsg = false,
) {
  findPush(types, success, failure);
  let writeable = true;
  return {
    writeable,
    payload: data,
    service,
    type: SOCKET_WRITE,
    request_type: types,
    showHud,
    showMsg,
  };
}
const findPush = (types: any, success: () => void, failure: () => void) => {
  let index = callbackRef.findIndex(item => item.type === types.SUCCESS);
  if (index !== -1) {
    callbackRef[index].success = success;
  } else {
    callbackRef.push({type: types.SUCCESS, success: success});
  }
  let indexFail = callbackRef.findIndex(item => item.type === types.FAILURE);
  if (indexFail !== -1) {
    callbackRef[indexFail].failure = failure;
  } else {
    callbackRef.push({type: types.FAILURE, failure: failure});
  }
};
export function withOutWrite(
  types: any,
  showHud = false,
  success = () => {},
  failure = () => {},
  showMsg = false,
) {
  callbackRef.push({type: types.SUCCESS, success: success});
  callbackRef.push({type: types.FAILURE, failure: failure});
  let writeable = false;
  return {
    writeable,
    type: SOCKET_WRITE,
    request_type: types,
    showHud,
    showMsg,
  };
}
export function success(types: any, data: {}) {
  let item = callbackRef.filter(item => item.type === types.SUCCESS);
  if (item.length > 0) {
    let callback = item[0].success;
    callback(data);
  }
  return {
    data,
    type: types.SUCCESS,
  };
}

export function failure(types: any, errorMessage: any) {
  let item = callbackRef.filter(item => item.type === types.FAILURE);
  if (item.length > 0) {
    let callback = item[0].failure;
    callback(data);
  }
  return {
    errorMessage,
    type: types.FAILURE,
  };
}
