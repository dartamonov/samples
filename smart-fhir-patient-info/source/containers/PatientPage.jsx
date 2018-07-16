import React, { Component, PropTypes } from 'react';
import PatientsList from '../components/Patient/PatientsList.jsx';
import PatientCard from '../components/Patient/PatientCard.jsx';

export class PatientPage extends Component {
  render() {
    const {
      match
    } = this.props;
    const patientId = match.params.id;

    return (
      <div className="container-fluid">
        {patientId
          ? <PatientCard patientId={patientId}/>
          : <PatientsList/>
        }
      </div>
    );
  }
}

PatientPage.propTypes = {
  match: PropTypes.object
};

export default PatientPage;
