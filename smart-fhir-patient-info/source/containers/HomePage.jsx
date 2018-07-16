import React, { Component } from 'react';

export class HomePage extends Component {
  render() {
    return (
        <div className="container-fluid">
          <h1>Patient information via SMART on FHIR</h1>
          <footer className="my-4">
            <p><a href="/patient" className="btn btn-primary btn-md">View patients list</a></p>
          </footer>
        </div>
    );
  }
}

export default HomePage;
