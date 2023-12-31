const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

const { auth } = require("../middlewares/auth");

router.post("/createTodo", auth, async (req, res) => {
	try {
		const { id } = req.user;
		const { title, body } = req.body;
		const response = await Todo.create({ author: id, title, body });
		res.status(200).json({
			success: true,
			data: response,
			message: "Entry created successfully",
		});
	} catch (err) {
		console.error(err);
		console.log(err);
		res.status(500).json({
			success: false,
			data: "Internal Server Error",
			message: err.message,
		});
	}
});

router.get("/getTodos", auth, async (req, res) => {
	const { id } = req.user;
	try {
		const todos = await Todo.find({ author: id });
		res.status(200).json({
			success: true,
			data: todos,
			message: "Entire todo list has been fetched successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
			message: err.message,
		});
	}
});

router.get("/getTodos/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const todos = await Todo.find({ author: id });
		res.status(200).json({
			success: true,
			data: todos,
			message: "Entire todo list of a user been fetched successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
			message: err.message,
		});
	}
});

router.put("/updateTodo/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const { title, body } = req.body;
		const todo = await Todo.findByIdAndUpdate({ _id: id }, { title, body }, {new: true});
		res.status(200).json({
			success: true,
			data: todo,
			message: "Updated successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
			message: err.message,
		});
	}
});

router.put("/updateTodoStatus/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const todo = await Todo.findById(id);

		if (!todo) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		todo.status = !todo.status;
		await todo.save();

		res.status(200).json({
			success: true,
			data: todo,
			message: "Todo status toggled successfully",
		});
        
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
			message: error.message,
		});
	}
});

router.delete("/deleteTodo/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;

		await Todo.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: "Todo successfully deleted",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
			message: err.message,
		});
	}
});

module.exports = router;
