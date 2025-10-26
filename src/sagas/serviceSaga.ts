//
//  serviceSaga.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:29:45 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import {put, call, takeEvery, take} from 'redux-saga/effects';
import {success, failure, requestAction} from '../actions/ServiceAction';
import HttpServiceManager from '../services/HttpServiceManager';
import {
  GENERAL_ACTION,
  GENERAL_ACTION_MULTIPLE_REQUEST,
} from '../actions/ActionTypes';
import constant from '../constants';

function callRequest({url, method, data, showHud}) {
  return HttpServiceManager.getInstance().request(url, data, method, showHud);
}

function* watchRequest(action) {
  const {successCB, failureCB, actionType, isConcat} = action;

  try {
    const {
      data,
      meta,
      // meta = constant.serviceMeta,
      message,
    } = yield call(callRequest, action);
    if (actionType) yield put(success(actionType, data, meta, isConcat));
    successCB && successCB(data, meta, message);
  } catch (err) {
    failureCB && failureCB(err);
    if (actionType) yield put(failure(actionType, err));
  }
}

export default function* root() {
  yield takeEvery(GENERAL_ACTION, watchRequest);
}
