export const LOAD_CONTENT = 'LOAD_CONTENT';
export const SET_CONTENT = 'SET_CONTENT';
export const SET_CART = 'SET_CART';
export const UPDATE_CHANNEL_GROUP = 'UPDATE_CHANNEL_GROUP';
export const UPDATE_CHANNEL_SELECTION = 'UPDATE_CHANNEL_SELECTION';
export const TOGGLE_ACCORDION = 'TOGGLE_ACCORDION';

export const loadContent = () => {
  return {
    type: LOAD_CONTENT
  };
};

export const toggleAccordion = (channelType, expanded) => {
  return {
    type: TOGGLE_ACCORDION,
    payload: {channelType, expanded}
  };
};

export const updateChannelSelection = (channelType, optionId, remove = false) => {
  return {
    type: UPDATE_CHANNEL_SELECTION,
    payload: {channelType, optionId, remove}
  };
};
