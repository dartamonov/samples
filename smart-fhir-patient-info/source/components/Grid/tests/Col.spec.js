import React from 'react';
import { create } from 'react-test-renderer';
import Col from '../src/Col.jsx';

describe("Col component", () => {
  it("requires a child component", () => {
    const tree = create(
      <Col><span>Test</span></Col>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("accepts an xs, sm, md, and lg props to define grid size", () => {
    const tree = create(
      <Col xs={12} md={6} lg={4}><span>Test</span></Col>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("accepts an offset prop", () => {
    const tree = create(
      <Col xsOffset={1}><span>Test</span></Col>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("accepts a push prop", () => {
    const tree = create(
      <Col xsPush={1}><span>Test</span></Col>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("accepts a pull prop", () => {
    const tree = create(
      <Col xsPull={1}><span>Test</span></Col>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
