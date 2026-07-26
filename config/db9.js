const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "secmen2015",
});

db.connect((err) => {
  if (err) {
    console.error("- secmen2015:", err);
    process.exit(1);
  }
  console.log("+ secmen2015");
});

module.exports = db;
