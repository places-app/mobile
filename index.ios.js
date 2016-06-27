import React, { Component } from 'react';
import { AppRegistry, NavigatorIOS } from 'react-native';

import { setStorage, getStorage } from './App/utils/authHelpers';
import Login from './App/components/Login';

class placesMobile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
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

  render() {
    return (
      <NavigatorIOS
        style={{
          flex: 1,
        }}
        initialRoute={{
          component: Login,
          title: 'Login Page',
        }}
        navigationBarHidden
      />
    );
  }
}

export default placesMobile;

AppRegistry.registerComponent('placesMobile', () => placesMobile);
