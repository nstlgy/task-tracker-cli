const fs = require("fs");
const path = require("path");

fs.readFile("./files/hello.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
