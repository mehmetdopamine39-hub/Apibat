const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "9makparti",
});

db.connect((err) => {
  if (err) {
    console.error("- 9makparti:", err);
    process.exit(1);
  }
  console.log("+ 9makparti");
});

module.exports = db;
