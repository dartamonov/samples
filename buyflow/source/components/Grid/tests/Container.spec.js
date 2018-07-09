import React from 'react';
import { create } from 'react-test-renderer';
import Container from '../src/Container.jsx';

describe("Container component", () => {
  it("requires a child component", () => {
    const tree = create(
      <Container><span>Test</span></Container>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
