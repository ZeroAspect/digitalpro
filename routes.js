const express = require('express')
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const { marked } = require("marked")
const path = require("path")
const GetIP = require('./funcs/ip.js')
const Users = require('./models/User.js')
const db = require('./sequelize/sequelize.js')
const mysql = require("mysql2")
const MySQL = require('./connections/mysql.js')
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
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    // res.json(user)
    if(user === null){
      res.redirect('/login')
    } else{
      res.render('blog')
    }
  } catch(err){
    console.error(err)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.get('/login', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.render('login')
    } else{
      res.redirect('/blog')
    }
  }catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.post('/login', async(req, res)=>{
  const ip = await GetIP()
  const { email, senha } = req.body
  try{
    const user = await Users.findOne({
      where: {
        email: email,
        senha: senha
      }
    })
    if(user === null){
      const error = `
      <p class="text-danger">Email ou senha invalidos.</p>`
      res.render('login', { error })
    } else{
      await Users.update(
        { ip: ip },
        {
          where: {
            email: email,
            senha: senha
          }
        }
      )
      res.redirect('/blog')
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.get('/cadastro', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.render('cadastro')
    } else{
      res.redirect('/blog')
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.post('/cadastro', async(req, res)=>{
  const ip = await GetIP()
  const { nome, email, senha } = req.body
  console.log(req.body)
  const formatNome = await nome.replace(' ', '')
  const nomeString = await formatNome.toLowerCase()
  try{
    const user = await Users.create({
      nome: nomeString,
      email: email,
      senha: senha,
      biografia: marked("**Olá mundo!!**"),
      ip: ip,
      data: Date()
    })
    console.log(user)
    res.redirect('/login')
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})