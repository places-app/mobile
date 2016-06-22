import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS,
} from 'react-native';

class SubmitPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: 'Adam',
      userId: '10',
      location: this.props.location,
      note: '',
      showProgess: false,
    };
  }

  componentDidMount() {
    this.props.handleNavBar(true);
  }


  handleNote(text) {
    this.setState({
      note: text,
    });
  }

  goBack() {
    this.props.navigator.pop();
  }

  submitLocation() {
    this.setState({ showProgess: true });
    const userId = this.state.userId;
    const note = this.state.note;
    const location = this.state.location;
    const self = this;
    console.log('Clicked!');
    console.log(`place is: ${this.state.place}
      note is: ${this.state.note}`);
    const body = {
      userId,
      location,
      note,
    };
    const url = `http://localhost:7000/api/users/${userId}/places`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        self.setState({ showProgess: false });
        self.goBack();
      }
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={{ uri: 'http://2.bp.blogspot.com/-IELsSax8WPg/Tyzsu05V8qI/AAAAAAAAAWU/qbPzat5H2Oc/s400/Map_pin2.png' }}
        />
        <Text> Logged In </Text>
        <Text style={styles.selectedPlace}>
          {this.props.location}
        </Text>
        <TextInput
          onChangeText={(text) => { this.handleNote(text); }}
          style={styles.input}
          placeholder="Note about place"
        />
        <TouchableHighlight style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => { this.submitLocation(); }}
          >
            Submit Place
          </Text>
        </TouchableHighlight>
        {this.state.showProgess ?
          <ActivityIndicatorIOS
            animating={this.state.showProgess}
            size="large"
            style={styles.loader}
          /> : null
        }
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
    marginTop: 40,
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
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ff0066',
  },

  buttonText: {
    fontSize: 20,
  },
  loader: {
    marginTop: 20,
  },
  selectedPlace: {
    fontWeight: 'bold',
    height: 50,
    marginTop: 30,
    padding: 4,
    fontSize: 18,
  },

});

SubmitPage.propTypes = {
  location: React.PropTypes.object,
  handleNavBar: React.PropTypes.func,
  navigator: React.PropTypes.object,
};

export default SubmitPage;
