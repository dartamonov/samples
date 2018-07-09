import React from 'react';
import Price from '../Price.jsx';
import {takeSnapshot} from '../../../tools/testTools';

describe('Price component', () => {
  it('handles normal price', () => {
    const snapshot = takeSnapshot(
      <Price price={9.45} />
    );

    expect(snapshot).toMatchSnapshot();
  });
});
