const express= require('express')
const {engine}= require('express-handlebars')
const expressSession= require('express-session')
const fileUpload =require( 'express-fileupload')
const dotenv = require('dotenv')
const path= require('path')
const dbs= require(path.join(__dirname, 'dbs.js'))
const crypto = require('crypto')
const cron = require('node-cron');
const Reminder = require('./model/reminderModal');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
console.log(crypto.randomBytes(64).toString('hex'))
const userPage = require('./router/userPage');
//Db connect
dbs() 

//Başlangıç ayarları
dotenv.config()
const app= express()

 //Değişkenler
const time = 1000*60*30
const SECRET_VALUE=process.env.SECRET_VALUE || 'myBlog'
const PORT= process.env.PORT || 5000
const API_URL = process.env.API_URL || 'http://127.0.0.1:5000'

// Handlebars helper'ları
const hbs = engine({
    helpers: {
        eq: function (a, b) {
            return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
        }
    }
});

 //Şablon motorumuzun bulunduğu alan
app.engine('handlebars', hbs)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//arayazılım
app.use(express.json())
app.use(fileUpload())
app.use(expressSession({
    secret:SECRET_VALUE,
    resave:false,
    saveUninitialized:true,
    cookie:{path: '/', httpOnly:true,secure:false, maxAge:time}
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));

//*Router tanımlama alanı
const indexPage= require(path.join(__dirname,'router', 'indexPage.js'))
const dashboardPage= require(path.join(__dirname,'router', 'dashboardPage.js'))
const dersprogramiPage= require(path.join(__dirname,'router', 'dersprogramiPage.js'))
const devamsizlikPage= require(path.join(__dirname,'router', 'devamsizlikPage.js'))
const reminderPage= require(path.join(__dirname,'router', 'reminderPage.js'))
const loginPage= require(path.join(__dirname,'router', 'loginPage.js'))
const signupPage= require(path.join(__dirname,'router', 'signupPage.js'))
const notHesaplamaPage= require(path.join(__dirname,'router', 'notHesaplamaPage.js'))


app.use('/',(req,res,next)=>{
 const{userID, userName}=req.session
 if(userID){
    res.locals.user=true
    res.locals.userName=userName
 }else{
    res.locals.user=false
    res.locals.userName=null
 }
 next()
})



//*Router kullanım alanı

app.use('/', indexPage)
app.use('/dashboard', dashboardPage)
app.use('/dersprogrami', dersprogramiPage)
app.use('/devamsizlik', devamsizlikPage)
app.use('/login', loginPage)
app.use('/notHesaplama', notHesaplamaPage)
app.use('/reminder', reminderPage)
app.use('/signup', signupPage)
app.use('/users', userPage);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- CRON JOB BAŞLANGIÇ ---
cron.schedule('* * * * *', async () => {
  console.log('CRON ÇALIŞTI');
  const now = new Date();
  const reminders = await Reminder.find({ sent: false, date: { $lte: now } });
  console.log('Bulunan hatırlatıcılar:', reminders);
  for (const reminder of reminders) {
    if (reminder.notifyType === 'email' && reminder.email) {
      console.log('Mail gönderiliyor:', reminder.email);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: reminder.title,
        text: reminder.description
      });
      console.log('E-posta gönderildi:', reminder.email);
    } else if (reminder.notifyType === 'sms' && reminder.phone) {
      console.log('SMS gönderimi devre dışı:', reminder.phone);
    }
    reminder.sent = true;
    await reminder.save();
  }
});
// --- CRON JOB BİTİŞ ---

app.listen(PORT, ()=>{
    console.log(`Server is running ${API_URL}`)
    console.log("Sunucu başladı")
})

module.exports.transporter = transporter;
