const express = require("express");
const dbPool = require("./src/connection/index");
const bcrypt = require("bcrypt");
const session = require("express-session")
const flash = require("express-flash");
const app = express();
const port = 3000;

//sequelize config
const { development } = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const SequelizePool = new Sequelize(development);

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false })); //body parser
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1 * 60 * 60 * 1000,
    },
    resave: false,
    store: session.MemoryStore(),
    secret: "session-storage",
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", home);
app.get("/index", home);
app.get("/contact", contact);
app.get("/project", project);
app.get("/oop", oop);
app.get("/detail-project/:id", detailProject);
app.post("/project", handleProject);
app.get("/delete/:id", deleteProject);

app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", editProjectData);

app.get("/login", formLogin)
app.post("/login", handleLogin)
app.get("/register", formRegister)
app.post("/register", handleRegister)
app.get("/logout", logout)


const data = [];

function home(req, res) {
  res.render("index", {
    handleLogin: req.session.handleLogin,
    user: req.session.user,
  });
}

function contact(req, res) {
  res.render("contact",{handleLogin: req.session.handleLogin,
    user: req.session.user});
}

async function project(req, res) {
  const titleWeb = "My Project";
  const projectNew = await SequelizePool.query("SELECT * FROM projects");
  const buttonOption = projectNew[0].map(res =>({
    ...res, handleLogin: req.session.handleLogin
  }))

  res.render("project", { data: buttonOption, titleWeb,
    handleLogin: req.session.handleLogin,
    user: req.session.user, });
}

async function detailProject(req, res) {
  const { id } = req.params;
  const data = await SequelizePool.query(
    "SELECT * FROM projects where id = " + id
  );
  res.render("detail-project", { data: data[0][0]});
}



async function handleProject(req, res) {
  try {
    const { nameProject, startDate, endDate, descProject, tech } = req.body;

    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);
    const time = Math.abs(firstDate - secondDate);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    let interval = "";

    if (days < 30) {
      interval = days + " Days";
    } else {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      interval = months + " Months";

      if (remainingDays > 0) {
        interval += ` ${remainingDays} Days`;
      }
    }

    await SequelizePool.query(
      `INSERT INTO projects(name_project, start_date,end_date,desc_project,tech, "createdAt", "updatedAt",interval) VALUES ('${nameProject}','${startDate}','${endDate}' ,'${descProject}','{${tech}}',NOW(), NOW(), '${interval}')`
    );
    res.redirect("/project");
  } catch (error) {
    throw error;
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const data = await SequelizePool.query(
    "DELETE FROM projects where id = " + id
  );

  res.redirect("/project");
}

async function editProject(req, res) {
  const { id } = req.params;
  const data = await SequelizePool.query(
    "SELECT * FROM projects where id = " + id
  );

  res.render("edit-project", { data: data[0][0] });
}


async function editProjectData(req, res) {
  try {
    const { id } = req.params;
    const { nameProject, startDate, endDate, descProject, tech } = req.body;

    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);
    const time = Math.abs(firstDate - secondDate);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    let interval = "";

    if (days < 30) {
      interval = days + " Days";
    } else {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      interval = months + " Months";

      if (remainingDays > 0) {
        interval += ` ${remainingDays} Days`;
      }
    }
    await SequelizePool.query(
      `UPDATE projects SET name_project='${nameProject}', start_date='${startDate}', end_date='${endDate}', desc_project='${descProject}',"updatedAt"=now(), interval='${interval}', tech='{${tech}}' where id = ${id}`
    );

    res.redirect("/project");
  } catch (error) {
    throw error;
  }
}

function oop(req, res) {
  res.render("oop",{handleLogin: req.session.handleLogin,
    user: req.session.user});
}


function formRegister(req, res) {
  res.render("register");
}

async function handleRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    console.log(password);
    bcrypt.hash(password, 10, async function (err, hash) {


      await SequelizePool.query(
        `INSERT INTO users (name, email, password, "createdAt", "updatedAt")
      VALUES ('${name}','${email}','${hash}' ,NOW(), NOW())`
      );
    });

    res.redirect("/login");
  } catch (error) {
    throw error;
  }
}

function formLogin(req, res) {
  const titlePage = "Login";
  res.render("login", {
    titlePage,
    handleLogin: req.session.handleLogin,
    user: req.session.user,
  });
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const checkEmail = await SequelizePool.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      { type: QueryTypes.SELECT }
    );

    if (checkEmail.length === 0) {
      req.flash("failed", "Email is not register!");
      return res.redirect("/login");
    }

    bcrypt.compare(password, checkEmail[0].password, function (err, result) {
      if (!result) {
        return res.redirect("/login");
      } else {
        req.session.handleLogin = true;
        req.session.user = checkEmail[0].name;
        return res.redirect("/");
      }
    });
  } catch (error) {
    throw error;
  }
}


function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
}


app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
