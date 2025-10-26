import {LOAD} from 'redux-storage';
import {take, fork} from 'redux-saga/effects';

function* watchReduxLoadFromDisk() {
  while (true) {
    console.log('init  ********  ', LOAD);
    yield take(LOAD);
    try {
      console.log('init user : condition ********  ');
    } catch (err) {
      console.warn('saga watchReduxLoadFromDisk error: ', err);
    }
  }
}

export default function* root() {
  yield fork(watchReduxLoadFromDisk);
}
