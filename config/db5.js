const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "8mistanbul",
});

db.connect((err) => {
  if (err) {
    console.error("- 8mistanbul:", err);
    process.exit(1);
  }
  console.log("+ 8mistanbul");
});

module.exports = db;
