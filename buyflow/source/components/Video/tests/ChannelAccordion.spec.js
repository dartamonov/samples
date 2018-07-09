import React from 'react';
import ChannelAccordion from '../ChannelAccordion.jsx';
import {takeSnapshot} from '../../../tools/testTools';

describe('ChannelAccordion component', () => {
  it('handles accordion with a header', () => {
    const accordion = true;
    const channelGroup = {
      "channels": [
        {
          "logoUrl": "logoUrl.png",
          "backgroundImageUrl": "backgroundImageUrl.png",
          "id": "610379779",
          "name": "Starz",
          "description": "Starz®, Starz Edge™, Starz Cinema®, Starz Kids & Family® & more",
          "price": 10.99,
          "isSelected": true
        },
        {
          "logoUrl": "logoUrl.png",
          "backgroundImageUrl": "backgroundImageUrl.png",
          "id": "610371595",
          "name": "HBO",
          "description": "HBO®, HBO 2®, HBO Comedy®, HBO Latino®, HBO Family & more",
          "price": 19.99,
          "isSelected": false
        }
      ],
      "channelType": "VideoPremiumChannel",
      "weight": 0,
      "isModuleExpanded": true,
      "title": "Pick channels to order"
    };
    const snapshot = takeSnapshot(
      <ChannelAccordion
        channelGroup={channelGroup}
        accordion={accordion}
      />
    );

    expect(snapshot).toMatchSnapshot();
  });
});
