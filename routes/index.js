var express = require('express');
var router = express.Router();

// MySQL
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '設定したパスワード',
	database: 'list_app'
});

// レシピの追加
router.post('/recipes', function (req, res, next) {
	// リクエストのパラメータを取得
	const title = req.body.title;
	const making_time = req.body.making_time;
	const serves = req.body.serves;
	const ingredients = req.body.ingredients;
	const cost = req.body.cost;

	const insertsql = 'INSERT INTO recipes (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)';

	connection.query(
		insertsql, [title, making_time, serves, ingredients, cost],
		(error, results) => {
			// レシピ登録失敗
			if (error) {
				console.log(error);
				res.status(200).json({
					message: 'Recipe creation failed!',
					required: 'title, making_time, serves, ingredients, cost'
				});
				return;
			}
			// レシピ登録成功
			if (results.affectedRows === 1) {
				const selectsql = 'SELECT * FROM recipes WHERE id = ?';
				connection.query(
					selectsql, [results.insertId],
					(error, results) => {
						if (error) {
							console.log(error);
							res.status(200).json({
								message: 'Recipe creation failed!',
								required: 'title, making_time, serves, ingredients, cost'
							});
							return;
						}
						res.status(200).json({
							message: 'Recipe successfully created!',
							recipe: results[0]
						});
					}
				);
			}
		}
	);

});

router.get('/recipes', function (req, res, next) {
	const selectsql = 'SELECT * FROM recipes';

	connection.query(
		selectsql,
		(error, results) => {
			res.status(200).json({
				recipes: [
					...results
				]
			});
		}
	);
});

router.get('/recipes/:id', function (req, res, next) {
	const selectsql = 'SELECT * FROM recipes WHERE id = ?';
	// idをパラメータから取得(ない場合は0)
	const id = req.params.id;
	if (id == null) {
		id = 1;
	}

	connection.query(
		selectsql, [id],
		(error, results) => {
			res.status(200).json({
				message: 'Recipe details by id',
				recipes: [
					...results
				]
			});
		}
	);
});

router.patch('/recipes/:id', function (req, res, next) {
	// idをパラメータから取得(ない場合は0)
	const id = req.params.id;
	if (id == null) {
		id = 1;
	}
	const title = req.body.title;
	const making_time = req.body.making_time;
	const serves = req.body.serves;
	const ingredients = req.body.ingredients;
	const cost = req.body.cost;

	const updatesql = 'UPDATE recipes SET title = ?, making_time = ?, serves = ?, ingredients = ?, cost = ? WHERE id = ?';

	connection.query(
		updatesql, [title, making_time, serves, ingredients, cost, id],
		(error, results) => {
			res.status(200).json({
				message: 'Recipe successfully updated!',
				recipe: {
					title: title,
					making_time: making_time,
					serves: serves,
					ingredients: ingredients,
					cost: cost
				}
			});
		});

});

router.delete('/recipes/:id', function (req, res, next) {
	// idをパラメータから取得(ない場合は0)
	const id = req.params.id;
	if (id == null) {
		id = 1;
	}

	const deletesql = 'DELETE FROM recipes WHERE id = ?';
	connection.query(
		deletesql, [id],
		(error, results) => {
			if (error) {
				res.status(200).json({
					message: 'No Recipe found'
				});
				return;

			} else {
				res.status(200).json({
					message: 'Recipe successfully removed!'
				});
			}
		});
});

module.exports = router;