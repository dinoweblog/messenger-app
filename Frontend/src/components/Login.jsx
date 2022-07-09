import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/RegisterLogin.css";

import {
  getLogedin,
  loginAuthenticated,
  loginError,
  loginLoading,
  loginSuccess,
} from "../Redux/Login/action";

export const Login = () => {
  const [showPass, setShowPass] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = {
    email,
    password,
  };

  const getLogedin = (event) => {
    event.preventDefault();
    dispatch(loginLoading());

    fetch(`https://messenger-d.herokuapp.com/login`, {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "Application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setMsg(res.message);
        } else {
          dispatch(
            loginSuccess({
              token: res.token,
              user: res.user,
              userId: res.user._id,
            })
          );
          dispatch(loginAuthenticated("true"));

          navigate("/messenger");
        }
      })

      .catch((error) => dispatch(loginError()));
  };

  return (
    <div className="register_container login_container">
      <form onSubmit={getLogedin} className="form" action="">
        <h2>Login</h2>

        <input
          className={msg ? "border_color" : ""}
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={msg ? "border_color" : ""}
          type={showPass ? `password` : "text"}
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p>{msg}</p>

        <span>
          <input
            type="checkbox"
            onClick={() => {
              setShowPass(!showPass);
            }}
          />{" "}
          <span>Show Password</span>
        </span>

        <input type="submit" value="Login" />

        <div className="login_redirect_link">
          Are you a new user? <Link to={"/register"}>Sign up</Link>{" "}
        </div>
      </form>
    </div>
  );
};

// https://messenger-d.herokuapp.com/
