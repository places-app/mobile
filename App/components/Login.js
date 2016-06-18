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
} from 'react-native';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showProgess: false,
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

  handleSubmit() {
    const username = this.state.username;
    const password = this.state.password;

    fetch('http://localhost:3000/test',
      {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    .then((response) => response.json())
    .then((result) => {
      // console.log('in response', result)
      AlertIOS.alert(
          'POST Response',
          `Username -> + ${result.username} \nPassword -> ${result.password}`,
          () => this.props.login()
      );
    })
    .done();
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
