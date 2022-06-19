const express = require('express');
const app = express();
const bodyParse = require('body-parser');
const connection = require('./Database/connection');
const categoriesController = require('./categories/catagoriesController');
const articlesController = require('./articles/articlesController');
const Article = require('./articles/article');
const Category = require('./categories/categoriy');

//View Enginer
app.set('view engine', 'ejs');
//Body parser
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
//static
app.use(express.static('public'));
//DataBase
connection
	.authenticate()
	.then(() => {
		console.log('Concxão feita com sucesso');
	})
	.catch((e) => {
		console.log(e);
	});
//Pasando o controller para aplicação
app.use('/', categoriesController);
app.use('/', articlesController);
app.get('/', (req, res) => {
	Article.findAll().then(article=>{
		res.render('home',{article:article});
	})
});
app.get("/:slug",(req,res)=>{
	var slug=req.params.slug;
	Article.findOne({
		where:{slug:slug}
	}).then(article => {
		if (article != undefined) {
			res.render("article",{article:article});
			
		}else{
			res.redirect('/')
		}
	}).catch(err=>{
		res.render("/");
	})

})
app.listen(8000, () => {
	console.log('O servidor esta funcionando');
});
