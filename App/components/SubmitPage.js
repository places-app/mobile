import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS,
  NativeModules,
  Dimensions,
} from 'react-native';

import CameraPage from './CameraPage';
import axios from 'axios';
import { GOOGLE_GEO_KEY } from '../config/apiKey';
import Icon from 'react-native-vector-icons/FontAwesome';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class SubmitPage extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      username: 'Adam',
      userId: this.props.userId,
      location: {
        gPlaceId: props.gPlaceId,
        name: props.name,
        lat: props.lat,
        lng: props.lng,
      },
      filePath: '',
      note: '',
      showProgess: false,
    };
  }

  componentWillMount() {
    let place = this.props.name;

    if (place === undefined) {
      const lat = JSON.stringify(this.state.location.lat);
      const lng = JSON.stringify(this.state.location.lng);

      const config = {

        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_GEO_KEY}`,

        method: 'get',

      };

      axios(config)
      .then(({ data }) => {
        if (data.results !== undefined) {
          place = data.results[0].formatted_address; // need to handle if this is not there
        } else {
          place = 'Could not resolve address';
        }

        this.setState({
          location: {
            name: place,
            lat: this.state.location.lat,
            lng: this.state.location.lng,
          },
        });
      });
    } else {
      // double check ** might be redundant to setting state during initialization
      this.setState({
        location: {
          gPlaceId: this.state.location.gPlaceId,
          name: place,
          lat: this.state.location.lat,
          lng: this.state.location.lng,
        },
      });
    }
  }

  handleNote(text) {
    this.setState({
      note: text,
    });
  }

  goBack() {
    this.props.navigator.pop();
    this.props.clearName();
  }

  addVideo() {
    this.props.navigator.push({
      component: CameraPage,
      title: 'Camera Page',
      backButtonTitle: 'Return',
      passProps: {
        userId: this.state.userId,
        gPlaceId: this.state.location.gPlaceId,
        name: this.state.location.name,
        lat: this.state.location.lat,
        lng: this.state.location.lng,
        note: this.state.note,
        returnProps: this.returnProps.bind(this),
      },
    });
  }

  returnProps(filePath, note) {
    this.setState({
      filePath,
      note,
    });
  }

  submitLocation() {
    this.setState({ showProgess: true });
    const userId = this.state.userId;
    const note = this.state.note;
    const location = this.state.location;
    const { name, lat, lng, gPlaceId } = this.state.location;
    const self = this;
    console.log('Clicked!');
    console.log(`
      place is: ${location.name}
      note is: ${this.state.note}
      gplaceid is: ${location.gPlaceId}
    `);
    const body = {
      userId,
      name,
      lat,
      lng,
      gPlaceId,
      note,
    };
    // uncomment for deployed live server
    // const url = `http://162.243.211.18:7000/api/users/${userId}/places`;
    // uncomment for HR wifi ip
    // const url = `http://10.8.28.176:7000/api/users/${userId}/places`;
    // const url = `http://10.8.28.176:7000/api/users/${userId}/places`;
    const url = `http://162.243.211.18:7000/api/users/${this.state.userId}/places`;
    // const url = `http://10.8.28.177:7000/api/users/${this.state.userId}/places`;

    const obj = {
      uri: this.state.filePath,
      // either an 'assets-library' url (for files from photo library) or an image dataURL
      uploadUrl: url,
      fileName: `${body.userId}-${body.name}`,
      // should match the name 'file' for multer
      fileKey: 'file',
      mimeType: 'video/quicktime',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: body,
    };

    if (this.state.filePath) {
      NativeModules.FileTransfer.upload(obj, (err, res) => {
        // handle response
        // if the file path protocol is not supported the status will be 0
        // and the request won't be made at all
        if (res.status === 0) {
          console.log('File path protocal is not supported');
        }
        // it is an object with 'status' and 'data' properties
        if (res) {
          if (res.status === 201 || res.status === 202) {
            self.setState({ showProgess: false });
            self.goBack();
          }
        } else {
          console.log(err);
        }
      });
    } else {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      .then((response) => {
        console.log(response);
        if (response.status === 201 || response.status === 202) {
          self.setState({ showProgess: false });
          self.goBack();
        }
      })
      .catch((error) => {
        console.warn(error);
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <TouchableHighlight
            style={styles.navButton}
            onPress={() => { this.goBack(); }}
          >
            <Text style={styles.navText}>
              <Icon name="arrow-left" size={35} color="white" />
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.navCamera}
            onPress={() => { this.addVideo(); }}
          >
            <Icon
              name="camera"
              size={45}
              color={this.state.filePath.length === 0 ? 'black' : 'green'}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.main}>
          <Image
            style={styles.logo}
            source={{ uri: 'http://www.glpapp.com/assets/img/compass.png' }}
          />
          <Text style={styles.placeIntro}>
            Your Place
          </Text>
          <Text style={styles.selectedPlace}>
            {this.state.location.name}
          </Text>
          <TextInput
            onChangeText={(text) => { this.handleNote(text); }}
            style={styles.input}
            multiline
            blurOnSubmit
            placeholder="Enter note..."
          />
          <TouchableHighlight
            style={{
              top: height * 0.08,
              height: 50,
              alignSelf: 'stretch',
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: this.state.note.length === 0 ? '#9EA2A3' : 'black',
            }}
            onPress={() => { this.submitLocation(); }}
            disabled={this.state.note.length === 0 ? true : false}
          >
            <Text
              style={{
              fontSize: 20,
              color: this.state.note.length === 0 ? '#404242' : 'white',
            }}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cfd8dc',
  },
  main: {
    alignItems: 'center',
    backgroundColor: '#cfd8dc',
    paddingTop: 40,
    padding: 10,
  },
  logo: {
    marginTop: 20,
    width: 100,
    height: 100,
  },
  input: {
    top: height * 0.05,
    backgroundColor: 'white',
    color: 'black',
    height: 150,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#607d8b',
  },
  loader: {
    top: 60,
  },
  placeIntro: {
    fontWeight: 'bold',
    top: 25,
    fontSize: 20,
  },
  selectedPlace: {
    // fontWeight: 'bold',
    color: 'black',
    height: 50,
    marginTop: 30,
    padding: 4,
    fontSize: 18,
    // textShadowColor: 'blue',
    // textShadowRadius: 1,
    // textShadowOffset: {width: 0.5, height: 0.5}
  },
  nav: {
    height: 75,
    backgroundColor: '#607d8b',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  navText: {
    fontSize: 50,
    paddingTop: 15,
    color: 'white',
  },

  navButton: {
    paddingTop: 10,
    left: 10,
    // width: 30,
  },

  navCamera: {
    paddingTop: 25,
    left: width * 0.75,
  },

});

SubmitPage.propTypes = {
  location: React.PropTypes.object,
  navigator: React.PropTypes.object,
  clearName: React.PropTypes.func,
  userId: React.PropTypes.number,
  gPlaceId: React.PropTypes.string,
  name: React.PropTypes.string,
  lat: React.PropTypes.number,
  lng: React.PropTypes.number,
  filePath: React.PropTypes.string,
};

export default SubmitPage;
