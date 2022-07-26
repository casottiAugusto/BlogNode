const express =require ("express");
const router =express.Router();
const User =require("./User");
const bcrypt =require("bcryptjs")


router.get("/admin/user",(req,res)=>{
  User.findAll().then((user)=>{
    res.render("admin/user/index",{user:user});

  })
});
router.get("/admin/user/create",(req,res)=>{
 res.render("admin/user/create")
});
router.post("/user/create",(req,res)=>{
  let email =req.body.email;
  let pwd = req.body.pasw;
User.findOne({where:{email:email}}).then(user=>{
  if (user == undefined) {
    let salt =bcrypt.genSaltSync(10);
    let hash =bcrypt.hashSync(pwd,salt);
  
    User.create({
      email:email,
      password:hash
    }).then(()=>{
      res.redirect("/")
    }).catch((err)=>{
      res.json(err)
  
    })  
  }else{
    res.redirect("/admin/user/create");
  }
})
  
  
 
});
module.exports=router;