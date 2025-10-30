import React from "react";
import Home from "../pages/Home";
import Login from "./Login";
import ProtectedRoute from "../ProtectedRoute";
import { Route, Routes } from "react-router";

const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default UserRoutes;
