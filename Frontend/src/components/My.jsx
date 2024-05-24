import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/userSlice';

function My() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
//   const [shouldNavigate, setShouldNavigate] = useState(true);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
  
<div className="flex flex-col items-center justify-center h-screen bg-gray-800">
<h1 className="text-white text-3xl mb-4">
  Welcome {user.first_name} {user.last_name}!
</h1>
<button
  onClick={() => {
    dispatch(logout());
    location.reload()
  }}
  className="text-white text-lg bg-blue-500 px-4 py-2 rounded"
>
  Logout
</button>
</div>
  );
}

export default My;
