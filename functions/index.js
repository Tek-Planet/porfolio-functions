const functions = require('firebase-functions');
const app = require('express')();


const {
    project,
    projects,
    projectImage
  } = require('./handlers/project');

  app.get('/projects', projects);
  app.post('/project',  project);
  app.post('/projectImage/:location/:projectId',  projectImage);

 // exports.api = functions.region('us-central1').https.onRequest(app);
 exports.api = functions.https.onRequest(app);






 