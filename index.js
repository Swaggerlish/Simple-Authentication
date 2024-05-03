import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  database: "secrets",
  password: "fusemiss12",
  port: 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try{const checkResults = db.query("SELECT * FROM users WHERE email = $1", [email,]);
  if ((await checkResults).rows.length > 0){
    res.send("Oh no, you are already logged in")
  } else{
  const result = await db.query("INSERT INTO users (email, password) VALUES($1, $2)", [email, password]);
  console.log(checkResults);
  res.render("secrets.ejs");
  }
}catch(err){
  console.log(err);
}
  
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  try{const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length > 0){
    const user = result.rows[0];
    if (user.password === password){
      res.render("secrets.ejs");
    } else{
      res.render("Incorrect password, try again!");
    }
  } else{
    res.render("user not found");
  }
} catch(err){
  console.log(err);
}

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

