import React from 'react';
import Accordion from '../Accordion.jsx';
import {takeSnapshot} from '../../../tools/testTools';

describe('Accordion component', () => {
  it('handles active accordion ', () => {
    const snapshot = takeSnapshot(
      <Accordion active={true}>
        <div>Content</div>
      </Accordion>
    );

    expect(snapshot).toMatchSnapshot();
  });

  it('handles inactive accordion ', () => {
    const snapshot = takeSnapshot(
      <Accordion active={false}>
        <div>Content</div>
      </Accordion>
    );

    expect(snapshot).toMatchSnapshot();
  });
});
