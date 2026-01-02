const http = require("http");
const database = require("./database"); //  database.js Connection
const url = require("url");

const server = http.createServer((req, res) => {
  const method = req.method;
  const path = url.parse(req.url).pathname;

  // ---------------- GET students ----------------
  if (method === "GET" && path === "/students") {
    database.query("SELECT * FROM students ORDER BY id", (err, result) => {
      if (err) {
        res.writeHead(500);
        return res.end("Server Error");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    });
  }

  // ---------------- GET student by ID ----------------
  else if (method === "GET" && path.startsWith("/students/")) {
    const id = path.split("/")[2];

    database.query("SELECT * FROM students WHERE id=$1", [id], (err, result) => {
      if (err) {
        res.writeHead(500);
        return res.end("Server Error");
      }
      if (result.rows.length === 0) {
        res.writeHead(404);
        return res.end("Student not found");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows[0]));
    });
  }

  // ---------------- CREATE / POST new student ----------------
  else if (method === "POST" && path === "/students") {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    let student;
    try {
      student = JSON.parse(body);
    } catch (err) {
      res.writeHead(400);
      return res.end("Invalid JSON");
    }

    const query = `
      INSERT INTO students (name, roll_no, class, date_of_birth, address)
      VALUES ($1,$2,$3,$4,$5)
    `;

    const values = [
      student.name,
      student.roll_no,
      student.class,
      student.date_of_birth,
      student.address
    ];

    database.query(query, values, (err) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error saving student");
      }

      res.writeHead(201);
      res.end("Student saved successfully");
    });
  });
}


  // ---------------- UPDATE student by ID ----------------
  else if (method === "PUT" && path.startsWith("/students/")) {
  const id = path.split("/")[2];
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    let student;
    try {
      student = JSON.parse(body);
    } catch (err) {
      res.writeHead(400);
      return res.end("Invalid JSON");
    }

    const query = `
      UPDATE students
      SET name=$1, roll_no=$2, class=$3, date_of_birth=$4, address=$5
      WHERE id=$6
    `;

    const values = [
      student.name,
      student.roll_no,
      student.class,
      student.date_of_birth,
      student.address,
      id
    ];

    database.query(query, values, (err, result) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error updating student");
      }
      if (result.rowCount === 0) {
        res.writeHead(404);
        return res.end("Student not found");
      }
      res.writeHead(200);
      res.end("Student updated successfully");
    });
  });
}


  // ---------------- DELETE student by ID ----------------
 else if (method === "DELETE" && path.startsWith("/students/")) {
  const id = path.split("/")[2];

  database.query(
    "DELETE FROM students WHERE id = $1",
    [id],
    (err, result) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error deleting student");
      }

      if (result.rowCount === 0) {
        res.writeHead(404);
        return res.end("Student not found");
      }

      res.writeHead(200);
      res.end("Student deleted successfully");
    }
  );
}


  // ---------------- 404 Not Found ----------------
  else {
    res.writeHead(404);
    res.end("Route not found");
  }
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
