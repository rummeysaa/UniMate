const mongoose = require('mongoose')
const dotenv = require ('dotenv')
dotenv.config()

const conn =()=>{
    mongoose.connect(process.env.DB_URL,{
        dbName: 'myBlog'
    }).then(()=>{
console.log('DB connected')
    })
    .catch((hata)=>{
        console.log(Error)
    })
}
module.exports =conn