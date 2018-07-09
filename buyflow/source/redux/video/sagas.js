import {
  call,
  put,
  fork
} from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import loader from '../../tools/loader/loader';
import endpoints from '../../tools/loader/endpoints';

import {
  LOAD_CONTENT,
  SET_CONTENT,
  SET_CART,
  UPDATE_CHANNEL_SELECTION,
  UPDATE_CHANNEL_GROUP
} from './actions';

// WATCHERS
export function* loadContentWatch() {
  yield* takeLatest(LOAD_CONTENT, loadContentWorker);
}
export function* updateChannelSelectionWatch() {
  yield* takeLatest(UPDATE_CHANNEL_SELECTION, updateChannelSelectionWorker);
}

// WORKERS
export function* loadContentWorker() {
  const endpoint = endpoints.loadContent();

  try {
    //console.log('Get video data'); //eslint-disable-line no-console
    const response = yield call(loader.request, endpoint);

    yield put({
      type: SET_CONTENT,
      payload: {
        content: response.customization
      }
    });
    yield put({
      type: SET_CART,
      payload: {
        cart: response.cart
      }
    });
  } catch(e) {
    //
  }
}

export function* updateChannelSelectionWorker({payload: {channelType, optionId, remove}}) {
  const endpoint = remove
    ? endpoints.addChannel(channelType, optionId)
    : endpoints.removeChannel(channelType, optionId);

  try {
    const response = yield call(loader.request, endpoint);

    yield put({
      type: UPDATE_CHANNEL_GROUP,
      payload: {
        content: response.customization.channelGroups[channelType],
        channelType
      }
    });
    yield put({
      type: SET_CART,
      payload: {
        cart: response.cart
      }
    });
  } catch(e) {
    //
  }
}

export default function* videoSagas() {
  yield [
    fork(loadContentWatch),
    fork(updateChannelSelectionWatch)
  ];
}
