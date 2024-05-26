const Task = require("../models/Task");

exports.addtask = async (req, res) => {
  try {
    const task = new Task({
      user: req.body.user,
      title: req.body.title,
      content: req.body.content,
      field: req.body.field,
      priority: req.body.priority,
      is_done: req.body.is_done,
      deadline: req.body.deadline,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.edittask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        user: req.body.user,
        title: req.body.title,
        content: req.body.content,
        field: req.body.field,
        priority: req.body.priority,
        is_done: req.body.is_done,
        deadline: req.body.deadline,
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletetask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.gettask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
