import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  MapView,
} from 'react-native';

import { removeStorage } from '../utils/authHelpers';
import SubmitPage from './SubmitPage';
import CameraPage from './CameraPage';
import { GOOGLE_PL_KEY } from '../config/apiKey';
const { GooglePlacesAutocomplete } = require('react-native-google-places-autocomplete');

class MapPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showProgess: false,
      mapCenterLat: 1,
      mapCenterLng: 1,
      userLat: 1,
      userLng: 1,
      pinLat: 1,
      pinLng: 1,
      delta: 0.00922,
      location: {
        gPlaceId: undefined,
        name: undefined,
        lat: '40',
        lng: '50',
      },
    };
    this.deltaTracker = false;
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userLng: position.coords.longitude,
          userLat: position.coords.latitude,
          mapCenterLng: position.coords.longitude,
          mapCenterLat: position.coords.latitude,
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({
        userLng: position.coords.longitude,
        userLat: position.coords.latitude,
        mapCenterLng: position.coords.longitude,
        mapCenterLat: position.coords.latitude,
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  clearName() {
    this.setState({
      name: undefined,
    });
  }

  submitLocation() {
    this.props.navigator.push({
      component: SubmitPage,
      title: 'Submit Page',
      backButtonTitle: 'Return',
      passProps: {
        userId: this.props.userId,
        gPlaceId: this.state.gPlaceId,
        name: this.state.name,
        lat: this.state.pinLat,
        lng: this.state.pinLng,
        clearName: this.clearName.bind(this),
      },
    });
  }

  submitWithCamera() {
    this.props.navigator.push({
      component: CameraPage,
      title: 'Camera Page',
      backButtonTitle: 'Return',
      passProps: {
        userId: this.props.userId,
        gPlaceId: this.state.gPlaceId,
        name: this.state.name,
        lat: this.state.pinLat,
        lng: this.state.pinLng,
        clearName: this.clearName.bind(this),
      },
    });
  }

  handleLogout() {
    // removeStorage();
    this.props.navigator.pop();
  }

  centerPin(newLat, newLng) {
    if (this.deltaTracker) {
      this.setState({
        delta: 0.00922,
        pinLng: newLat,
        pinLat: newLng,
        mapCenterLng: newLng,
        mapCenterLat: newLat,
      });
      this.deltaTracker = false;
    } else {
      this.setState({
        delta: 0.00921,
        pinLng: newLat,
        pinLat: newLng,
        mapCenterLng: newLng,
        mapCenterLat: newLat,
      });
      this.deltaTracker = true;
    }
  }

  render() {
    return (

      <View style={styles.container}>
        <MapView
          style={{ height: 800, width: 800 }}
          showsUserLocation
          region={{
            latitude: this.state.mapCenterLat,
            longitude: this.state.mapCenterLng,
            latitudeDelta: this.state.delta,
            longitudeDelta: this.state.delta,
          }}

          onRegionChange={
            (e) => {
              this.setState({
                pinLng: e.longitude,
                pinLat: e.latitude,
              }); }
          }

          annotations={[{
            latitude: this.state.pinLat,
            longitude: this.state.pinLng,
            title: 'Save Place?',
            subtitle: 'Click Submit to Share',
            tintColor: 'purple',
          }]}

        />
        <View style={styles.searchContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            fetchDetails
            enablePoweredByContainer={false}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              // console.log(data);
              // console.log(data.id);
              // console.log(details.name);
              // console.log(details.geometry.location.lat);
              // console.log(details.geometry.location.lng);

              this.setState({
                gPlaceId: data.place_id,
                name: details.name,
              });

              this.centerPin(details.geometry.location.lat, details.geometry.location.lng);
            }}
            getDefaultValue={() => ''} // text input default value
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_PL_KEY,
              language: 'en', // language of the results
              location: {
                latitude: JSON.stringify(this.state.location.lat),
                longitude: JSON.stringify(this.state.location.lng),
              },
              radius: '20',
              // types: '(establishment)', // default: 'geocode'
            }}
            styles={{
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GooglePlacesSearch
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              types: 'food',
            }}

            // predefinedPlaces={[homePlace, workPlace]}
          />
        </View>
        <View style={{
          position: 'absolute',
          left: 25,
          top: 525,
          backgroundColor: 'transparent',
        }}>
          <TouchableHighlight style={styles.center}>
            <Text
              style={styles.centerText}
              onPress={() => { this.centerPin(this.state.userLat, this.state.userLng); }}
            >
              📍
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={() => { this.submitLocation(); }}
          >
            <Text
              style={styles.buttonText}
            >
              Save Place
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  searchContainer: {
    left: 25,
    top: 55,
    width: 325,
    position: 'absolute',
    backgroundColor: '#9966ff',
  },
  logo: {
    marginTop: 40,
    width: 100,
    height: 100,
  },
  button: {

    height: 50,
    width: 325,
    backgroundColor: '#9966ff',
    borderRadius: 10,
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },

  buttonText: {
    fontSize: 20,
    color: 'white',
  },

  center: {
    left: 320,
    width: 25,
    backgroundColor: '#9966ff',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerText: {
    fontSize: 20,
    color: 'white',
  },

});

MapPage.propTypes = {
  navigator: React.PropTypes.object,
  userId: React.PropTypes.number,
};

export default MapPage;
