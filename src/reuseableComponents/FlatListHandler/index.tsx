import React, { useRef } from 'react';
import { View, Text, Animated, RefreshControl, StyleSheet } from 'react-native';
import ListEmpty from './ListEmpty';
import ListFooter from './ListFooter';
import _ from 'lodash';
import Loader from '../Loader';

interface IFlatListHandler {
  data: [];
  isFetching: boolean;
  loader: boolean;
  fetchRequest: (isConcat: boolean, page: number) => void;
  meta: any;
  contentContainerStyle: {};
  isHideEmptyList: boolean;
  nScroll: boolean;
}

const FlatListHandler = ({
  data = [],
  isFetching = false,
  loader = false,
  nScroll = false,
  fetchRequest = () => null,
  meta,
  contentContainerStyle,
  isHideEmptyList = false,
  ...rest
}: IFlatListHandler) => {
  const flatList = useRef(null);
  const scrollToTop = () =>
    flatList && flatList.getNode().scrollToOffset({ offset: 0 });

  const keyExtractor = (item: any, index: number) => `item_${index}`;

  const deBouncedOnEndReached = _.debounce(() => {
    // dummy meta obj has current page set to 0. this check is needed in case if meta was not sent to flat list handler
    if (meta && meta.current_page) {
      const { current_page, last_page } = meta;
      if (current_page < last_page) {
        fetchRequest && fetchRequest(true, current_page + 1);
      }
    } else {
      // executing the prev fetch logic
      fetchRequest &&
        data.length % 10 === 0 &&
        fetchRequest(true, data.length / 10 + 1);
    }
  }, 1000);

  const onEndReached = () => deBouncedOnEndReached();
  const onRefresh = () => fetchRequest && fetchRequest(false, 1);

  const renderItem = ({ index }: any) => (
    <View>
      <Text>{`item ${index}`}</Text>
    </View>
  );

  const renderListEmpty = () =>
    !data.length && !isHideEmptyList ? <ListEmpty /> : null;

  const renderListFooter = () => (
    <ListFooter showLoader={isFetching && data.length % 10 === 0} />
  );

  if (isFetching && !data.length) {
    return loader ? loader : <Loader />;
  }

  /* Rendering contains all the basic stuff list needs to render it self what ever extra props is passed to is overridden */
  return (
    <Animated.FlatList
      bounces={true}
      ref={flatList}
      data={data}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefresh}
          colors={['#D3D3D3']}
          tintColor={'#D3D3D3'}
        />
      }
      onEndReached={onEndReached}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={renderListEmpty}
      ListFooterComponent={renderListFooter}
      contentContainerStyle={
        data.length ? {} : [styles.contentContainerStyle, contentContainerStyle]
      }
      scrollEventThrottle={5}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      onScroll={
        nScroll
          ? Animated.event([{ nativeEvent: { contentOffset: { y: nScroll } } }], {
            useNativeDriver: true,
          })
          : undefined
      }
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FlatListHandler;
