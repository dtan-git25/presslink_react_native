import { take, takeEvery, put, select } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
// import {selectUser} from '../sagaSelectors';
import { NORMALIZE_SERVICES, GENERAL_SERVICES } from '../actions/ActionTypes';
import { generalSaveAction, success } from '../actions/ServiceAction';

function* watchRequest(action) {
  const { data, callback } = action;
  const serviceSchema = new schema.Entity('services');
  const serviceListSchema = [serviceSchema];
  const normalizedData = normalize(data, serviceListSchema);
  yield put(
    generalSaveAction(GENERAL_SERVICES, normalizedData.entities.services),
  );

  callback && callback(normalizedData.result);
  // yield put(
  //   success(reducerType || TIMELINE, normalizedData.result, meta, isConcat),
  // );
}

export default function* root() {
  yield takeEvery(NORMALIZE_SERVICES, watchRequest);
}
