const express = require('express'); const app = express(); const fs = require('fs'); const allowCrossDomain = function(req, res, next) { res.header('Access-Control-Allow-Origin', '*'); res.header('Access-Control-Allow-Methods', 'GET'); res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
}

app.use(allowCrossDomain);

app.get('/api/getProjectNames', (req, res) => {
  //res.header('Content-Type', 'application/json');
  projectNames = getProjectName();
  res.send(projectNames)
});

function getProjectName(){
  const file = fs.readFileSync("./assets/variable-dict.txt");
  //console.log(JSON.parse(file));
  fileObj = JSON.parse(file);
  const projectNames = Object.keys(fileObj).map(name=>{
    return name.replace('-','/');
  });
  return projectNames;
}

const server = app.listen(process.env.PORT || 5000, () => {
  const port = server.address().port;
  console.log("Running on port %s", port);
});
