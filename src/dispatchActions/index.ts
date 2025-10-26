import {request, generalSaveAction} from '../actions/ServiceAction';

import {useDispatch} from 'react-redux';

const useDispatchActions = () => {
  const dispatch = useDispatch();

  const dispatchGeneralSaveAction = (type, data, isConcat = false) => {
    dispatch(generalSaveAction(type, data, isConcat));
  };

  const dispatchApi = (
    action,
    api,
    method, // api type get/post
    payload,
    loader = true,
    cbSuccess,
    cbFailure,
    message = true,
    networkError = true,
    actionBase,
    isConcat,
  ) => {
    dispatch(
      request(
        action,
        api,
        method,
        payload,
        loader,
        cbSuccess,
        cbFailure,
        message,
        networkError,
        actionBase,
        isConcat,
      ),
    );
  };



  return {
    dispatchGeneralSaveAction,
  };
};

export {useDispatchActions};
