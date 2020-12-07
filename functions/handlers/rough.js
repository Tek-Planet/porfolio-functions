const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
app.use(cors());
const {
    getAllProjects,
    addProject,
 
  } = require('./handlers/project');

  app.get('/projects', getAllProjects);
  app.post('/project',  addProject);
  exports.api = functions.region('us-central1').https.onRequest(app);






 