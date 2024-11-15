import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport"; // a middelware it is used for varius authentication stratagies
/* Session Management: Passport can handle sessions, allowing you to maintain a user's authentication state across different requests. 
This is particularly useful for web applications that require users to log in and maintain a session*/
import { Strategy } from "passport-local";
/* The passport-local library is an authentication strategy for Passport, 
specifically designed to handle local authentication using a username and password*/
import session from "express-session";
/*The express-session library is used for session management in Express applications. 
Its main purpose is to create and manage sessions for users, 
enabling the storage of user-specific data across different requests in a web application. */
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie:{ // this is miliseconds so 1000ms=1 sec
      maxAge:1000 * 60* 60 * 24 //it is one day hear
    }
  })
);
/*app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
  })
);
what does this lines of code do 
ChatGPT
This line of code sets up session management in an Express.js application using the express-session middleware.
 Here is a breakdown of what each part does:

app.use(session({...})): This line applies the session middleware to the Express application.
 It enables session handling for all incoming requests.

secret: "TOPSECRETWORD": Purpose: The secret is used to sign and encrypt the session ID cookie that is sent to the user's browser. 
This makes sure that the session data can't be easily tampered with by anyone.

How It Works: When your application sends a session ID to the user's browser,
 it uses the secret to create a unique signature. 
 When the browser sends the session ID back to your server with each request,
  the server checks the signature to make sure it matches. 
  If it does, the server knows the session ID is valid and hasn't been changed.

Simple Example
Think of the secret as a special key:

When your app gives a session ID to the user's browser, it locks it with the special key.
When the app receives the session ID back, it uses the same key to unlock it and check if it’s genuine.
If someone tries to change the session ID without knowing the key, the app will notice and reject it.

resave: false: This option determines whether the session should be saved back to the session store 
even if it was never modified during the request. 
Setting it to false can improve performance by avoiding unnecessary session store operations if the session data hasn't changed.

saveUninitialized: true: This option determines whether a session that is new but not modified should be saved to the session store. 
Setting it to true ensures that all new sessions are saved to the store, even if they haven't been modified. 
This can be useful for tracking anonymous sessions, but in some cases,
 you might want to set it to false to avoid storing sessions for unauthenticated or unmodified requests. */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());

/*The line app.use(passport.initialize()); belongs to the passport library
passport.initialize(): This is a function provided by the Passport library. It returns a middleware function that:

-> Initializes Passport.
-> Prepares it to handle authentication.
-> Ensures that the Passport instance is available in every request object (req) that follows this middleware.

Why Is This Important?
Enables Passport Functionality: Without this line, Passport won't be able to function properly. 
This setup step is crucial for Passport to process and handle authentication requests.
Prepares Request Handling: This middleware adds necessary properties and methods to the request object that Passport
 uses for authentication purposes. */
app.use(passport.session());// (cunnects the session and the passport)
/* The line app.use(passport.session()); is part of the passport library

What Does app.use(passport.session()); Do?
Session Middleware: This line adds middleware that integrates Passport's session handling with the session middleware in Express.

Persistent Login Sessions: It enables persistent login sessions, meaning a user remains authenticated across multiple requests
as long as their session is active.

Step-by-Step Breakdown
app.use(...): This method mounts the specified middleware function(s) at the path which is being specified. 
If no path is specified, it defaults to '/'. This means the middleware will be executed for every incoming request.

passport.session(): This is a middleware function provided by the Passport library. It:

Reads the session from the cookie sent by the client.
Deserializes the user object from the session.
Attaches the user object to the req.user property, making it available in subsequent middleware and route handlers.*/
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "authenticate",
  password: "password",
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

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/secrets", (req, res) => {
  // console.log(req.user);
  if (req.isAuthenticated()) {  // isAuthenticated() this function comes from the passport library
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", { // this function belongs to passport library it tell we are using the local authentication
    successRedirect: "/secrets",
    failureRedirect: "/login",
  }) // this function calls the passport.use function
  
);
passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          // console.error("hashing password:", hash);
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});



passport.serializeUser((user, cb) => {
  cb(null, user);
});
/*The code passport.serializeUser((user, cb) => { cb(null, user); });
 is used to define how user information should be stored in the session in a Passport.js authentication setup */
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
/*Passport.js requires a deserialization function to retrieve user information from the session.

 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
