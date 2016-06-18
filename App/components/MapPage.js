import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

import SubmitPage from './SubmitPage';

class MapPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showProgess: false,
    };
  }

  hideBar() {
    this.props.handleNavBar(true);
  }

  submitLocation() {
    this.props.navigator.push({
      component: SubmitPage,
      title: 'Submit Page',
      passProps: { hideBar: this.hideBar.bind(this) },
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo}
        source={{uri:'http://2.bp.blogspot.com/-IELsSax8WPg/Tyzsu05V8qI/AAAAAAAAAWU/qbPzat5H2Oc/s400/Map_pin2.png'}} />
        <Text> Logged In </Text>
        <TouchableHighlight style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => { this.submitLocation(); }}>
            Submit Place
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
  button: {

    height: 50,
    backgroundColor: '#48bbec',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },

  buttonText: {
    fontSize: 20,
  },

});

export default MapPage;
