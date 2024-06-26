import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    lastname: "",
    nick: "",
    continent: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setLoading(true);
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_BackURL + `/register`,
          formData
        );

        setSuccess(data.message);

        setFormData({
          email: "",
          password: "",
          name: "",
          lastname: "",
          nick: "",
          continent: "",
        });

        setTimeout(function () {
          location.reload();
        }, 2000);
      } catch (error) {
        setError(error.response?.data.message || "Error");
      }
    } else {
      alert("Entry all data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 p-4">
      {Object.entries(formData).map(([key, value]) => {
        if (key === "continent") {
          return (
            <div key={key} className="form-control ">
              <label className="label capitalize">{key}</label>
              <select
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="">Pick Continent</option>
                <option value="North America">North America </option>
                <option value="Australia">Australia</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa </option>
                <option value="South America">South America</option>
              </select>
            </div>
          );
        } else {
          return (
            <div key={key} className="form-control">
              <label className="label capitalize">{key}</label>
              <input
                type={
                  key === "email"
                    ? "email"
                    : key === "password"
                    ? "password"
                    : "text"
                }
                name={key}
                value={value}
                onChange={handleChange}
                required
                className="input input-bordered w-full "
              />
            </div>
          );
        }
      })}
      <button
        type="submit"
        disabled={!isFormValid}
        className="btn btn-primary mt-10 meidar w-auto"
      >
        Register
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default Register;
