import React, { useCallback, useEffect,  } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  ButtonView,
  FlatListHandler,
  ImageHandlerUpdated,
} from '@reuseableComponents';
import { AppStyles, Colors, Metrics } from '@theme';
import { push } from '@nav';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '@serviceAction';
import constant from '@constants';
import { CATEGORY } from '@actionTypes';

const Categories = props => {
  const { isHorizontal } = props;
  const dispatch = useDispatch()
  const getCategories = () => {
    dispatch(
      request(
        constant.categoryList,
        constant.serviceTypes.GET,
        {},
        CATEGORY,
        false,
        false,
        cbCategorySuccess,
        cbCategoryFailure,
        CATEGORY
      )
    )
  }

  function cbCategorySuccess(res) { }

  function cbCategoryFailure() { }
  useEffect(() => {
    getCategories()
  }, [])


  const data = useSelector(({ categoryReducer }) => categoryReducer.data)
  const baseWidth = Metrics.screenWidth / 3;
  const width = baseWidth - Metrics.smallMargin * 2;
  const onService = useCallback((title, slug) => () => push('OrdersGrid', { title, slug }), []);

  const renderItem = ({ item }) => (
    < ButtonView
      style={{ ...styles.containerCard, width }
      }
      onPress={onService(item.title, item.slug)} >
      <ImageHandlerUpdated
        source={{ uri: item.image_url }}
        style={{
          width,
          height: width,
          ...styles.img,
        }}
      />
      <View style={styles.containerTitle}>
        <Text style={styles.txtTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
      </View>
    </ButtonView >
  );

  return (
    <View
      style={{
        ...(!isHorizontal && styles.container),
      }}>
      <FlatListHandler
        numColumns={isHorizontal ? undefined : 3}
        horizontal={isHorizontal}
        bounces={false}
        data={data}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.bg.bg,
  },
  containerCard: {
    marginRight: Metrics.smallMargin,
    marginBottom: Metrics.smallMargin,
  },
  containerTitle: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    borderRadius: Metrics.smallMargin,
    ...AppStyles.centerAligned,
    backgroundColor: Colors.translucent,
  },
  txtTitle: {
    ...AppStyles.gbSb(14, Colors.bg.white),
    marginTop: Metrics.heightRatio(52),
  },
  img: { borderRadius: Metrics.smallMargin, resizeMode: 'contain' },
});
