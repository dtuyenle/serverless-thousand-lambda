const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('./config.js');
AWS.config.update({region: config.region});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list current buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Bucket List", data.Buckets);
  }

  let text = '';
  data.Buckets.forEach(bucket => {
    text = text + `aws s3 rb s3://${bucket.Name} --force --region=${config.region} &&
    `;
  });
  fs.writeFileSync('./delete_bucket.sh', text);
});
