const express = require("express");
const dbPool = require("./src/connection/index");
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

const data = [];

function home(req, res) {
  res.render("index");
}

function contact(req, res) {
  res.render("contact");
}

async function project(req, res) {
  const titleWeb = "My Project";
  const projectNew = await SequelizePool.query("SELECT * FROM projects");

  res.render("project", { data: projectNew[0], titleWeb });
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

 // async function editProject(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const project = await Project.findByPk(id);
  
  //     if (!project) {
  //       res.status(404).send("Project not found");
  //       return;
  //     }
  
  //     res.render("edit-project", { data: project });
  //   } catch (error) {
  //     console.error("Error fetching project for edit:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // }

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
  res.render("oop");
}

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
