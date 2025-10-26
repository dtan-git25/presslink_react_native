import React, { PureComponent } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"; // use version 1.3.0 of this library
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import { ButtonView } from "../../../reuseableComponents";
import { Images, Metrics, Colors, AppStyles, Fonts } from "../../../theme";

import constant, { API_KEY_GOOGLE } from "../../../constants";

import { hideSpinner, showSpinner } from "react-native-globalspinner";


function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

export default class GooglePlacesAutoComplete extends PureComponent {
  static propTypes = {
    address: PropTypes.string,
    cbOnLocationPicked: PropTypes.func
  };

  componentDidMount() {
    this.props.address &&
      this.props.address.length &&
      this.setAddress(this.props.address);
  }

  renderRow(row) {
    return (
      <View style={styles.containerListItem}>
        <Text style={styles.txtPlaces}>{row.description}</Text>
      </View>
    );
  }

  setAddress = address => {
    this.googlePlacesAutocomplete.setAddressText(address);
  };

  onClear = () => {
    this.googlePlacesAutocomplete.setAddressText("");
  };

  renderRightButton = () => {
    return (
      <ButtonView onPress={this.onClear} style={styles.containerClear}>
        <Image source={Images.icCross} style={styles.icClear} />
      </ButtonView>
    );
  };

  onItemSelected = (data, details = null) => {

    details &&
      details.geometry &&
      details.geometry.location &&
      details.geometry.location.lat &&
      data &&
      data.description &&
      this.props.cbOnLocationPicked &&
      this.props.cbOnLocationPicked({
        ...details.geometry.location,
        address: data.description
      });
  };

  getAddress = (details) => {
    showSpinner();
    const { description } = details;
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      description +
      '&key=' +
      constant.GOOGLE_PLACES_API_KEY,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          const { geometry } = responseJson.results[0];
          const { lat, lng } = geometry.location;

          let address = {};
          address.address = description;
          address.latitude = lat;
          address.longitude = lng;

          this.props.cbOnLocationPicked(address);


          hideSpinner();
        }
      });
  }




  render() {
    return (
      <GooglePlacesAutocomplete
        ref={ref => (this.googlePlacesAutocomplete = ref)}
        placeholder="Search"

        debounce={200}
        minLength={2}
        autoFocus={false}
        listViewDisplayed="auto"
        fetchDetails
        renderRow={this.renderRow}
        getDefaultValue={() => ""}
        // onPress={this.onItemSelected}

        onPress={(data, details = null) => {
          this.getAddress(data);
        }}

        query={{
          key: constant.GOOGLE_PLACES_API_KEY,
          language: "en"
        }}
        textInputProps={{
          placeholderTextColor: Colors.primary.white,
        }}

        styles={{
          textInput: styles.textInput,
          container: {
            ...styles.autocompleteContainer,
          },
          separator: styles.separator,
        }}
        // styles={styles.placesInput}
        nearbyPlacesAPI="GooglePlacesSearch"
        GoogleReverseGeocodingQuery={{}}
        GooglePlacesSearchQuery={{}}
        GooglePlacesDetailsQuery={{
          fields: "formatted_address"
        }}
        filterReverseGeocodingByTypes={[
          "locality",
          "sublocality",
          "postal_code",
          "country",
          "administrative_area_level_1",
          "administrative_area_level_2",
          "administrative_area_level_3"
        ]}
        renderRightButton={this.renderRightButton}
        enablePoweredByContainer={false}
      />
    );
  }
}

const styles = {
  placesInput: {
    textInputContainer: {
      // width: "100%",
      // backgroundColor: Colors.primary.darkBlueGrey,
      // marginTop: 8,
      // borderRadius: 4,
      padding: 10,
      // backgroundColor: '#eee',
      marginVertical: 5,
      flexDirection: 'row',
      height: 55,
      borderRadius: 10,

      borderWidth: 1,
      borderColor: Colors.primary.darkBlueGrey,
      color: Colors.primary.transparent

    },
    description: {
      fontWeight: "bold"
    },
    row: {
      flexDirection: "row",
      backgroundColor: Colors.primary.darkBlueGrey,
      // paddingRight: Metrics.doubleBaseMargin,
      // paddingLeft: Metrics.smallMargin,
      // paddingVertical: Metrics.smallMargin
    },
    container: {
      // flex: 1,
      position: "absolute",
      alignSelf: "center",
      backgroundColor: Colors.primary.darkBlueGrey,
      right: 10,
      left: 10,

      marginTop: Metrics.baseMargin,
      zIndex: 1
    }
  },
  textInput: {
    padding: 10,
    // backgroundColor: '#eee',
    // marginVertical: 5,
    flexDirection: 'row',
    height: 55,
    borderRadius: 10,
    backgroundColor: Colors.primary.darkBlueGrey,
    borderWidth: 1,
    borderColor: Colors.primary.darkBlueGrey,
    color: Colors.primary.white
  },
  separator: {
    // backgroundColor: Colors.primary.blueGrey,
    // height: 1,
    // marginBottom: Metrics.smallMargin,
  },
  listView: {
    position: 'absolute',
    top: 105,
    backgroundColor: Colors.primary.theme
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    margin: Metrics.baseMargin
  },

  containerClear: {
    ...AppStyles.centerAligned,
    position: "absolute",
    right: 0,
    marginVertical: Metrics.baseMargin,

    paddingHorizontal: Metrics.smallMargin
  },
  icClear: {
    width: Metrics.heightRatio(20),
    height: Metrics.heightRatio(20)
  },
  containerListItem: {

    // backgroundColor: Colors.primary.theme,
    margin: 0,
  },
  txtPlaces: {
    // ...Fonts.Bold(15),
    color: Colors.primary.blueGrey,
    // ...AppStyles.robotoRe(),
    margin: 0,
    // backgroundColor: Colors.primarthe,
    //
  }
};
