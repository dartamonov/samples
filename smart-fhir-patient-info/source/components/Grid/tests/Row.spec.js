import React from 'react';
import { create } from 'react-test-renderer';
import Row from '../src/Row.jsx';

describe("Row component", () => {
  it("requires a child component", () => {
    const tree = create(
      <Row><span>Test</span></Row>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
