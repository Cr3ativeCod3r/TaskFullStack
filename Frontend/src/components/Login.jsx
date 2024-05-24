import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const user = useSelector((state) => state.user);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BackURL + `/login`,
        formData
      );
      dispatch({ type: "LOGIN", payload: data });
      Cookies.set("user", JSON.stringify(data));
      window.location.href = "/";


    } catch (error) {
      setError(error.response.data.message);
    } 
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-slate-800 rounded-md mt-20">
      <div className="form-control">
        <label className="label capitalize">email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="form-control">
        <label className="label capitalize">password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <button
        type="submit"
        disabled={!isFormValid }
        className="btn btn-primary w-80 mt-5"
      >
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default Login;
