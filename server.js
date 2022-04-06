require('dotenv').config()
const passwordReset=require('./routes/forgetpasswordReset')
const express =require('express')
const registerrouter=require('./routes/registerroutes')
const app=express()







app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/',registerrouter)
app.use('/forgetpassword', passwordReset)

//app.get('/',(Request,Response,next)=>{
    //Response.send('welcome to api')})

app.listen(5000,()=>console.log('server run in port 5000'))