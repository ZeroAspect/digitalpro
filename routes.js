const express = require('express')
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const { marked } = require("marked")
const path = require("path")
const GetIP = require('./funcs/ip.js')
const Users = require('./models/User.js')
const db = require('./sequelize/sequelize.js')
// const mysql = require("mysql2")
const MySQL = require('./connections/mysql.js')
const Posts = require('./models/Posts.js')
const Comentario = require('./models/Comentarios.js')
const nodemailer = require('nodemailer')
const sendEmail = require('./email/nodemailerConfig.js')

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
  const mysql = await MySQL()
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
      const [ posts, rows ] = await mysql.query(`SELECT * FROM Posts ORDER BY post_like DESC`)
      res.render('blog', { posts })
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
app.get('/publicar', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else{
      res.render('publicar')
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.post('/publicar', async(req, res)=>{
  const ip = await GetIP()
  const { titulo, conteudo } = req.body
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else{
      await Posts.create({
        nome: user['nome'],
        titulo: titulo,
        conteudo: marked(conteudo),
        data: Date()
      })
      res.redirect('/blog')
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.get('/blog/post/:id', async(req, res)=>{
  const mysql = await MySQL()
  const ip = await GetIP()
  const { id } = req.params
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else{
      const [ post, rows ] = await mysql.query(`SELECT * FROM Posts WHERE id = ${id}`)
      const [ coment, rowsComent ] = await mysql.query(`SELECT * FROM Comentarios WHERE post_id = ${id}`)
      res.render('post', { post, coment })
    }
  } catch(err){
    console.error(err)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.post('/blog/post/:id/like', async(req, res)=>{
  const mysql = await MySQL()
  const ip = await GetIP()
  const { id } = req.params
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.status(403).json({ error: 'Você não pode curtir este post.' })
    } else{
      await mysql.query(`UPDATE Posts SET post_like = post_like + 1 WHERE id = ${id}`)
      res.status(200).redirect(`/blog/post/${id}`)
      console.log({ message: 'Post curtiado com sucesso.' })
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.post('/blog/post/:id/comment', async(req, res)=>{
  const mysql = await MySQL()
  const ip = await GetIP()
  const { id } = req.params
  const { comentario } = req.body
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.status(403).json({ error: 'Você não pode comentar este post.' })
    } else{
      await Comentario.create({
        nome: user['nome'],
        comentario: marked(comentario),
        post_id: id,
        data: Date()
      })
      res.status(200).redirect(`/blog/post/${id}`)
      console.log({ message: 'Comentário postado com sucesso.' })
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorre um erro interno.' })
  }
})
app.get('/editar/perfil', async(req, res)=>{
  const ip = await GetIP()
  const mysql = await MySQL()
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else{
      const [ findUser, rows ] = await mysql.query(`SELECT * FROM Users WHERE ip = '${ip}'`)
      res.render('editar', { user: findUser })
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})
app.post('/editar/perfil', async(req, res)=>{
  const mysql = await MySQL()
  const ip = await GetIP()
  const { email, senha, biografia } = req.body
  try{
    const user = await Users.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else{
      await Users.update(
        { email, senha, biografia: marked(biografia) },
        {
          where: {
            ip: ip
          }
        }
      )
      await sendEmail({
        to: user['email'],
        subject: 'DigitalPro: Atualizações no perfil.',
        text: 'Seu perfil foi editado com sucesso.'
      })
      res.redirect('/editar/perfil')
      console.log({ message: 'Perfil editado com sucesso.' })
    }
  } catch(error){
    console.error(error)
    res.status(500).json({ error: 'Ocorreu um erro interno.' })
  }
})