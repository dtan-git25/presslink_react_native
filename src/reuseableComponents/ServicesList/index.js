import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';
import { EventBusSingleton } from 'light-event-bus';
import SocketIO from '../../modules/SocketIO';
import {
  ConfirmationModal,
  FlatListHandler,
  PackageCard,
} from '@reuseableComponents';
import { Colors, Metrics } from '@theme';
import { push } from '@nav';
import { useDispatch, useSelector } from 'react-redux';
import constant from '@constants';
import { generalSaveAction, request } from '@serviceAction';
import { SERVICE, DUMP } from '@actionTypes';
import { NORMALIZE_SERVICES } from '@actionTypes';
import { ADD_DELETE_SERVICE } from '@actionTypes';

const ServicesList = params => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    isFetching: false,
    data: [],
    meta: {},
  });

  const added = useSelector(({ generalServices }) => generalServices.added);
  const deleted = useSelector(({ generalServices }) => generalServices.deleted)
  const user = useSelector(({ userReducer }) => userReducer.data)
  useEffect(() => {
    let _id = added[added?.length - 1];

    if (_id) {
      let temp = _.cloneDeep(state.data);
      if (!temp.includes(_id)) {
        setState({ data: [_id, ...state.data] });
      }
    }
  }, [added])

  useEffect(() => {
    SocketIO.init(user);
    if (!SocketIO.getInstance().getIsReceivedMessageListenerLockStatus()) {
      SocketIO.connectToSocket(user);
    }
  }, [])

  useEffect(() => {
    let _id = deleted[deleted?.length - 1];
    if (_id) {
      let temp = _.cloneDeep(state.data);
      if (temp.includes(_id)) {
        temp.splice(temp.indexOf(_id), 1)
        setState({ data: temp });
      }
    }
  }, [deleted])

  const getServices = useCallback((isConcat = false, page = 1) => {
    setState(s => ({ ...s, isFetching: true }));
    let params = { page };
    dispatch(
      request(
        constant.service,
        constant.serviceTypes.GET,
        params,
        null,
        false,
        isConcat,
        (res, meta) => {
          dispatch(
            generalSaveAction(
              NORMALIZE_SERVICES,
              res,
              list =>
                !!list.length ?
                  setState(s => ({ ...s, data: list, isFetching: false, meta })) : setState(s => ({ ...s, isFetching: false })),
            ),
          );
        },
        cbServiceFailure,
      ),
    );
  }, []);

  function cbServiceFailure() {
    setState(s => ({ ...s, isFetching: false }));
  }

  const deleteItem = selectedItem => {
    dispatch(
      request(
        constant.service + `/${selectedItem.slug}`,
        constant.serviceTypes.DELETE,
        {},
        DUMP,
        false,
        false,
        cbDeleteSuccess(selectedItem.id),
        cbDeleteFailure,
      ),
    );
  };

  const cbDeleteSuccess = (id) => () => {
    dispatch(
      generalSaveAction(ADD_DELETE_SERVICE,
        { id, isDeleted: true }
      )
    )
  };

  function cbDeleteFailure() { }

  useEffect(() => {
    getServices();
  }, []);

  const selectItem = (selectedService) => {
    EventBusSingleton.publish('popup', {
      val: 'deleteService',
      onAccept: () => {
        deleteItem(selectedService);
      },
    });
  }

  const { data, meta, isFetching } = state;

  const renderItem = useCallback(
    ({ item }) => (
      < PackageCard data={item} deleted={true} onDelete={selectItem} />
    ),
    [],
  );

  const renderSeparator = useCallback(() => <View style={styles.hr} />, []);

  return (
    <View style={styles.container}>
      <FlatListHandler
        data={data}
        renderItem={renderItem}
        fetchRequest={getServices}
        style={styles.flex}
        ItemSeparatorComponent={renderSeparator}
        isFetching={isFetching}
        meta={meta}
      />
    </View>
  );
};

export default ServicesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.bg,
  },
  flex: 1,
  hr: {
    height: Metrics.widthRatio(1),
    backgroundColor: Colors.bg.bg,
  },
  floatBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  modalContent: {
    width: Metrics.screenWidth - Metrics.widthRatio(52),
  },
});
