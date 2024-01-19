const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))
app.use(express.urlencoded({extended: false})) //body parser

app.get('/', home)
app.get('/index', home)
app.get('/contact', contact)
app.get('/project', project)
app.get('/oop', oop)
app.get('/detail-project/:id', detailProject)
app.post('/project', handleProject)
app.get("/delete/:id", deleteProject);

app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", editProjectData);


const data = []

function home(req, res){
  res.render('index')
}

function contact(req, res){
  res.render('contact')
}

function project(req, res){
  const titleWeb = 'My Project'

    
  res.render('project', {data, titleWeb})
}

function detailProject(req, res){
  const {id} = req.params

  console.log(id);
  const dataDetailProject = data[id];

  res.render("detail-project", { data: dataDetailProject});

}

function handleProject(req, res){
  const {nameProject, startDate, endDate, descProject, tech} = req.body

  const firstDate = new Date(startDate);
  const secondDate = new Date(endDate);
  const time = Math.abs(firstDate - secondDate);
  const days = Math.floor(time / (1000 * 60 * 60 * 24));

  let interval = '';

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
  
  data.unshift({
    nameProject,startDate,endDate,descProject,interval,
    tech: Array.isArray(tech) ? tech :[tech]
  })

  res.redirect('/project')

}

function deleteProject(req, res) {
  const { id } = req.params;
  data.splice(id, 1);

  res.redirect("/project");
}

function editProject(req, res) {
  const { id } = req.params;
  const dataEditProject = data[+id];
  dataEditProject.id = id;

  res.render("edit-project", { data: dataEditProject });
}

function editProjectData(req, res){
  const { id } = req.params;
  const {nameProject, startDate, endDate, descProject, tech} = req.body

  const firstDate = new Date(startDate);
  const secondDate = new Date(endDate);
  const time = Math.abs(firstDate - secondDate);
  const days = Math.floor(time / (1000 * 60 * 60 * 24));

  let interval = '';

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
  
    data[+id]={
     nameProject,startDate,endDate,descProject,interval,
      tech: Array.isArray(tech) ? tech :[tech]
  }

  res.redirect('/project')

}


function oop(req, res){
  res.render('oop')
}






app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`)
})