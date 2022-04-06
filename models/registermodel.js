const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const joi=require('joi')

const schemaval = joi.object({
   nm:joi.string().alphanum().min(2).max(20).required(),
   em:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
})

let schemaregister= mongoose.Schema({
    name:String,
    email:String,
    password:String
})
let url= "mongodb://localhost:27017/lepidor_data"
var User= mongoose.model('user',schemaregister)


exports.register=(name,email,password)=>{     
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{ 
            
            let validation=  schemaval.validate({nm:name,em:email})
            if(validation.error){
                mongoose.disconnect()
                reject(validation.error.details[0].message)
            }
                return User.findOne({email:email})

               
        }).then((doc)=>{
                if(doc){
                    mongoose.disconnect()
                    reject('this email is exist')
                   
                 }else{
                    
                      bcrypt.hash(password,10).then((hpassword)=>{
                        let user=new User({
                            name:name,
                            email:email,
                            password:hpassword
                        })
                        user.save().then((user)=>{
                            mongoose.disconnect()
                            resolve(user)
                 
                     }).catch((err)=>{
                       mongoose.disconnect()
                        reject(err)
              
            })
            }).catch((err)=>{
                mongoose.disconnect()
                reject(err)
            })
             
        }
    })

})}



var privatekey="this is my secret key"
exports.login=(email,password)=>{     
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{  //ya3ml connect
                return User.findOne({email:email})
                
             }).then((user)=>{
                if(!user){
                    mongoose.disconnect()
                    reject('we dont have this email in our database')
                 }else{
                      bcrypt.compare(password,user.password).then((same)=>{
                        if(same){
                           let token= jwt.sign({id:user._id,username:user.username},privatekey,{
                               expiresIn: '1h'
                           })
                           mongoose.disconnect()
                            resolve(token)
                            jwt.decode()
                        }else{
                            mongoose.disconnect()
                            reject('invalide password')
                        }
                     }).catch((err)=>{
                       mongoose.disconnect()
                       reject(err)
              
            })   
         }
})
}
)} 