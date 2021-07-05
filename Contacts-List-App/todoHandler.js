const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const userSchema = require('./userSchema');
const todoSchema = require('./todoSchema');
const checkLogin = require('./checkLoginMiddleware');

const User = new mongoose.model('User', userSchema);
const Todo = new mongoose.model('Todo', todoSchema);

// Get all the Todos
router.get('/', checkLogin, (req, res) => {
	Todo.find({ status: 'active' }, (err, data) => {
		if (err) {
			res.status(500).json({
				error: 'There was a server side error'
			});
		} else {
			res.status(200).json({
				result: data,
				message: 'Todos was shown successfully'
			});
		}
	});
});

// Get all filter Todos
router.get('/filter', checkLogin, (req, res) => {
	Todo.find({ status: 'active' })
		.populate('user', 'name username -_id')
		.select({
			_id: 0,
			__v: 0,
			date: 0
		})
		.limit(10)
		.exec((err, data) => {
			if (err) {
				res.status(500).json({
					error: 'There was a server side error'
				});
			} else {
				res.status(200).json({
					result: data,
					message: 'Todos was shown successfully'
				});
			}
		});
});

// Get a Todo by ID // using async await
router.get('/:id', async (req, res) => {
	try {
		const data = await Todo.find({ _id: req.params.id });
		res.status(200).json({
			result: data,
			message: 'Todos was shown successfully'
		});
	} catch (err) {
		res.status(500).json({
			error: 'There was a server side error'
		});
	}
});

// Get a active Todo by instance method
router.get('/actives', (req, res) => {
	const todo = new Todo();
	todo.findActive((err, data) => {
		if (err) {
			res.status(500).json({
				error: 'There was a server side error'
			});
		} else {
			res.status(200).json({
				data,
				message: 'Todo was inserted successfully'
			});
		}
	});
});

// Get a js Todo by static method
router.get('/js', async (req, res) => {
	const data = await Todo.findByJS();
	res.status(200).json({
		data,
		message: 'Todos was shown successfully'
	});
});

// Get Todos by Query helper
router.get('/hero', async (req, res) => {
	const data = await Todo.find().byHero('hero');
	res.status(200).json({
		data,
		message: 'Todos was shown successfully'
	});
});

// Post a Todo
router.post('/', checkLogin, async (req, res) => {
	const newTodo = new Todo({
		...req.body,
		user: req.userId
	});

	try {
		const todo = await newTodo.save();
		await User.updateOne(
			{
				_id: req.userId
			},
			{
				$push: {
					todos: todo._id
				}
			}
		);

		res.status(200).json({
			message: 'Todo was inserted successfully'
		});
	} catch (err) {
		res.status(500).json({
			error: 'There was a server side error'
		});
		next(err);
	}
});

// Post multiple Todos
router.post('/all', (req, res) => {
	Todo.insertMany(req.body, (err) => {
		if (err) {
			res.status(500).json({
				error: 'There was a server side error'
			});
		} else {
			res.status(200).json({
				message: 'Todos ware inserted successfully'
			});
		}
	});
});

// Put Todo
router.put('/:id', (req, res) => {
	Todo.updateOne(
		{ _id: req.params.id },
		{
			$set: {
				status: 'inactive'
			}
		},
		(err) => {
			if (err) {
				res.status(500).json({
					error: 'There was a server side error'
				});
			} else {
				res.status(200).json({
					message: 'Todo was updated successfully'
				});
			}
		}
	);
});

// Put Todo and get updated result
router.put('/update/:id', (req, res) => {
	const result = Todo.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				status: 'inactive'
			}
		},
		{
			new: true,
			useFindAndModify: false
		},
		(err) => {
			if (err) {
				res.status(500).json({
					error: 'There was a server side error'
				});
			} else {
				res.status(200).json({
					message: 'Todo was updated successfully'
				});
			}
		}
	);

	console.log(result);
});

// Delete Todo
router.delete('/:id', (req, res) => {
	Todo.deleteOne({ _id: req.params.id }, (err) => {
		if (err) {
			res.status(500).json({
				error: 'There was a server side error'
			});
		} else {
			res.status(200).json({
				message: 'Todo was deleted successfully'
			});
		}
	});
});

module.exports = router;
