const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK;

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  AlertIOS,
  ActivityIndicatorIOS,
  NavigatorIOS,
} from 'react-native';

import MapPage from './MapPage';
import { setStorage, getStorage } from '../utils/authHelpers';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      showProgess: false,
      fbToken: '',
    };
  }

  handlePassword(text) {
    this.setState({
      password: text,
    });
  }

  handleUsername(text) {
    this.setState({
      username: text,
    });
  }

  login() {
    this.setState({
      loggedIn: true,
    });
  }

  handleNavBar(val) {
    this.props.handleNavBar(val);
  }


  handleSubmit() {
    this.props.navigator.push({
      component: MapPage,
      title: 'Map Page',
      passProps: { handleNavBar: this.handleNavBar.bind(this) },
    });
  }

  handleTest() {

    fetch(`http://10.8.28.194:7000/test`)
      .then(response => console.log(response));
  }

  logToken() {
    console.log('token stored: ', getStorage((r)=>console.log(r)))
    console.log('local token: ', this.props.fbToken)
  }


  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo}
        source={{ uri:'http://2.bp.blogspot.com/-IELsSax8WPg/Tyzsu05V8qI/AAAAAAAAAWU/qbPzat5H2Oc/s400/Map_pin2.png' }} />
        <Text style={styles.heading}> Places </Text>
        <TextInput
          onChangeText={(text) => { this.handleUsername(text); }}
          style={styles.input}
          placeholder='Username' />
        <TextInput
          onChangeText={(text) => { this.handlePassword(text); }}
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true} />

        <TouchableHighlight style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => { this.handleSubmit(); }}>
            Log In
          </Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => { this.handleTest(); }}>
            TEST
          </Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => { this.logToken(); }}>
            Display Login Token
          </Text>
        </TouchableHighlight>

        <View>
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
                        console.log(data);

                        this.setState({
                          fbToken: data.accessToken.toString(),
                        });

                        setStorage(JSON.stringify(data.accessToken), () => {
                        
                        });

                        fetch(`http://10.8.28.194:7000/auth/facebook/token?access_token=${this.state.fbToken}`)
                          .then(response => {
                            this.props.navigator.push({
                              component: MapPage,
                              title: 'Map Page',
                              passProps: { handleNavBar: this.handleNavBar.bind(this) },
                            });
                          });

                        // alert(data.accessToken.toString());
                      }
                    );
                  }
                }
              }
              onLogoutFinished={() => alert("logout.")}/>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 40,
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  heading: {
    fontSize: 30,
    marginTop: 10,
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ff0066',
  },
  button: {

    height: 50,
    backgroundColor: '#ff0066',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },

  buttonText: {
    fontSize: 20,
  },

});

export default Login;
