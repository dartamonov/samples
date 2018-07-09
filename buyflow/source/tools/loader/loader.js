import axios from 'axios';
import { call } from 'redux-saga/effects';

export const defaults = {
  url: '',
  method: 'GET',
  data: undefined,
  timeout: 150000
};

class Loader {
   *request (endpoint, opts) {
    const requestConfig = Object.assign({}, defaults, opts, endpoint);
    let response;

    try {
      response = yield call(axios, requestConfig); // Requests can be made by passing the relevant config to axios.
    } catch(e) {
      /*eslint-disable no-console*/
      console.log("Loader error", e);
      console.log("requestConfig", requestConfig);
    }
    const {data} = response;

    return data;
  }
}

const instance = new Loader(); //Ensure only a singleton is exported

export default instance;
