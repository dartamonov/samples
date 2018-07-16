# Patient information via SMART on FHIR. UI on React/Redux
Demo - [https://patient-smart-fhir.herokuapp.com/patient/](https://patient-smart-fhir.herokuapp.com/patient/)
Used: JavaScript ES6, React, Redux, Jest, Sass, Bootstrap, Node.js, Webpack, Babel

### Setup
```
cd /smart-fhir-patient-info
npm install
npm run build:dev
```

## Challenge
Using Cerner’s open sandbox at [http://fhir.cerner.com/millennium/dstu2/#open-sandbox](http://fhir.cerner.com/millennium/dstu2/#open-sandbox)  - create a web application that:
* reads and displays a given patient’s demographic data (name, gender, date of birth)
* displays a sortable table of active conditions that the patient currently has, including
  * condition name
  * date first recorded, if available
  * link to search for this condition on PubMed (URL takes format `https://www.ncbi.nlm.nih.gov/pubmed/?term=[condition name]` )
 
### Notes:
* The design and implementation of the application is totally up to you - you may use whichever libraries/frameworks you feel appropriate to get the job done, but be prepared to justify your choices. It doesn’t necessarily have to run entirely in the browser, either, if you feel like a server-side component is worthwhile.
* Application should have decent cross-compatibility with modern browsers.
* For this exercise, you don’t need to implement the SMART authorization flow - accessing the open sandbox (which requires no authorization) is enough.
* A handy introductory series of FHIR exercises is available at [https://github.com/cerner/ignite-learning-lab/wiki/FHIR-Materials](https://github.com/cerner/ignite-learning-lab/wiki/FHIR-Materials).