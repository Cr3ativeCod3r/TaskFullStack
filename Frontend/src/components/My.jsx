import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UI from "./UI.jsx";


function My() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-800  w-full">
      <UI />
    </div>
  );
}

export default My;
