import React from 'react';
import {takeSnapshot} from '../../../tools/testTools';
import PatientsList from '../PatientsList.jsx';

describe("PatientsList component", () => {
  it('handles patients list', () => {
    const snapshot = takeSnapshot(
      <PatientsList/>
    );

    expect(snapshot).toMatchSnapshot();
  });
});
