/* Include the AWS sdk.
 * No need to add to package.json. It's included in lambda env
*/
const AWS = require('aws-sdk')
// Connect to DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient()

// Save item in DynamoDB table
module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const body = JSON.parse(event.body)
  console.log(body)
  if (!body || !body.email) {
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        error: 'no body found or email found'
      })
    })
  }

  const params = {
    TableName: process.env.MY_TABLE,
    Item: {
      id: Math.random().toString(36).slice(2),
      timestamp: timestamp,
      email: body.email
    },
  }

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the dynamo item.',
      })
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    }
    return callback(null, response)
  })
}

/* Scan a dynamoDB table and return items */
module.exports.scan = (event, context, callback) => {
  const params = {
    TableName: process.env.MY_TABLE,
  }
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
      })
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    }
    return callback(null, response)
  })
}

// Delete item in DynamoDB table
module.exports.delete = (event, context, callback) => {

  const body = JSON.parse(event.body)
  console.log(body)
  if (!body || !body.id) {
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        error: 'no ID passed for deletion'
      })
    })
  }

  var params = {
    TableName: process.env.MY_TABLE,
    Key: {
      id: body.id,
    }
  };
  
  dynamoDb.delete(params, (error, result) => {
    if (error){
      console.log(error);
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t delete the todos.',
      })
    } 
    else {
      console.log(result);
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `user ${body.id} deleted`
        })
      }
      return callback(null, response)
    } 
  });
}

/* function to handle items on the dynamoDB stream */
module.exports.dynamoStreamHandler = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log(record.eventID)
    console.log(record.eventName)
    console.log('DynamoDB Record: %j', record.dynamodb)
    if (record.eventName === 'INSERT') {
      console.log('INSERT EVENT. DO WELCOME STUFF')
    }
    if (record.eventName === 'REMOVE') {
      console.log('REMOVAL EVENT. DO REMOVAL STUFF')
    }
  })
  return callback(null, `Successfully processed ${event.Records.length} records.`);
}