import React, { Component } from 'react';
import SubmitPage from './SubmitPage';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AlertIOS,
} from 'react-native';
import Camera from 'react-native-camera';

class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCapturing: false,
      action: 'Capture',
      filePath: '',
      userId: props.userId,
      note: props.note,
      location: {
        gPlaceId: props.gPlaceId,
        name: props.name,
        lat: props.lat,
        lng: props.lng,
      },
    };
  }

  goBack() {
    this.props.navigator.pop();
    this.props.returnProps(this.state.filePath, this.state.note);
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          type={Camera.constants.Type.back}
          captureMode={Camera.constants.CaptureMode.video}
          >
          <Text style={styles.capture} onPress={this.captureVideo.bind(this)}>{this.state.action}</Text>
          <Text style={styles.capture} onPress={() => { this.goBack(); }}>Continue</Text>
        </Camera>
      </View>
    );
  }

  captureVideo() {
    if (!this.state.isCapturing) {
      this.setState({ action: 'Stop' });
      this.camera.capture()
        .then((result) => {
          this.setState({ filePath: result.path });
        })
        .catch(err => alert(err));
    } else {
      this.setState({ action: 'Start' });
      this.camera.stopCapture();
    }
    this.setState({
      isCapturing: !this.state.isCapturing,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 10,
  },
  nav: {
    height: 75,
    backgroundColor: '#9966ff',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
  },

  navText: {
    fontSize: 50,
    color: 'white',
  },

  navButton: {
    left: 10,
    width: 30,
    justifyContent: 'center',
  },
});

CameraPage.propTypes = {
  navigator: React.PropTypes.object,
};

export default CameraPage;
