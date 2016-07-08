const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken } = FBSDK;
import Icon from 'react-native-vector-icons/FontAwesome';

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  StatusBar,
} from 'react-native';

import MapPage from './MapPage';
import axios from 'axios';
import { setStorage, getStorage } from '../utils/authHelpers';

const host = '162.243.211.18';
// const host = 'localhost';
// const host = '10.8.28.177';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showProgess: false,
      fbToken: '',
    };
  }

  componentWillMount() {
    getStorage((result) => {
      if (result) {
        console.log(result);
        this.props.navigator.push({
          component: MapPage,
          title: 'Map Page',
          passProps: {
            userId: +result,
          },
      });
    }
  });
  }

  handleSubmit() {
    this.props.navigator.push({
      component: MapPage,
      title: 'Map Page',
    });
  }


  // handleTest() {

  //   fetch(`http://localhost:7000/test`)
  //     .then(response => console.log(response));
  // }

  // logToken() {
  //   console.log('token stored: ', getStorage((r)=>console.log(r)))
  //   console.log('local token: ', this.props.fbToken)
  // }

  render() {
    return (
        <Image
          source={{ uri: 'https://gaijinpot.scdn5.secure.raxcdn.com/wp-content/uploads/sites/4/2014/08/Shibuya_Night.jpg' }}
          style={styles.backgroundImage}
        >
          <StatusBar hidden={true} />
          <View style={styles.backdrop}>
              <Text style={styles.heading}> Places </Text>
          </View>
              <LoginButton
                style={styles.login}
                publishPermissions={['publish_actions']}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      alert(`login has error: ${result.error}`);
                    } else if (result.isCancelled) {
                      alert('login is cancelled.');
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (fbRes) => {
                          console.log(fbRes);

                          this.setState({
                            fbToken: fbRes.accessToken.toString(),
                          });


                          const config = {
                            url: `http://${host}:7000/auth/facebook/token?access_token=${this.state.fbToken}`,
                            method: 'get',
                          };

                          axios(config)
                          .then(({ data }) => {
                            setStorage(JSON.stringify(data.id), () => {
                            });

                            this.props.navigator.push({
                              component: MapPage,
                              title: 'Map Page',
                              passProps: {
                                userId: data.id,
                              },
                            });
                          });
                        }
                      );
                    }
                  }
                }
                onLogoutFinished={() => alert('logout.')}
              />
        </Image>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
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
    fontSize: 60,
    marginTop: 40,
    color: '#cfd8dc',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ff0066',
  },
  login: {
    width: 200,
    height: 50,
    top: height * 0.60,
  },
  button: {

    height: 50,
    backgroundColor: '#9fa8da',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },

  buttonText: {
    fontSize: 20,
  },

});

Login.propTypes = {
  navigator: React.PropTypes.object,
};

export default Login;
