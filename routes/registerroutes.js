const route=require('express').Router()
const { JsonWebTokenError } = require('jsonwebtoken')
const routemodel=require('../models/registermodel')


var privatekey="this is my secret key"
verifyToken=(req,res,next)=>{
    let token=req.headers.authorization
    if(!token){
        res.status(400).json({msg:'acces rejected..!!'})
    }
    try{
       Jwt.verify(token,privatekey)
       next()
    }catch(e){
        res.status(400).json({msg:e})
    }


}

//const body=require('express').urlencoded({extended:true})
route.post('/register',verifyToken,(Request,Response,next)=>{
    routemodel.register(Request.body.name,Request.body.email,Request.body.password)
    .then((user)=>Response.status(200).json({user:user,msg:"added"}))
    .catch((err)=>Response.status(400).json({error:err}))

})
route.post('/login',verifyToken,(Request,Response,next)=>{
    let token=req.headers.authorization
    let user=jwt.decode(token,{complete:true})
    routemodel.login(Request.body.email,Request.body.password)
    .then((token)=>Response.status(200).json({token:token,user:user}))
    .catch((err)=>Response.status(400).json({error:err}))
      
})

module.exports=route
