import logo from "./logo.svg";
import "./App.css";

import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Messenger } from "./components/Messenger";
import { PrivateRoute } from "./components/Private/PrivateRoute";

function App() {
  const { isAuthenticated } = useSelector((state) => state.login);
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />}></Route>
      {/* <Route path="/login" element={<Login />}></Route> */}
      <Route
        path="/messenger"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Messenger />
          </PrivateRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
