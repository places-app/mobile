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

import Login from './App/components/Login';
import MapPage from './App/components/MapPage';


class placesMobile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      showNav: true,
    };
  }

  login() {
    this.setState({
      loggedIn: true,
    });
  }

  handleNavBar(visible) {
    this.setState({
      showNav: visible,
    })
  }

  render() {
    if (this.state.loggedIn === true) {
      return (
        <NavigatorIOS
          style={{
            flex: 1,
          }}
          initialRoute={{
            component: MapPage,
            title: 'Map Page',
            passProps: { handleNavBar: 'testProp' },
          }}
          navigationBarHidden={this.state.showNav}
        />
      );
    } else {
      return (
        <View>
          <Login login={ this.login.bind(this) }/>
          <View style={ styles.container }>
            <LoginButton
              publishPermissions={["publish_actions"]}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    alert("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data)
                        // this.logged
                        alert(data.accessToken.toString())
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => alert("logout.")}/>
          </View>
        </View>
      );
    }
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

AppRegistry.registerComponent('placesMobile', () => placesMobile);
