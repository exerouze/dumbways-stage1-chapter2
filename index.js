const express = require("express");
const dbPool = require("./src/connection/index");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFile");
const app = express();
const port = 3000;

//sequelize config
const { development } = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const SequelizePool = new Sequelize(development);

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/uploads", express.static("src/uploads"));
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
app.post("/project", upload.single("image"), handleProject);
app.get("/delete/:id", deleteProject);

app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", upload.single("image"), editProjectData);

app.get("/login", formLogin);
app.post("/login", handleLogin);
app.get("/register", formRegister);
app.post("/register", handleRegister);
app.get("/logout", logout);

const data = [];

async function home(req, res) {
  try {
    const titleWeb = "My Project";
    if (req.session.handleLogin) {
      const author = req.session.idUser;
      projectNew = await SequelizePool.query(
        `SELECT projects.id, projects.name_project, projects.desc_project, projects.interval, projects.image, projects.author,
         projects."createdAt", projects."updatedAt", projects.tech, users.name FROM projects INNER JOIN users ON projects.author = users.id where author = '${author}' ORDER BY projects.id DESC`,
        { type: QueryTypes.SELECT }
      );
    } else {
      projectNew = await SequelizePool.query(
        `SELECT projects.id, projects.name_project, projects.desc_project, projects.interval, projects.image, projects.author,
         projects."createdAt", projects."updatedAt", projects.tech, users.name FROM projects INNER JOIN users ON projects.author = users.id ORDER BY projects.id DESC`,
        { type: QueryTypes.SELECT }
      );
    }
    const dataNew = projectNew.map((res) => ({
      ...res,
      handleLogin: req.session.handleLogin,
    }));
  
  res.render("index", {
      data: dataNew,
      titleWeb,
      handleLogin: req.session.handleLogin,
      user: req.session.user,
    });
  } catch (error) {
    throw error;
  }
}

function contact(req, res) {
  res.render("contact", {
    handleLogin: req.session.handleLogin,
    user: req.session.user,
  });
}

async function project(req, res) {
  try {
    const titleWeb = "My Project";
    res.render("project", {
        data: titleWeb,
        titleWeb,
        handleLogin: req.session.handleLogin,
        user: req.session.user,
      });
  } catch (error) {
    throw error;
  }
}

async function detailProject(req, res) {
  const { id } = req.params;
  const data = await SequelizePool.query(
    "SELECT * FROM projects where id = " + id
  );
  res.render("detail-project", { data: data[0][0] });
}

async function handleProject(req, res) {
  try {
    const { nameProject, startDate, endDate, descProject, tech } = req.body;
    const author = req.session.idUser;
    let image = ''; 
    if (req.file) {
      image = req.file.filename;
    }


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
      `INSERT INTO projects(name_project, start_date,end_date,desc_project,tech, image, author, "createdAt", "updatedAt",interval) VALUES ('${nameProject}','${startDate}','${endDate}' ,'${descProject}','{${tech}}','${image}','${author}',NOW(), NOW(), '${interval}')`
    );

    res.redirect("/index");
  } catch (error) {
    throw error;
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const data = await SequelizePool.query(
    "DELETE FROM projects where id = " + id
  );

  res.redirect("/index");
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
    
    let image = ''; 
    if (req.file) {
      image = req.file.filename;
    } else {
      const existingProject = await SequelizePool.query(
        `SELECT image FROM projects WHERE id = ${id}`,
        { type: QueryTypes.SELECT }
      );

      if (existingProject.length > 0) {
        image = existingProject[0].image;
      }
    }


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
      `UPDATE projects SET name_project='${nameProject}', start_date='${startDate}', end_date='${endDate}', desc_project='${descProject}', image='${image}', "updatedAt"=now(), interval='${interval}', tech='{${tech}}' where id = ${id}`
    );

  
    res.redirect("/index");
  } catch (error) {
 
    throw error;
  }
}


function oop(req, res) {
  res.render("oop", {
    handleLogin: req.session.handleLogin,
    user: req.session.user,
  });
}

function formRegister(req, res) {
  res.render("register");
}

async function handleRegister(req, res) {
  try {
    const { name, email, password } = req.body;
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
        req.session.idUser = checkEmail[0].id;
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
