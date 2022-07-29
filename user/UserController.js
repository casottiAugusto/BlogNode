const express =require ("express");
const router =express.Router();
const User =require("./User");
const bcrypt =require("bcryptjs")
const adminAuth= require("../middleware/authenticatio");


router.get("/admin/user",adminAuth,(req,res)=>{
  User.findAll().then((user)=>{
    res.render("admin/user/index",{user:user});

  })
});
router.get("/admin/user/create",adminAuth,(req,res)=>{
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
router.get("/login",(req,res)=>{
  res.render("admin/user/login")
});
router.post("/authenticate",(req,res)=>{
  var email=req.body.email;
  var password =req.body.pasw;

  User.findOne({where:{email:email}}).then(user =>{
    if (user != undefined) {
      var correct = bcrypt.compareSync(password,user.password);
      if (correct) {
        req.session.user={
          id:user.id,
          email:user.email
        }
        res.redirect("/admin/articles");
        
      }else{
        res.redirect("/login");
      }
    }else{
      res.redirect("/login");
    }
  })
})
router.get("/logout",(req,res)=>{
  req.session.user =undefined;
  res.redirect("/")
})
module.exports=router;