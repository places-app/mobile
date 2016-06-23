import { AsyncStorage } from 'react-native';

export function setStorage(fbToken, cb) {
  AsyncStorage.setItem('fbToken', fbToken, () => {
    cb();
  });
};

export function getStorage(cb) {
  AsyncStorage.getItem('fbToken', (err, result) => {
    cb(result);
  });
};

export function removeStorage(cb) {
  console.log('inHelper')
  AsyncStorage.removeItem('fbToken', (err, result) => {
    getStorage((result) => console.log(result))
  });
};


    // AsyncStorage.getItem('fbToken', (err, result) => {
    //   console.log('RETRIEVED FROM ASYNC STORAGE: ', result);
    // });