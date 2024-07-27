const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const Jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()

app.use(Express.json())
app.use(Cors())
Mongoose.connect("mongodb+srv://abytomy:Aby2905@cluster0.zupck9h.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")


//SignIN
app.post("/signIN", async (req, res) => {

    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
              const passwordvalidator=Bcrypt.compareSync(req.body.password,items[0].password)
              if(passwordvalidator){
                Jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                    (error,token)=>{
                        if (error) {
                            res.json({ "Status": " error","errorMessage": error})
                            
                        } else {
                            res.json({ "Status": " sucess","token": token,"userId":items[0]._id })
                            
                        }
                    }
                )

              }
              else {
              
                res.json({ "Status": "Invalid password" })
            }
            }
            else {
              
                res.json({ "Status": "Invalid emailID" })
            }

        }
    )

})
//SignUp

app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
 


    userModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                res.json({ "Status": "email ID already exists" })
            }
            else {
                let result = new userModel(input)
                result.save()
                res.json({ "Status": "success" })
            }
        }
    ).catch(
        (error)=>{}
    )
       

    })





app.listen(3030, () => {
    console.log("Server Started")
})
