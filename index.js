const express = require('express');
const app = express();
const bodyParse = require('body-parser');
const connection = require('./Database/connection');
const session =require("express-session")
//Controller e Modúlo 
const categoriesController = require('./categories/catagoriesController');
const Category = require('./categories/category');
//Controller e Modúlo
const articlesController = require('./articles/articlesController');
const Article = require('./articles/article');
//Contorler e Modúle
const UserController=require("./user/UserController");
const User =require("./user/User");
/*
usuário padrao 
usuário: denis.homenick@hotmail.com
senha:l5GfBf
*/
//View Enginer
app.set('view engine', 'ejs');
// Configurar secoues 
app.use(session({
	secret:"sdfiasjhpofaksm",cookie:{maxAge:30000}
}))
//Body parser
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
//static
app.use(express.static('public'));
//DataBase
connection
	.authenticate()
	.then(() => {
		//console.log('Concxão feita com sucesso');
	})
	.catch((e) => {
		console.log(e);
	});
//Pasando o controller para aplicação
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/',UserController);

//Rota Principla
app.get('/', (req, res) => {
	Article.findAll({
		order: [ [ 'id', 'desc' ] ],
		limit:4
	}).then((articles) => {
		Category.findAll().then((categories)=>{
			res.render("index",{article: articles,categories:categories})
		})
	});
});

//Rota do Slug para acessar os artigos 
app.get('/:slug', (req, res) => {
	var slug = req.params.slug;
	Article.findOne({
		where: {slug:slug}
	})
		.then((article) => {
			if (article != undefined) {
				Category.findAll().then((categories)=>{
					res.render("article",{article:article,categories:categories})
			})
			
		} else {
				res.redirect('/');
			}
		})
		.catch((err) => {
			res.redirect('/');
		});
});
//Rota cartegoria slug
app.get('/category/:slug', (req, res) => {
	var slug = req.params.slug;
	Category.findOne({
		where: {
			slug: slug
		},
		include: [ { model: Article } ]
	})
		.then((category) => {
			if (category != undefined) {
				Category.findAll().then(categories=>{
				res.render("index", { article: category.articles,categories:categories });
				})
				
			} else {
			
				res.redirect('/');
			}
		})
		.catch((err) => {
			res.redirect('/');
		});
});
//Rota Server
app.listen(8000, () => {
	console.log('O servidor esta funcionando');
});
