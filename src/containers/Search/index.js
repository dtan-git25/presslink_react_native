import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, BadgeCount, ButtonView, FlatListHandler, OrdersCard, RangeSlider } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import { pop } from '@nav';
import Modal, { BottomModal, ModalContent } from 'react-native-modals';
import { AirbnbRating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../actions/ServiceAction';
import constant from '@constants';
import { FILTERED_PROVIDERS } from '@actionTypes';
import _ from 'lodash';
import SearchBar from '../../components/SearchBar';


const Search = () => {
  const searchBarRef = useRef()

  const categoryList = useSelector(({ categoryReducer }) => categoryReducer.data)
  const filteredProviderList = useSelector(({ filteredProviderReducer }) => filteredProviderReducer)
  const { data, meta, isFetching } = filteredProviderList
  const dispatch = useDispatch()
  const [state, setState] = useState({
    modelShown: false,
    low: 1,
    showCatModal: false,
    high: 1000,
    rating: 0,
    selectedCategories: [],
    noOfFilters: 0,
  });

  const onValueChange = useCallback((low, high) => {
    // setState({high: high});
    // setState({low: low});
  }, []);


  const filterData = (filteredUser = false, isConcat = false, page = 1,) => {
    const cats = {};
    state.selectedCategories?.map((cat, index) => cats[`category_ids[${index}]`] = cat.id)
    let params1 = {
      page, limit: 10,
    }
    let ratings = state.rating > 0 ? state.rating : ''
    let params2 = {
      search: searchBarRef.current?.getValue(),
      ...(Object.keys(cats).length && cats),
      ratings,
      page, limit: 10,
    }

    dispatch(
      request(
        !filteredUser ? 'user' : 'user?filter=apply',
        constant.serviceTypes.GET,
        !filteredUser ? params1 : params2,
        FILTERED_PROVIDERS,
        false,
        isConcat,
        cbSuccess,
        cbFailure,
        FILTERED_PROVIDERS
      )
    )
  }

  function cbSuccess() { }

  function cbFailure(error) { }


  const filterNumber = () => {
    let filtersNo = 0
    if (state.selectedCategories.length > 0 && state.rating > 0) {
      filtersNo = 2
      setState(s => ({ ...s, noOfFilters: filtersNo }))
    }
    else if (state.selectedCategories.length > 0) {
      filtersNo = 1
      setState(s => ({ ...s, noOfFilters: filtersNo }))
    }
    else if (state.rating > 0) {
      filtersNo = 1
      setState(s => ({ ...s, noOfFilters: filtersNo }))
    }
    else if (state.rating == 0 && state.selectedCategories.length == 0) {
      filtersNo = 0
      setState(s => ({ ...s, noOfFilters: filtersNo }))
    }
  }

  useEffect(() => {
    filterData()
  }, [])


  const onBack = useCallback(() => pop());
  const toggleFilterModal = useCallback(() =>
    setState(s => ({ ...s, modelShown: !s.modelShown }))
  );

  const onApplyPress = () => {
    setState(s => ({ ...s, modelShown: !s.modelShown }))
    filterData(true)
    // if (state.selectedCategories.length > 0 || state.rating > 0) 
    // { filterNumber() }
    filterNumber()
  };

  const toggleCategoryModal = useCallback(() =>
    setState(s => ({ ...s, showCatModal: !s.showCatModal }))
  );

  const toggleModals = useCallback(() => {
    toggleCategoryModal()
  })

  const onResetPress = () => {
    setState(s => ({ ...s, modelShown: !s.modelShown, rating: 0, selectedCategories: [], noOfFilters: 0 }))
    filterData()
  };

  const onRatingPress = useCallback(rate => {
    setState(s => ({ ...s, rating: rate }))
    filterNumber()
  });

  const selectItem = (selectedItem) => () => {
    const { selectedCategories } = state
    if (selectedCategories.indexOf(selectedItem) == -1) {
      const tempArray = [...selectedCategories]
      tempArray.push(selectedItem)
      setState(s => ({ ...s, selectedCategories: tempArray }))

    }
    else {
      const tempArray = [...selectedCategories]
      tempArray.splice(selectedCategories.indexOf(selectedItem), 1)
      setState(s => ({ ...s, selectedCategories: tempArray }))

    }
  }

  const CategoryModal = () => {
    return (
      <>
        <View style={styles.Msg}>
          <Text style={styles.submitedMsgTxt}>Please Select Categories</Text>
          {categoryList.map(item => {
            return (
              <ButtonView onPress={selectItem(item)} style={[styles.keyStyle, { backgroundColor: state?.selectedCategories?.indexOf(item) != -1 ? Colors.bg.lightPurple : Colors.bg.transparent }]}>
                <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
                  {item?.title}
                </Text>
              </ButtonView>
            )
          })}
          <AppButton
            isGradient
            style={{}}
            title={'Done'}
            onPress={toggleModals}
          />
        </View>
      </>
    )
  }

  const BottomSheetHeader = () => {
    return (
      <View style={styles.bottomSheetHeader}>
        <Text style={styles.heading}>FILTER BY</Text>
        <ButtonView onPress={toggleFilterModal}>
          <Image source={Images.icCross} />
        </ButtonView>
      </View>
    );
  };

  const SliderComponent = () => {
    return (
      <View style={styles.boxView}>
        <Text style={styles.labels}>Distance (miles)</Text>
        <RangeSlider
          min={1}
          max={1000}
          step={10}
          thumbRadius={10}
          thumbBorderColor={Colors.primary.violet}
          blankColor={Colors.border.white}
          thumbColor={Colors.primary.violet}
          selectionColor={Colors.primary.violet}
          labelBackgroundColor={Colors.primary.violet}
          // valueChanged={onValueChange}
          labelBottomTextColor={{ ...AppStyles.gbSb(14, Colors.txt.mGrey) }}
        />
      </View>
    );
  };

  const RatingComponent = () => {
    return (
      <View style={styles.boxView}>
        <Text style={styles.labels}>Ratings</Text>
        <AirbnbRating
          starContainerStyle={styles.airbnbCont}
          onFinishRating={onRatingPress}
          count={5}
          showRating={false}
          selectedColor={Colors.primary.orangeYellow}
          defaultRating={state.rating}
          size={35}
        />
      </View>
    );
  };

  const CategoryComponent = () => {
    return (
      <View style={styles.boxView}>
        <ButtonView style={styles.horizontalContainer} onPress={toggleModals} >
          <Text style={styles.labels}>Categories</Text>
          <View style={styles.arrowStyle}>

            <Image
              style={{ ...AppStyles.imgStyle, }}
              resizeMode={'contain'}
              source={Images.icRightArrow}
            />

          </View>
        </ButtonView>
        <ButtonView onPress={toggleModals} style={[styles.categoryView]}>
          <View style={styles.catStyle}>
            {state?.selectedCategories?.map(x => {
              return (
                <Text style={styles.selectedCategories}>
                  {x.title + ","}
                </Text>
              )
            })}
          </View>

        </ButtonView >
      </View >
    );
  };

  const renderItem = ({ item, index }) => (
    <OrdersCard key={index} data={item} />
  )

  const ButtonsComponent = () => {
    return (
      <View style={styles.buttonsView}>
        <AppButton
          style={styles.buttonStyle}
          title={'Reset'}
          onPress={() => onResetPress()}
        />
        <AppButton
          isGradient
          style={styles.buttonStyle}
          title={'Apply'}
          onPress={onApplyPress}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <SearchBar
            ref={searchBarRef}
            cbOnSearch={_.debounce(() => filterData(true), 300)}
            onFilterPress={toggleFilterModal}
            badgeCount={state.noOfFilters}
            onBack={onBack}
          />
        </View>
        <View style={styles.containerOrders}>
          <FlatListHandler
            data={data}
            renderItem={renderItem}
            style={styles.flex}
            isFetching={isFetching}
            meta={meta}
            fetchRequest={() => state.selectedCategories.length > 0 || state.rating != 0 || searchBarRef.current?.getValue() != '' ? filterData(true) : filterData(false)}
            numColumns={2}
          />
        </View>

        <Modal
          visible={state.showCatModal}
        // onTouchOutside={toggleCategoryModal}
        >
          <ModalContent style={styles.modalContent}>
            <CategoryModal />
          </ModalContent>
        </Modal>
        <BottomModal
          overlayBackgroundColor={'#2a2e43'}
          visible={state.modelShown}
        >
          <ModalContent>
            <BottomSheetHeader />
            <SliderComponent />
            <CategoryComponent />
            <RatingComponent />
            <ButtonsComponent />
          </ModalContent>
        </BottomModal>

      </View>

    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  bottomSheetHeader: {
    alignItems: 'center',
    paddingVertical: Metrics.smallMargin,
    borderBottomWidth: 1,
    borderColor: Colors.border.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: Metrics.smallMargin,
  },
  ordersList: { paddingTop: Metrics.baseMargin },
  heading: {
    ...AppStyles.gbSb(14, Colors.txt.lGrey),
    color: Colors.txt.vdGrey,
    letterSpacing: 0.7,
    textAlign: 'left',
  },
  airbnbCont: {
    alignSelf: 'flex-start',
    marginVertical: Metrics.baseMargin,
  },
  safeArea: { flex: 1, backgroundColor: Colors.bg.white },
  container: { flex: 1, backgroundColor: Colors.bg.bg, },
  containerHeader: {
    backgroundColor: Colors.bg.white,
    padding: Metrics.baseMargin,
    justifyContent: 'center'
  },
  containerSearchbar: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.bg,
    padding: Metrics.smallMargin,
    borderRadius: Metrics.smallMargin,
  },
  containerBackImg: {
    backgroudColor: 'red',
    paddingTop: Metrics.widthRatio(7),
    paddingRight: Metrics.baseMargin,
  },
  containerFilterImg: {
    backgroudColor: 'red',
    paddingTop: Metrics.widthRatio(4),
    paddingRight: Metrics.baseMargin,
  },
  txtInput: {
    flex: 1,
    paddingRight: Metrics.baseMargin,
    paddingTop: Metrics.widthRatio(2),
    ...AppStyles.gbRe(14, Colors.txt.vdGrey),
  },
  catStyle: { flex: 2, flexDirection: 'row', flexWrap: 'wrap' },
  labels: {
    // marginTop: Metrics.baseMargin,
    ...AppStyles.gbSb(16, Colors.txt.slateGrey),
    textAlign: 'left',
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
  },
  submitedMsgTxt: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    marginBottom: Metrics.smallMargin,
  },
  keyStyle: {
    paddingVertical: Metrics.heightRatio(15),
    borderBottomColor: '#aaa',
    borderBottomWidth: 0.3,
    paddingHorizontal: Metrics.heightRatio(10)
  },

  arrowStyle: { flex: 0.1, alignItems: 'center', justifyContent: 'flex-start' },

  boxView: {
    borderBottomColor: Colors.border.white,
    borderBottomWidth: 1,
    padding: Metrics.smallMargin,
  },
  slider: {
    height: Metrics.heightRatio(80),
  },
  modalContent: {
    width: Metrics.heightRatio(270)
    // width: '90%'
  },
  selectedCategories: {
    color: Colors.primary.violet,
    marginTop: Metrics.smallMargin,
  },
  horizontalContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: Metrics.heightRatio(10) },

  categoryView: { justifyContent: 'space-between', flexDirection: 'row' },

  buttonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerOrders: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    justifyContent: 'center'
  },

  buttonStyle: {
    height: Metrics.heightRatio(45),
    borderRadius: 5,
    width: Metrics.screenWidth / 2.3,
  },
});
