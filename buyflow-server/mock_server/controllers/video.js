const mockUtil = require('../util/mockUtil');
const update = require('immutability-helper');
const _ = require('lodash');
const VIDEO_JSON_MOCK = 'video/videoChannelsSuccess.json';

let startingState = {};
let channelState = {};

/**
 * GET /
 * Check if the channelState is cold.
 * Initialize the initial state of the page and the state that gets manipulated in memory.
 */
exports.index = (req, res) => {
  mockUtil.readMock(VIDEO_JSON_MOCK, function(data) {
    if (Object.keys(channelState).length === 0) {
      startingState = channelState = data;
    }
    res.json(channelState);
  });
};

const updateChannel = (req, res, remove) => {
  const channelType = req.params.channelType;
  const productId = req.params.productId;
  //const jsonData = JSON.parse(JSON.stringify(channelState));
  //const updatedChannels = update(jsonData, {
  const updatedChannels = update(channelState, {
    customization: {
      channelGroups: {
        [channelType]: {
          channels: {
            $apply: options => options.map(option => {
              const isSelected = option.id === productId ? !remove : option.isSelected;
              return Object.assign({}, option, {isSelected});
            })
          }
        }
      }
    }
  });

  const monthlyTotal = _.reduce(updatedChannels.customization.channelGroups, (result, channelGroup, key) => {
    return result + _.reduce(channelGroup.channels, function(sum, channel) {
      return channel.isSelected ? sum + channel.price : sum;
    }, 0);
  }, 0);
  const responseData = {
    ...updatedChannels,
    cart: { monthlyTotal }
  }

  channelState = responseData;
  res.json(responseData);
};

exports.addChannel = (req, res) => {
  // This ugliness is just to make sure the server doesn't crash if you update this controller
  // and the server memory clears, then you hit a checkbox and go to sorry page.
  if (Object.keys(channelState).length === 0) {
    console.log("read from mock");
    mockUtil.readMock(VIDEO, function(data) {
      startingState = channelState = data;
      updateChannel(req, res, false);
    });
  } else {
    updateChannel(req, res, false); // this is all thats required if we aren't playing with the server memory
  }
};

exports.removeChannel = (req, res) => {
  // Same thing as addChannel...
  if (Object.keys(channelState).length === 0) {
    console.log("read from mock");
    mockUtil.readMock(VIDEO, function(data) {
      startingState = channelState = data;
      updateChannel(req, res, true);
    });
  } else {
    updateChannel(req, res, true);
  }
};
