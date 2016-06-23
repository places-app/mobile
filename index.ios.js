 const FBSDK = require('react-native-fbsdk');
 const {
   LoginButton,
   AccessToken,
 } = FBSDK;

 import React, { Component } from 'react';
 import {
   AppRegistry,
   StyleSheet,
   View,
   NavigatorIOS,
 } from 'react-native';

import { setStorage, getStorage } from './App/utils/authHelpers';
import Login from './App/components/Login';

class placesMobile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      showNav: true,
      fbToken: '',
    };
  }

  // componentDidMount() {
  //   getStorage((fbToken) => {
  //     if (fbToken) {
  //       this.setState({
  //         fbToken,
  //       });
  //     }
  //   });
  // }

  handleNavBar(visible) {
    console.log('in handle Nave', visible)
    this.setState({
      showNav: visible,
    });
    setTimeout(()=>console.log("STATE", this.state), 1000)
  }

  render() {
      return (
        <NavigatorIOS
          style={{
            flex: 1,
          }}
          initialRoute={{
            component: Login,
            title: 'Login Page',
            passProps: { handleNavBar: this.handleNavBar.bind(this) },
          }}
          navigationBarHidden={true}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default placesMobile;

AppRegistry.registerComponent('placesMobile', () => placesMobile);
