const fs = require('fs');

let text = '';

// loop through all 183 serverless folder
for (var i = 1; i < 183; i++) {
  // aws support only 3000 or so lambda functions for each region
  const region = i > 108 ? 'us-west-1' : 'us-east-1';
	text = text + `
		echo ${i} &&
		cd ~/robinhood-extension/serverless/${i} &&
		serverless deploy --stage=prod --region=${region} &&
	`;
}

fs.writeFileSync('./deploy.sh', text);
