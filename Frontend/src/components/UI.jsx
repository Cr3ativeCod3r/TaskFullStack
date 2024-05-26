import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userSlice";
import logo from "../assets/task.svg";
import { Link } from "react-router-dom";
import { FaChalkboard } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";

const TaskManager = () => {
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState("Europe/Warsaw");
  const fetchTime = async (tz) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BackURL + `/time?timezone=${tz}`
      );
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setTime(data.time);
        setTimezone(tz);
      }
    } catch (error) {
      console.error("Error fetching time:", error);
    }
  };

  useEffect(() => {
    fetchTime(timezone);
    const intervalId = setInterval(() => {
      fetchTime(timezone);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  const user = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const [task, setTask] = useState({
    user: userId,
    title: "",
    content: "",
    priority: "Low",
    deadline: new Date().toISOString().split("T")[0],
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async (user) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BackURL}/gettasks`
      );
      const filteredTasks = response.data.filter(
        (task) => task.user === userId
      );
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTaskId) {
      await updateTask(editingTaskId, task);
      setIsEditing(false);
    } else {
      await addTask(task);
    }
    setTask({
      user: userId,
      title: "",
      content: "",
      priority: "Low",
      deadline: new Date().toISOString().split("T")[0],
    });
    setEditingTaskId(null);
    fetchTasks();
  };

  const addTask = async (task) => {
    try {
      console.log(task);
      await axios.post(import.meta.env.VITE_BackURL + "/addtask", task);
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await axios.put(import.meta.env.VITE_BackURL + `/tasks/${id}`, task);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleCheckboxChange = (task) => {
    const updatedTask = { ...task, is_done: !task.is_done };
    updateTask(task._id, updatedTask);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_BackURL + `/deltasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const startEdit = (task) => {
    setTask(task);
    setEditingTaskId(task._id);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTask({
      user: userId,
      title: "",
      content: "",
      priority: "",
      deadline: "",
    });
    setEditingTaskId(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full w-4/5 mr-auto ml-auto mediacointainer ">
      {/* Navbar */}

      <nav className="bg-gray-700 text-white p-4 rounded-md mt-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} className="w-8 mr-2" alt="logo" />
            <h1 className="text-slate-400 ">Task Manager</h1>
          </div>
          <div className="hidden md:block flex-1 text-center">
            <h1 className="text-white text-xl font-bold">
              {timezone} {time}
            </h1>
          </div>

          <span className="mr-4 hidden md:block">
            {user.first_name} {user.last_name}
          </span>

          <div className="flex items-center space-x-4">
            <div className="avatar hidden md:block">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src="https://www.shareicon.net/data/2017/01/23/874893_management_512x512.png"
                  alt="user-avatar"
                />
              </div>
            </div>
            <ul className="menu lg:menu-horizontal bg-base-200 rounded-box relative">
              <li>
                <details className="relative z-10">
                  <summary>Menu</summary>
                  <ul className="space-y-1 absolute right-0 mt-8 bg-base-200  shadow-md rounded-md">
                    <li>
                      <button className="border bg-cyan-200 border-red-600 text-red-600 hover:bg-cyan-300 hover:text-white py-2 px-4 rounded w-full">
                        <Link
                          to="/board"
                          className="flex items-center space-x-2"
                        >
                          <FaChalkboard />
                          <span>Board</span>
                        </Link>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          location.reload();
                        }}
                        className="bg-slate-400 hover:bg-slate-300 text-white font-bold  rounded w-full text-center"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Dodawanie zadania */}
      <div className="p-4 mr-auto ml-auto w-4/5">
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={task.title}
            onChange={handleChange}
            className="block mb-2 p-2 w-full"
            required
          />
          <input
            type="text"
            name="content"
            placeholder="Content"
            value={task.content}
            onChange={handleChange}
            className="block mb-2 p-2 w-full"
          />
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="block mb-2 p-2 w-full"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            name="deadline"
            value={task.deadline}
            onChange={handleChange}
            className="block mb-2 p-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>

          {isEditing && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/*Zadania  wyswietl*/}
      <div className="flex-grow ">
        <table className="table-auto mx-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 sm:w-1/7 text-left"></th>
              <th className="px-4 py-2 sm:w-1/7 text-left">Title</th>
              <th className="px-4 py-2 sm:w-1/7 text-left">Notes</th>
              <th className="px-4 py-2 sm:w-1/7 text-left">Priority</th>
              <th className="px-4 py-2 sm:w-1/7 text-left">Deadline</th>
              <th className="px-4 py-2 sm:w-1/7 text-center">Status</th>
              <th className="px-4 py-2 sm:w-1/7 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={task._id}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${
                  task.is_done ? "bg-green-100" : ""
                }`}
              >
                <td className="border px-4 py-2 sm:w-1/7">{index + 1}</td>
                <td className="border px-4 py-2 sm:w-1/7">{task.title}</td>
                <td className="border px-4 py-2 sm:w-1/7">{task.content}</td>
                <td className="border px-4 py-2 sm:w-1/7">{task.priority}</td>
                <td className="border px-4 py-2 sm:w-1/7">
                  {new Date(task.deadline).toLocaleDateString()}
                </td>
                <td className="border py-2 sm:w-1/7">
                  <input
                    type="checkbox"
                    className="largerCheckbox mr-auto ml-auto flex"
                    checked={task.is_done}
                    onChange={() => handleCheckboxChange(task)}
                  />
                </td>
                <td className="border px-4 py-2 sm:w-1/7">
                  <button onClick={() => startEdit(task)}>
                    <FaEdit className="ml-4" />
                  </button>
                  <button onClick={() => deleteTask(task._id)}>
                    <FaTrash className="ml-8" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
