const Sequelize = require('sequelize');
const connection = require('../Database/connection');
const Category = require('../categories/category.js');

const Article = connection.define('articles', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	slug: {
		type: Sequelize.STRING,
		allowNull: false
	},
	body: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

Category.hasMany(Article);
Article.belongsTo(Category);
//Article.sync({force:true});

module.exports = Article;
