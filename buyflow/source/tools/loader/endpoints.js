const BASE_URL =
  process.env.NODE_ENV === 'production'
  ? 'https://buyflow-server.herokuapp.com/'
  : 'http://localhost:5000/';

export default {
  loadContent : () => ({
    url: `${BASE_URL}api/video/channels`,
    method: 'GET'
  }),
  addChannel : (channelType, productId) => ({
    url: `${BASE_URL}api/video/channels-add/${channelType}/${productId}`,
    method: 'POST'
  }),
  removeChannel : (channelType, productId) => ({
    url: `${BASE_URL}api/video/channels-remove/${channelType}/${productId}`,
    method: 'POST'
  })
};
