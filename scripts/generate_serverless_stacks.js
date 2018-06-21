/** create stacks **/
const rimraf = require('rimraf');
const ncp = require('ncp').ncp;

ncp.limit = 16;

let i = 1;
var create = () => {
  if (i === 183) {
    return;
  }
  rimraf('./../serverless/' + i, () => {
    console.log('done removing ' + i);
    ncp('./../serverless/0', './../serverless/' + i, (err) => {
      if (err) {
        return console.error(err);
      }
      i++;
      create();
      console.log('done creating ' + i);
    });
  });
}

create();
