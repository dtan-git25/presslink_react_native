import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';

import { BadgeCount, ButtonView, Loader, OrdersCard } from '@reuseableComponents';
import { Categories } from '@containers';

import { AppStyles, Colors, Images, Metrics } from '@theme';
import { push } from '@nav';
import { useSelector, useDispatch } from 'react-redux';
import { request } from '../../../actions/ServiceAction';
import constant from '@constants';
import { RECOMMENDATION } from '@actionTypes';
import ListEmpty from '../../../reuseableComponents/FlatListHandler/ListEmpty';
import SocketIO from '../../../modules/SocketIO';






export default params => {

  params.navigation.setOptions({
    headerShown: false
  });
  const user = useSelector(({ userReducer }) => userReducer.data);
  const dispatch = useDispatch()
  const [loader, showLoader] = useState(true)


  const freshRecommendations = (isConcat = false, page = 1) => {
    // showLoader(true)
    let params = { page, limit: 10 }
    dispatch(
      request(
        constant.user + `?limit=10&sort_column=created_at&sort_order=desc`,
        constant.serviceTypes.GET,
        params,
        RECOMMENDATION,
        false,
        isConcat,
        cbrecommendationsSuccess,
        cbrecommendationsFailure,
        RECOMMENDATION,
      )
    )
  }

  function cbrecommendationsSuccess(res) {
    showLoader(false)
  }

  function cbrecommendationsFailure() { }


  useEffect(() => {
    SocketIO.init(user);
    if (!SocketIO.getInstance().getIsReceivedMessageListenerLockStatus()) {
      SocketIO.connectToSocket(user);
    }
    freshRecommendations()
  }, [])


  const recommendation = useSelector(({ recommendationReducer }) => recommendationReducer)
  const { isFetching, meta, data } = recommendation
  const Title = ({ title, onPress }) => (
    <View style={styles.containerTitle}>
      <Text style={styles.txtTitle}>{title}</Text>
      {!!onPress && (
        <ButtonView onPress={onPress}>
          <Text style={styles.txtViewAll}>View All</Text>
        </ButtonView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header user={user} />
      {loader &&
        <Loader />
      }
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={freshRecommendations}
          />
        }
        style={styles.scrollView}>
        <Title
          title="Categories"
          onPress={() => {
            push('Categories');
          }}
        />
        <Categories isHorizontal />
        <Title title="Fresh Recommendation" />
        <View style={styles.containerOrders}>
          {
            data.length > 0 ?
              data.map(item => (
                <OrdersCard key={item.id} data={item} />
              ))
              :
              <ListEmpty />
          }

        </View>
      </ScrollView>
    </View>
  );
};
const Header = ({ user }) => {
  const onSearch = useCallback(() => push('Search'), []);
  const onNotifications = useCallback(() => push('Notifications'), []);

  const { name } = user;
  const notificationData = useSelector(({ notificationReducer }) => notificationReducer.data)

  return (
    <View style={styles.containerHeader}>
      <View style={styles.flex}>
        <Text style={AppStyles.gbRe(16, Colors.txt.mGrey)}>
          Good morning,
          <Text style={AppStyles.gbSb(16, Colors.primary.violet)}>{name}</Text>
        </Text>
        <Text style={AppStyles.gbSb(18, Colors.txt.black)}>
          What are you looking for?
        </Text>
      </View>
      <ButtonView style={styles.btnSearch} onPress={onSearch}>
        <Image source={Images.search} />
      </ButtonView>
      <ButtonView style={styles.btnNoti} onPress={onNotifications}>
        {/* <Image source={Images.notification} /> */}
        <BadgeCount source={Images.notification} />

      </ButtonView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.bg,
    paddingTop: Metrics.baseMargin,
    paddingBottom: Metrics.smallMargin,
    paddingLeft: Metrics.baseMargin,
  },
  scrollView: { marginTop: Metrics.baseMargin },
  containerOrders: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnNoti: {
    ...AppStyles.roundImage(32),
    ...AppStyles.centerAligned,
    backgroundColor: Colors.bg.lGreyTwo,
  },
  btnSearch: {
    ...AppStyles.roundImage(32),
    ...AppStyles.centerAligned,
    backgroundColor: Colors.bg.lGreyTwo,
    marginRight: Metrics.smallMargin,
  },
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrics.smallMargin,
    marginBottom: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  txtTitle: AppStyles.gbSb(16, Colors.txt.vdGrey),
  txtViewAll: AppStyles.gbRe(12, Colors.primary.violet),
  containerHeader: { flexDirection: 'row', paddingRight: Metrics.baseMargin, marginTop: Platform.OS == 'ios' ? Metrics.heightRatio(40) : Metrics.heightRatio(30) },
  flex: { flex: 1 },
});
