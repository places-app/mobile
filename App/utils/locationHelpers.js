const BackgroundGeolocation = require('react-native-background-geolocation');

// host ip of the location server on digital ocean
const host = '104.236.72.252';

export default function (userId) {
  BackgroundGeolocation.stop();

  BackgroundGeolocation.configure({
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 40,
    disableElasticity: false,
    // locationUpdateInterval: 5000,
    minimumActivityRecognitionConfidence: 80,
    // fastestLocationUpdateInterval: 5000,
    activityRecognitionInterval: 10000,
    stopDetectionDelay: 1,
    stopTimeout: 2, // 2 minutes
    activityType: 'AutomotiveNavigation',

    // Application config
    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
    // forceReloadOnLocationChange: false,
    // forceReloadOnMotionChange: false,
    // forceReloadOnGeofence: false,
    stopOnTerminate: false,
    startOnBoot: true,

    // HTTP / SQLite config
    url: `http://${host}:3333/api/users/${userId}/location`,
    batchSync: false,
    autoSync: true,
    maxDaysToPersist: 1,
    headers: {
      //
    },
    params: {
      //
    },
  });

    // This handler fires whenever bgGeo receives a location update.
  BackgroundGeolocation.on('location', (location) => {
    console.log('- [js]location: ', JSON.stringify(location));
  });

  // This handler fires whenever bgGeo receives an error
  BackgroundGeolocation.on('error', (error) => {
    const type = error.type;
    const code = error.code;
    console.log(type, ' Error: ', code);
  });

  // This handler fires whenever bgGeo makes an http request
  BackgroundGeolocation.on('http', (response) => {
    const status = response.status;

    console.log('- HTTP success', status);
  });


  return BackgroundGeolocation;
}

