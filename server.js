const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const allowCrossDomain = function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
}

const readFile = function(req, res, next){
  const file = fs.readFileSync("./assets/variable-dict.txt");
  fileObj = JSON.parse(file);
  next();
}

let fileObj = null;
app.use(allowCrossDomain);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(readFile);

app.get('/api/getProjectNames', (req, res) => {
  projectNames = getProjectName();
  res.send(projectNames);
});

app.post('/api/getProjectVariables', (req, res) => {
  res.header('Content-Type', 'application/json');
  let selectedProjects = req.body.selectedProjects;
  let variablesObj = getProjectVariables(selectedProjects);
  res.json(variablesObj);
});

function getProjectVariables(names){
  projectVarObj = {};
  names.forEach(name => {
    name = name.charAt(0).toLowerCase() + name.slice(1);
    projectVarObj[name] = fileObj[name];
  });
  return projectVarObj;
}

function getProjectName(){
  //const file = fs.readFileSync("./assets/variable-dict.txt");
  //console.log(JSON.parse(file));
  //fileObj = JSON.parse(file);
  const projectNames = Object.keys(fileObj).map(name=>{
    return name.charAt(0).toUpperCase() + name.slice(1);
  });
  return projectNames;
}

const server = app.listen(process.env.PORT || 5000, () => {
  const port = server.address().port;
  console.log("Running on port %s", port);
});
