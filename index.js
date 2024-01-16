const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))

app.get('/', home)

app.get('/index', home)
app.get('/contact', contact)
app.get('/project', project)
app.get('/oop', oop)
app.get('/detail-project/:id', detailProject)

function home(req, res){
  res.render('index')
}

function contact(req, res){
  res.render('contact')
}

function project(req, res){
  const data = [
     {
      id:1,
      title : 'Data 1',
      content : 'Content 1'
     },
     {
      id:2,
      title : 'Data 2',
      content : 'Content 2'
     },
     {
      id:3,
      title : 'Data 3',
      content : 'Content 3'
     }

  ]
    

  res.render('project', {data})
}

function detailProject(req, res){
  const {id} = req.params

  console.log(id);

  res.render('detail-project', {id})
}

function oop(req, res){
  res.render('oop')
}




app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`)
})