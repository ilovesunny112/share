var mysql = require('mysql');
const logger = require('../middleware/log');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database: 'cxshare'
});
connection.connect();




exports.dbSelect = (sqlStr, fn) => {
	connection.query(sqlStr, (err, rows, fields) => {
	  if (err) {
      logger.error(err);
	  	throw err;
	  }
	  fn(rows);
	});
}

exports.dbUpdate = (sqlStr, fn) => {
  connection.query(sqlStr, (err, rows, fields) => {
    if (err) {
      logger.error(err);
      throw err;
    }
    fn(rows);
  });
}

exports.dbInsert = (sqlStr, fn) => {
  connection.query(sqlStr, (err, rows, fields) => {
    if (err) {
      logger.error(err);
      throw err;
    }
    fn(rows);
  });
}


exports.dbDelete = (sqlStr, fn) => {
  connection.query(sqlStr, (err, rows, fields) => {
    if (err) {
      logger.error(err);
      throw err;
    }
    fn(rows);
  });
}

