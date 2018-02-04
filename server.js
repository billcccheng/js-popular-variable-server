const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}

const readFile = (req, res, next) => {
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
  const projectNames = getProjectName();
  res.send(projectNames);
});

app.get('/api/fetchWordCloudProjectNames', (req, res) => {
  const projectNames = getProjectName().reduce((array, itm) => {
    if(itm === 'Node')
      return array;
    return array.concat({'value': itm, 'label': itm});
  }, [])

  res.send(projectNames);
});

app.post('/api/getProjectVariables', (req, res) => {
  res.header('Content-Type', 'application/json');
  const selectedProjects = req.body.selectedProjects;
  const variablesObj = getProjectVariables(selectedProjects);
  res.json(variablesObj);
});

app.get('/api/getSingleProjectVariables/:project', (req, res) => {
  res.header('Content-Type', 'application/json');
  let selectedProject = req.params.project;
  selectedProject = selectedProject.charAt(0).toLowerCase() + selectedProject.slice(1);
  const selectedProjectVarObj = getProjectVariables([selectedProject]);
  const selectedProjectVar = selectedProjectVarObj[selectedProject];
  const returnObj = Object.keys(selectedProjectVar).reduce((res, varName) => {
    let magnify = 20000/Object.keys(selectedProjectVar).length;
    return res.concat({'text': varName, 'value': selectedProjectVar[varName]*magnify});
  },[]);
  returnObj.sort((a,b) => {
    return b.value - a.value;
  });
  res.json(returnObj);
});

function getProjectVariables(names) {
  return names.reduce((res, name) => {
    name = name.charAt(0).toLowerCase() + name.slice(1);
    res[name] = fileObj[name];
    return res;
  }, {});
}

function getProjectName() {
  const projectNames = Object.keys(fileObj).map(name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  });
  return projectNames;
}

const server = app.listen(process.env.PORT || 5000, () => {
  const port = server.address().port;
  console.log("Running on port %s", port);
});
