import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatListHandler, OrderPackageCard} from '@reuseableComponents';
import {AppStyles, Colors, Metrics} from '@theme';
import {push} from '@nav';
import {useDispatch, useSelector} from 'react-redux';
import {request} from '../../actions/ServiceAction';
import {SERVICE} from '@actionTypes';
import constant from '@constants';

const MoreServices = ({route}) => {
  const dispatch = useDispatch();
  const services = useSelector(
    ({providerServiceReducer}) => providerServiceReducer,
  );

  const getServices = (isConcat = false, page = 1) => {
    let params = {page};
    dispatch(
      request(
        constant.service + `?user_id=${route.params.providerId}`,
        constant.serviceTypes.GET,
        params,
        SERVICE,
        false,
        isConcat,
        cbServiceSuccess,
        cbServiceFailure,
        SERVICE,
      ),
    );
  };

  function cbServiceSuccess() {}
  function cbServiceFailure() {}

  const {data, meta, isFetching} = services;

  const onDetail = item => () => {
    push('ScheduleDetail', {serviceDetails: item});
  };

  const renderItem = ({item}) => (
    <OrderPackageCard
      on
      showOrderId={false}
      data={item}
      key={item.url}
      onPress={onDetail(item)}
    />
  );

  const renderSeparator = useCallback(() => <View style={styles.hr} />, []);


  useEffect(() => {
    getServices();
  }, []);

  return (
    <FlatListHandler
      renderItem={renderItem}
      fetchRequest={getServices}
      ItemSeparatorComponent={renderSeparator}
      isFetching={isFetching}
      style={styles.flex}
      meta={meta}
      data={data}
    />
  );
};

export default MoreServices;

const styles = StyleSheet.create({
  inputTxt: {
    backgroundColor: Colors.bg.white,
    height: Metrics.heightRatio(52),
    borderBottomWidth: 0,
  },
  inputLabel: {
    backgroundColor: Colors.bg.white,
    paddingTop: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin,
    marginTop: Metrics.heightRatio(3),
  },
  flex: {
    flex: 1,
  },
  imgSelector: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.widthRatio(64),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.txt.lGrey,
    justifyContent: 'center',
    alignContent: 'center',
  },
  imgPickerContainer: {
    backgroundColor: 'white',
    marginTop: Metrics.heightRatio(4),
    paddingVertical: Metrics.smallMargin,
    paddingHorizontal: Metrics.baseMargin,
  },
  hr: {
    height: Metrics.widthRatio(1),
    backgroundColor: Colors.bg.bg,
  },
  imgPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Metrics.baseMargin - 4,
  },
  imgPickerTitle: {
    ...AppStyles.gbSb(16),
    marginBottom: Metrics.heightRatio(10),
    marginTop: Metrics.heightRatio(10),
  },
  imgPickerSubTitle: {
    ...AppStyles.gbRe(15, Colors.txt.slate),
  },
  btn: {
    backgroundColor: Colors.SocialButton.purple,
    width: '94%',
    alignSelf: 'center',
    marginTop: Metrics.doubleBaseMargin,
    minHeight: Metrics.heightRatio(38),
  },
});
