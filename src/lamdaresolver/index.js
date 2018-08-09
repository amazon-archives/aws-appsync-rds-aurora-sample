/*
* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this
* software and associated documentation files (the "Software"), to deal in the Software
* without restriction, including without limitation the rights to use, copy, modify,
* merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : process.env.ENDPOINT,
  user     : process.env.USERNAME,
  password : process.env.PASSWORD
});

let dbInit = false;

async function conditionallyCreateDB(connection) {
  await executeSQL(connection, 'CREATE DATABASE IF NOT EXISTS ' + process.env.DBNAME);
  return new Promise((resolve,reject) => {
    connection.changeUser({ database: process.env.DBNAME }, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    } )
  })
}

function conditionallyCreateCommentsTable(connection) {
  const createTableSQL = `CREATE TABLE IF NOT EXISTS comments (
    id        VARCHAR(64) NOT NULL,
    author    VARCHAR(128) NOT NULL,
    postId    VARCHAR(64) NOT NULL,
    content   VARCHAR(255) NOT NULL,
    upvotes   INT NOT NULL,
    downvotes INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(postId) REFERENCES posts(id))`;
  return executeSQL(connection, createTableSQL);
}

function conditionallyCreatePostsTable(connection) {
  const createTableSQL = `CREATE TABLE IF NOT EXISTS posts (
    id        VARCHAR(64) NOT NULL,
    author    VARCHAR(64) NOT NULL,
    content   VARCHAR(2048) NOT NULL,
    views     INT NOT NULL,
    PRIMARY KEY(id))`;
  return executeSQL(connection, createTableSQL);
}

function executeSQL(connection, sql) {
  console.log('Executing SQL:', sql);
  return new Promise((resolve,reject) => {
    connection.query(sql, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    } )
  })
}

function populateAndSanitizeSQL(sql, variableMapping, connection) {
  Object.entries(variableMapping).forEach(([key, value]) => {
    const escapedValue = connection.escape(value);
    sql = sql.replace(key, escapedValue);
  });

  return sql;
}

exports.handler = async (event) => {
  console.log('Received event', JSON.stringify(event, null, 3));

  if (!dbInit) {
    await conditionallyCreateDB(connection);
    await conditionallyCreatePostsTable(connection);
    await conditionallyCreateCommentsTable(connection);
    dbInit = true;
  }

  const inputSQL = populateAndSanitizeSQL(event.sql, event.variableMapping, connection);
  let result = await executeSQL(connection, inputSQL);

  if (event.responseSQL) {
    const responseSQL =
      populateAndSanitizeSQL(event.responseSQL, event.variableMapping, connection);
    result = await executeSQL(connection, responseSQL);
  }
  console.log(JSON.stringify(result, null, 3));
  return result;
};