import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  MapView,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;

import { removeStorage } from '../utils/authHelpers';
import SubmitPage from './SubmitPage';
import PlacesMobile from '../../index.ios.js';

class MapPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showProgess: false,
      userLat: 1,
      userLng: 1,
      pinLat: 1,
      pinLng: 1,
      delta: 0.00922,
      location: {
        name: 'placeHolder',
        lat: '40',
        lng: '50',
      },
    };
    this.deltaTracker = false;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userLng: position.coords.longitude,
          userLat: position.coords.latitude,
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({
        userLng: position.coords.longitude,
        userLat: position.coords.latitude,
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  submitLocation() {
    this.props.navigator.push({
      component: SubmitPage,
      title: 'Submit Page',
      backButtonTitle: 'Return',
      passProps: {
        handleNavBar: this.props.handleNavBar,
        name: `lat: ${this.state.pinLat} \n long: ${this.state.pinLng}`,
        lat: this.state.pinLat,
        lng: this.state.pinLng,
      },
    });
  }

  handleLogout() {
    removeStorage();
    this.props.navigator.pop();
  }

  center() {
    if (this.deltaTracker) {
      this.setState({
        delta: 0.00922,
        pinLng: this.state.userLng,
        pinLat: this.state.userLat,
      });
      this.deltaTracker = false;
    } else {
      this.setState({
        delta: 0.00921,
        pinLng: this.state.userLng,
        pinLat: this.state.userLat,
      });
      this.deltaTracker = true;
    }
    // this.setState({
    //   pinLng: this.state.userLng,
    //   pinLat: this.state.userLat,
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ height: 800, width: 800 }}
          showsUserLocation={ true }
          region={{
            latitude: this.state.userLat,
            longitude: this.state.userLng,
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
        <View style={{
          position: 'absolute',
          left: 25,
          top: 525,
          backgroundColor: 'transparent',
        }}>
          
          <TouchableHighlight style={styles.center}>
            <Text
              style={styles.centerText}
              onPress={() => { this.center(); }}>
              📍
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => { this.submitLocation(); }}>
              Submit Place
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

export default MapPage;
