import React, { Component } from 'react';

export class PatientsList extends Component {
  render() {

    return (
      <div>
        <h1 tabIndex="-1" className="x-heading1">Patients</h1>
        <p>View patients by ID:</p>
        <ul>
          <li><a href="/patient/2744010">2744010</a></li>
          <li><a href="/patient/1316024">1316024</a></li>
        </ul>
      </div>
    );
  }
}

export default PatientsList;
