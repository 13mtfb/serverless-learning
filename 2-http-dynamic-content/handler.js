'use strict';

module.exports.queryParamsExample = (event, context, callback) => {
  let name
  if (event.queryStringParameters && event.queryStringParameters.name){
    name = event.queryStringParameters.name
  }
  console.log(name)
  const helloParagraph = greetPerson(name)

  /*const respone = {
    statusCode:200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: generateHtmlPage(helloParagraph)
  };*/
  return callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      /*'Access-Control-Allow-Origin': '*', // Required for CORS support to work*/
    },
    body: generateHtmlPage(helloParagraph)
  });
};

module.exports.pathParamsExample = (event, context, callback) => {
  let name
  if (event.pathParameters && event.pathParameters.name){
    name = event.pathParameters.name
  }
  console.log(name)
  const helloParagraph = greetPerson(name)
  return callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      /*'Access-Control-Allow-Origin': '*', // Required for CORS support to work*/
    },
    body: generateHtmlPage(helloParagraph)
  });
};


/* Utility function for rendering HTML */
function generateHtmlPage(content) {
  /* for security always escape output html */
  // const safeValues = escapeHtml(content)
  return `
    <html>
      <style>
        h1 { color: #73757d }
      </style>
      <body>
        ${content}
      </body>
    </html>`
}

/* Utility function for rendering hello message HTML */
function greetPerson(name) {
  const userName = name || 'Unknown Person!'
  return `<p>Hey ${userName}!</p>`
}
