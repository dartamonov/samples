import _ from 'lodash';

export const normalizeContent = state => {
  const rawContent = state.video.content.channelGroups;
  const channelGroups = Object.keys(rawContent).map(channelType => {
    const channelGroup = rawContent[channelType];
    const expanded = _.isNil(channelGroup.expanded) ? channelGroup.isModuleExpanded : channelGroup.expanded;

    return {
      ...channelGroup,
      channelType,
      expanded
    };
  });

  return {
    channelGroups: channelGroups.sort((a, b) => a.weight - b.weight),
    cart: state.video.cart
  };
};
