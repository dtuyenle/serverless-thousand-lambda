const fs = require('fs');
const stocks = JSON.parse(fs.readFileSync('./stock.json', 'utf8'));
const config = require('./config.js');
const yamlRead = require('read-yaml');
let region = config.region;

const getTemplate = name => {
	return `
    echo ${name}
    aws lambda invoke --invocation-type Event --function-name ${name} --region ${region} fuck.txt &
	`;
};

let text = '';

for (let i = 1; i < 183; i++) {
  // this number must be funced with the create_deploy.js
  if (i > 108) {
    region = 'us-west-1';
  }
  const data = yamlRead.sync('./../serverless/' + i + '/serverless.yml');
  console.log(data.functions);
  Object.keys(data.functions).forEach(key => {
    text = text + getTemplate('serverless' + i + '-prod-' + key);
  });
  text = text + `
    wait
    sleep 10
  `;
}

fs.writeFileSync('./invoke.sh', text);