const multer = require("multer")


const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'images/posts/')
  },
  filename: function(req, file, cb){
    const fileExtension = file.originalname.split('.')[1]

    const newFileName = require("crypto").randomBytes(32).toString('hex')
    cb(null, `${newFileName}.${fileExtension}`)
  }
})


const upload = multer({ storage })

module.exports = upload