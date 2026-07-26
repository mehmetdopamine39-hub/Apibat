const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "2mkocaeli",
});

db.connect((err) => {
  if (err) {
    console.error("- 2mkocaeli:", err);
    process.exit(1);
  }
  console.log("+ 2mkocaeli");
});

module.exports = db;
