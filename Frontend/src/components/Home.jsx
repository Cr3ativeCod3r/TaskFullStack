import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login.jsx";
import bg from "../assets/bg.svg";
import { useNavigate, Navigate } from "react-router-dom";
import RegisterForm from "./Register.jsx";
import "../media.css";

function Modal({ isOpen, onClose, formType }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="modal-box relative bg-slate-700 p-5 rounded flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          {formType === "register" ? <RegisterForm /> : <Login />}
        </div>
      </div>
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();

  const nav = () => {
    navigate("/home");
  };
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("register");

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <p className="flex justify-center font-bold welcome">
            Increase your efficiency with our task manager!
          </p>
          <p className="flex mt-10 justify-center font-bold welcome">
            Don't have an account?
            <span
              className="cursor-pointer text-green-500 underline"
              onClick={() => {
                setFormType("register");
                setIsModalOpen(true);
              }}
            >
              Join us.
            </span>
          </p>
          <div className="mt-10 w-full flex justify-center">
            <Login />
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            formType={formType}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
