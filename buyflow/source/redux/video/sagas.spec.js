import {
  call,
  put,
  take
} from 'redux-saga/effects';
import {
  LOAD_CONTENT,
  SET_CONTENT,
  SET_CART,
  UPDATE_CHANNEL_SELECTION
} from './actions';
import {
  loadContentWatch,
  updateChannelSelectionWatch,
  loadContentWorker
} from './sagas';
import loader from '../../tools/loader/loader';
import endpoints from '../../tools/loader/endpoints';

describe('loadContentWatch saga', () => {
  const generator = loadContentWatch();

  it('should takeLatest LOAD_CONTENT', () => {
    const action = generator.next().value;

    expect(action).toEqual(take(LOAD_CONTENT));
  });
});

describe('updateChannelSelectionWatch saga', () => {
  const generator = updateChannelSelectionWatch();

  it('should takeLatest UPDATE_CHANNEL_SELECTION', () => {
    const action = generator.next().value;

    expect(action).toEqual(take(UPDATE_CHANNEL_SELECTION));
  });
});

describe('loadContentWorker saga', () => {
  const generator = loadContentWorker();
  const endpoint = endpoints.loadContent();

  it('should call loadContent', () => {
    const action = generator.next().value;

    expect(action).toEqual(call(loader.request, endpoint));
  });
  it('should put SET_CONTENT on success', () => {
    const payload = {content: undefined};
    const action = generator.next({payload}).value;

    expect(action).toEqual(put({
      type: SET_CONTENT,
      payload: {content: undefined}
    }));
  });
  it('should put SET_CART', () => {
    const payload = {cart: undefined};
    const action = generator.next({payload}).value;

    expect(action).toEqual(put({
      type: SET_CART,
      payload: {cart: undefined}
    }));
  });
});
