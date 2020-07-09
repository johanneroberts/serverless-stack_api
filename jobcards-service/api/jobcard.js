'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const job_id = requestBody.job_id;
  const job_location = requestBody.job_location;
  const job_plumber = requestBody.job_plumber;
  const job_status = requestBody.job_status;

  if (typeof job_id !== 'string' || typeof job_location !== 'string' || typeof job_plumber !== 'string' || typeof job_status !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit Job because of validation errors.'));
    return;
  }

  submitJob(JobInfo(job_id, job_location, job_plumber, job_status))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Sucessfully submitted job',
          JobId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit job`
        })
      })
    });
};


const submitJob = job => {
  console.log('Submitting job');
  const JobInfo = {
    TableName: process.env.JOBCARDS_TABLE,
    Item: job,
  };
  return dynamoDb.put(JobInfo).promise()
    .then(res => job);
};

const JobInfo = (job_id, job_location, job_plumber, job_status) => {
  return {
    id: uuid.v1(),
    job_id: Date.now(),
    job_location: job_location,
    job_plumber: job_plumber,
    job_status: job_status,
  };
};

module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.JOBCARDS_TABLE,
      ProjectionExpression: "id, job_id, job_location, job_plumber, job_status"
  };

  console.log("Scanning jobcards table.");
  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  jobs: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);

};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.JOBCARDS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch Job.'));
      return;
    });
};