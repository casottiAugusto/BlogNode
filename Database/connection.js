const Sequelize = require("sequelize");

const connection =new Sequelize('blog',"root","302080",{
host:'localhost',
dialect:'mysql',
timezone: "-3:00"
});
module.exports= connection;