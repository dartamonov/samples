const BASE_URL = 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/';

export default {
  loadPatient: (patientId) => ({
    url: `${BASE_URL}Patient/${patientId}`,
    method: 'GET'
  }),
  loadConditions: (patientId, conditionStatus) => ({
    url: `${BASE_URL}Condition?patient=${patientId}&status=${conditionStatus}`,
    method: 'GET'
  })
};
