const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});
const cloudformation = new AWS.CloudFormation();

const params = {
  // NextToken: 'STRING_VALUE',
  StackStatusFilter: ['DELETE_FAILED', 'ROLLBACK_COMPLETE', 'CREATE_COMPLETE', 'UPDATE_COMPLETE']
};
cloudformation.listStacks(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
  }

  const index = 0;
  const deletestack = item => {
    cloudformation.deleteStack({StackName: item.StackName}, function(err, res) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(res);
        index++;
        console.log(index);
        console.log(data.StackSummaries[index]);
        if (data.StackSummaries[index]) {
          deletestack(data.StackSummaries[index]);
        }
      }
    });
  };

  deletestack(data.StackSummaries[0]);
});