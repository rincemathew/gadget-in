//image upload using multer(npm-multer)
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null,'public/uploads')
    },
    filename:(req, file, cb) =>{
        cb(null, Date.now() + '-' + path.extname(file.originalname))
    }
})


const upload = multer({storage:storage}).array('image',6)

module.exports = upload