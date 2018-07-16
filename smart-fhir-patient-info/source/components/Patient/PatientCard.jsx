import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader-advanced';
import { Col, Row } from '../Grid';
import { loadPatient, loadConditions, setConditions } from '../../redux/patient/actions';
import { sortConditionsBy } from '../../redux/patient/helpers';

export class PatientCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortAttribute: 'date',
      sortUp: false
    };
  }

  componentDidMount() {
    const {
      loadPatient,
      loadConditions,
      patientId
    } = this.props;

    loadPatient(patientId);
    loadConditions(patientId, 'active');
  }

  handleSort(sortAttribute, e) {
    e.preventDefault();
    const {
      setConditions,
      patient
    } = this.props;
    const sortUp = sortAttribute === this.state.sortAttribute ? !this.state.sortUp : this.state.sortUp;

    setConditions(sortConditionsBy({conditions: patient.conditions, sortAttribute, sortUp}));
    this.setState({sortAttribute, sortUp}); //eslint-disable-line react/no-set-state
  }

  render() {
    const {
      patient
    } = this.props;
    const {
      fullName,
      gender,
      birthDate,
      address
    } = patient.info;
    const searchBaseUrl = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=';
    const labelClassesCondition = classNames({
      'fas fa-sort': this.state.sortAttribute !== 'title',
      'fas fa-sort-down': this.state.sortAttribute === 'title' && this.state.sortUp,
      'fas fa-sort-up': this.state.sortAttribute === 'title' && !this.state.sortUp
    });
    const labelClassesDate = classNames({
      'fas fa-sort': this.state.sortAttribute !== 'date',
      'fas fa-sort-down': this.state.sortAttribute === 'date' && this.state.sortUp,
      'fas fa-sort-up': this.state.sortAttribute === 'date' && !this.state.sortUp
    });

    return (
      <div>
        <Loader show={_.isEmpty(fullName)} message={'Loading...'}>
          <div className="my-4">
            <h1>{fullName}</h1>
            <Row>
              <Col lg={2} xs={12}>Gender: {gender}</Col>
              <Col lg={2} xs={12}>DOB: {birthDate}</Col>
              <Col lg={4} xs={12}>Address: {address}</Col>
            </Row>
          </div>
        </Loader>

        <Loader show={_.isEmpty(patient.conditions)} message={'Loading...'}>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th className="sortable" onClick={this.handleSort.bind(this, 'title')}>
                    Condition <i className={labelClassesCondition}/>
                  </th>
                  <th className="sortable" onClick={this.handleSort.bind(this, 'date')}>
                    Date Recorder <i className={labelClassesDate}/>
                  </th>
                  <th>Search</th>
                </tr>
              </thead>
              <tbody>
              {_.map(patient.conditions, (condition, index) => {
                return (
                  <tr key={index}>
                    <td>{condition.title}</td>
                    <td>{condition.dateRecorded}</td>
                    <td><a href={`${searchBaseUrl}${condition.title}`} target="_blank">More info</a></td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </Loader>

        <footer className="my-4">
          <a href="/patient" className="btn btn-secondary btn-md">Back to Patients List</a>
        </footer>
      </div>
    );
  }
}

PatientCard.propTypes = {
  patient: PropTypes.object.isRequired,
  loadPatient: PropTypes.func.isRequired,
  conditions: PropTypes.object.isRequired,
  loadConditions: PropTypes.func.isRequired,
  setConditions: PropTypes.func.isRequired,
  patientId: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    ...state
  };
}
function mapDispatchToProps(dispatch) {
  return {
    loadPatient: bindActionCreators(loadPatient, dispatch),
    loadConditions: bindActionCreators(loadConditions, dispatch),
    setConditions: bindActionCreators(setConditions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientCard);
