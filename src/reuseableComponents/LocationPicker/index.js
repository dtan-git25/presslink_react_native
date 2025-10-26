import React, { Component } from "react";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import PropTypes from "prop-types";
import _ from "lodash";
import { AppButton, FlashMessage, ToastMessage } from "../../reuseableComponents";
import GooglePlacesAutocomplete from "./GooglePlacesAutoComplete";
import { Metrics, Colors, AppStyles, Images } from "../../theme";
import { WithKeyboardListener } from "../../hooks";
import customMapStyles from "../../constants/MapStyle";
import utility from "../../utility";
import { navigate, pop } from "../../services/NavigationService";

DELTAS = {
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121
};
const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  ...DELTAS
};

class LocationPicker extends Component {
  static propTypes = {
    location: PropTypes.object,
    cbOnLocationPicked: PropTypes.func,
    isKeyboardVisible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    // let address = undefined;
    // let latitude = undefined;
    // let longitude = undefined;
    // if (
    //   this.props.navigation.state.params &&
    //   this.props.navigation.state.params.location
    // ) {
    //   address = this.props.navigation.state.params.location.address;
    //   latitude = this.ation.lnprops.navigation.state.params.location.lat;
    //   longitude = this.props.navigation.state.params.locg;
    // }
    this.state = {
      address: null,
      latitude: null,
      longitude: null,
      isAddressPickedFromGooglePlacesSearch: false,
      isOrientationPotrait: true
    };
  }

  mapRef = ref => (this.map = ref);

  // onMapPress(e) {
  //   console.log('e  ???/', e.nativeEvent)
  //   const { longitude, latitude } = e.nativeEvent.coordinate;
  //   this.setState({ longitude, latitude });
  // }


  renderMap() {
    // const width = Utils.getDeviceWidth();
    // const height = Utils.getDeviceHeight();
    const { address, latitude, longitude } = this.state;
    return (
      <MapView
        ref={this.mapRef}
        // provider={PROVIDER_GOOGLE}
        // customMapStyle={customMapStyles}
        style={[styles.map]}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={this.onRegionChangeComplete}
        onMapReady={this.onMapReady}
      // onPress={e => this.onMapPress(e)}
      >
        {!utility.isNull(address) &&
          <Marker coordinate={{ latitude: latitude, longitude: longitude }}

          // onDragEnd={e => log('onDragEnd', e)}
          // draggable
          // pinColor={Colors.primary.gold}
          ></Marker>
        }

      </MapView>
    );
  }

  onMapReady = () => {
    if (this.state.latitude && this.state.longitude) {
      this.map.animateToRegion(
        {
          ...this.state,
          latitude: +this.state.latitude,
          longitude: +this.state.longitude,
          ...DELTAS
        },
        1000
      );
    }
  };

  onRegionChangeComplete = region => {
    this.setState({
      latitude: region.latitude,
      longitude: region.longitude,
      isAddressPickedFromGooglePlacesSearch: false
    });
  };

  animateToRegion = (region, animationTime = 2000) =>
    region.latitude &&
    region.longitude &&
    this.map.animateToRegion({ ...region, ...DELTAS }, animationTime);

  renderPlacesInput() {
    return (
      <GooglePlacesAutocomplete
        cbOnLocationPicked={this._cbOnLocationPicked}
        address={this.state.address}
      />
    );
  }

  _cbOnLocationPicked = objLocation => {
    // animate to region is setting isAddressPickedFromGooglePlacesSearch
    // to false so setting isAddressPickedFromGooglePlacesSearch after animate to region
    // to use it later
    this.setState(
      {
        latitude: objLocation.latitude,
        longitude: objLocation.longitude,
        address: objLocation.address
      },
      () => {
        this.animateToRegion(
          {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          },
          50
        );
        setTimeout(() => {
          this.state.isAddressPickedFromGooglePlacesSearch = true;
        }, 2000);
      }
    );
  };

  renderDoneButton() {
    return !this.props.isKeyboardVisible ? (
      <SafeAreaView style={styles.containerAppButton}>
        <AppButton style={{ width: "100%", }} title="Done" onPress={this.onSaveLocation} />
      </SafeAreaView>
    ) : null;
  }

  onSaveLocation = () => {

    const { address, longitude, latitude } = this.state;
    if (utility.isNull(address)) {
      FlashMessage({ message: "Please select address!" });
      return
    } else {
      if (this.props?.route?.params?.forCheckoutAddress) {
        this.props?.route.params.cbOnEditLocation(this.state)
        // navigate('ServiceCheckout', { address: { address, longitude, latitude } });
        pop()
      }

    }

  };




  // detecting orientation change and pushing current orientation to redux.
  onLayout = ev => {
    const { width, height } = ev.nativeEvent.layout;
    const isOrientationPotrait = height > width;
    this.setState({ isOrientationPotrait });
  };

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {this.renderMap()}
        {this.renderPlacesInput()}
        {this.renderDoneButton()}
      </View>
    );
  }
}

export default WithKeyboardListener(LocationPicker);

const styles = {
  container: { flex: 1 },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  containerAppButton: {
    flexDirection: "row",

    // padding: Metrics.baseMargin,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    margin: Metrics.baseMargin,
  },
  containerPointer: {
    position: "absolute",
    ...AppStyles.centerAligned
  },
  icPointer: {
    width: Metrics.heightRatio(35),
    height: Metrics.heightRatio(35),
    resizeMode: "contain",
    marginBottom: Metrics.heightRatio(50)
  }
};
