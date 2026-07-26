const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tcpro",
});

db.connect((err) => {
  if (err) {
    console.error("- tcpro:", err);
    process.exit(1);
  }
  console.log("+ tcpro");
});

module.exports = db;
