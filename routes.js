const express = require('express')
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const { marked } = require("marked")
const path = require("path")
const GetIP = require('./funcs/ip.js')
const Users = require('./models/User.js')
const db = require('./sequelize/sequelize.js')

app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname + "/public/")))

app.get('/', async(req, res)=>{
  res.render('home')
})
app.get('/sobre', async(req, res)=>{
  res.render('sobre')
})
app.get('/termos-de-uso', async(req, res)=>{
  res.render('termos')
})
app.get('/test', async(req, res)=>{
  const ip = await GetIP()
  res.json(ip)
})
app.get('/blog', async(req, res)=>{
  const ip = await GetIP()
  try{
    
  } catch(err){
    console.error(err)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})