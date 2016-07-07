import { AsyncStorage } from 'react-native';

export function setStorage(userId, cb) {
  AsyncStorage.setItem('userId', userId, () => {
    cb();
  });
}

export function getStorage(cb) {
  AsyncStorage.getItem('userId', (err, result) => {
    cb(result);
  });
}

export function removeStorage(cb) {
  console.log('inHelper');
  AsyncStorage.removeItem('fbToken', (err, result) => {
    getStorage((result) => console.log(result))
  });
}

