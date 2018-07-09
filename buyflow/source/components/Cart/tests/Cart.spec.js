import React from 'react';
import Cart from '../Cart.jsx';
import {takeSnapshot} from '../../../tools/testTools';

describe('Cart component', () => {
  it('handles normal price', () => {
    const cartData = { monthlyTotal: 10.95 };
    const snapshot = takeSnapshot(
      <Cart cart={cartData} />
    );

    expect(snapshot).toMatchSnapshot();
  });
});
