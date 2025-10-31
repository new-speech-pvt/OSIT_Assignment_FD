import React from "react";
import Login from "./Login";
import ProtectedRoute from "../ProtectedRoute";
import { Route, Routes } from "react-router";
import HomePage from "./HomePage";
import OSITAssignmentPreview from "./OSITAssignmentPreview";

const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/assignment/:ositAssigmnentId"
            element={<OSITAssignmentPreview />}
          />

        </Route>
      </Routes>
    </div>
  );
};

export default UserRoutes;
