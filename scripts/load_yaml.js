const templatehead = (count) => {
    return `
  service: serverless${count}
  
  package:
    exclude:
      - tensorflow/**
  
  custom:
    tableName: 'News-**customStage**'
    dynamodb:
      start:
        migrate: true
  
  frameworkVersion: 1.27.3
  
  provider:
    name: aws
    runtime: nodejs8.10
  
    stage: **stageDev**
    region: us-east-1
    # deploymentBucket: serverless2-prod-serverlessdeploymentbucket-1bsrjrzr8vdq9
    iamRoleStatements:
      - Effect: "Allow"
        Action:
          - dynamodb:*
        Resource: "*"
    environment:
      NEWS_TABLE: **customTable**
  
  plugins:
    - serverless-offline
    - serverless-dynamodb-local
    - serverless-s3-remover
  functions:
  `
  .replace('**customStage**', '${self:provider.stage}')
  .replace('**stageDev**', '${opt:stage, \'dev\'}')
  .replace('**customTable**', '${self:custom.tableName}');
  }
  
  const templateend = (count) => {
    return count === 1 || count === 109 ? `
  resources:
    Resources:
      LogDynamoDBTable:
        Type: 'AWS::DynamoDB::Table'
        Properties:
          AttributeDefinitions:
            -
              AttributeName: posted_date
              AttributeType: S
            -
              AttributeName: hash_key
              AttributeType: S
            -
              AttributeName: sentiment
              AttributeType: S
            -
              AttributeName: stock_id
              AttributeType: S
          KeySchema:
            -
              AttributeName: hash_key
              KeyType: HASH
            -
              AttributeName: posted_date
              KeyType: RANGE
          GlobalSecondaryIndexes:
            -
              IndexName: sentimentIndex
              KeySchema:
                -
                  AttributeName: sentiment
                  KeyType: HASH
                -
                  AttributeName: posted_date
                  KeyType: RANGE
              Projection:
                ProjectionType: ALL
              ProvisionedThroughput:
                ReadCapacityUnits: 1
                WriteCapacityUnits: 5
            -
              IndexName: stockIndex
              KeySchema:
                -
                  AttributeName: stock_id
                  KeyType: HASH
              Projection:
                ProjectionType: ALL
              ProvisionedThroughput:
                ReadCapacityUnits: 5
                WriteCapacityUnits: 5
          ProvisionedThroughput:
            ReadCapacityUnits: 1
            WriteCapacityUnits: 5
          TimeToLiveSpecification:
            AttributeName: ttl,
            Enabled: TRUE
          TableName: **customTable**
  `.replace('**customTable**', '${self:custom.tableName}') : '';
  }

const fs = require('fs');
const isValid = str => /^\w+$/.test(str);
const stocks = JSON.parse(fs.readFileSync('./stock.json', 'utf8'));

const stocksObj = {};
stocks.amex.forEach(stock => { stocksObj[stock.Symbol] = stock; });
stocks.nyse.forEach(stock => { stocksObj[stock.Symbol] = stock; });
stocks.nasdaq.forEach(stock => { stocksObj[stock.Symbol] = stock; });

const stockArr = [];
let arr = [];
Object.keys(stocksObj).forEach(key => {
  arr.push(stocksObj[key]);
  if (arr.length === 37) {
    stockArr.push(arr);
    arr = [];
  }
});

let count = 1;
const generate = (arr) => {
  let text = '';
  const addText = stock => {
    if (isValid(stock.Symbol)) {
      const stockname = 'feed' + stock.Symbol;
      text = text + `
  ${stockname}:
    handler: index.${stockname}
    timeout: 4
    # events:
      # - schedule: cron(0 18 ? * MON-FRI *)
    `;
    }
  };
  console.log(Object.keys(stocksObj).length);
  console.log(count);
  if (count < 183) {
    arr.forEach(stock => {
      addText(stock);
    });

    fs.writeFileSync('./../serverless/' + count + '/serverless.yml', templatehead(count) + text + templateend(count));
    count++;
    generate(stockArr[count]);
  }
}

generate(stockArr[1]);
console.log(Object.keys(stocksObj).length);
