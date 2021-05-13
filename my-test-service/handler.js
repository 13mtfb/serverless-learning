'use strict';

module.exports.hello = (event, context, callback) => {
  console.log(event)
  const response = {
    /* status code required for default lambda integration */
    statusCode: 200,
    body:
    JSON.stringify({
      message: 'hi',
      event: event
    })
  }
  return callback(null, response)
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
