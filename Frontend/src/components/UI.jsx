import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userSlice";
import logo from "../assets/task.svg";

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
    deadline: new Date().toISOString().split('T')[0],
  });
  
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Dodaj stan dla flagi edycji

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
      setIsEditing(false); // Zakończ edycję po zaktualizowaniu zadania
    } else {
      await addTask(task);
    }
    setTask({
      user: userId,
      title: "",
      content: "",
      priority: "Low",
      deadline: new Date().toISOString().split('T')[0],
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
    } catch (error) {
      console.error("Error updating task", error);
    }
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
    setIsEditing(true); // Rozpocznij edycję
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
    setIsEditing(false); // Zakończ edycję
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navbar */}
      <nav className="bg-gray-700 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-slate-400 flex items-center">
            <img src={logo} className="w-8 mr-2" alt="logo" />
            Task Manager
          </h1>
          <h1 className="text-white">
            {timezone} {time}{" "}
          </h1>
          <div>
            <span className="mr-4">
              {user.first_name} {user.last_name}
            </span>

            <button
              onClick={() => {
                dispatch(logout());
                location.reload();
              }}
              className="bg-slate-400 hover:bg-slate-300 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dodawanie zadania */}
      <div className="p-4 w-1/2 mr-auto ml-auto">
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
          
          {/* Pokaż przycisk "Cancel" tylko podczas edycji */}
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

      {/* Lista zadań */}
      <div className="overflow-x-auto flex-grow">
        <table className="table-auto mx-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {tasks.sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }).map((task, index) => (
    <tr key={task._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
      <td className="border px-4 py-2">{index + 1}</td>
      <td className="border px-4 py-2">{task.title}</td>
      <td className="border px-4 py-2">{task.content}</td>
      <td className="border px-4 py-2">{task.priority}</td>
      <td className="border px-4 py-2">
        {new Date(task.deadline).toLocaleDateString()}
      </td>
      <td className="border px-4 py-2">{task.is_done ? "Done" : "Not Done"}</td>
      <td className="border px-4 py-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => startEdit(task)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => deleteTask(task._id)}
        >
          Delete
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

