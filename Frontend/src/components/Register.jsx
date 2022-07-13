import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/RegisterLogin.css";

export const Register = () => {
  const [showPass, setShowPass] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState([]);
  const [msg, setMsg] = useState("");
  const [userExists, setUserExists] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [fn, setFN] = useState("");
  const [ln, setLN] = useState("");
  const [emailE, setemailE] = useState("");
  const [passE, setpassE] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register";
  }, []);
  useEffect(() => {
    allErrorHandler();
  }, [msg, errorMsg]);

  const userDetails = {
    firstname,
    lastname,
    email,
    password,
  };

  const getRegister = (event) => {
    event.preventDefault();

    fetch(`https://messenger-d.herokuapp.com/register`, {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "Application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setErrorMsg(res.error);
        setMsg(res.message);
        setUserExists(res.userexists);
        allErrorHandler();
        !res.error && !res.message && !res.userexists
          ? navigate("/")
          : navigate("/register");
      })

      .catch((error) => console.log(error));
  };

  const allErrorHandler = () => {
    setFN("");
    setLN("");
    setemailE("");
    setpassE("");
    if (errorMsg) {
      errorMsg.map((e) => {
        if (e.field == "firstname") setFN(e.message);
        if (e.field == "lastname") setLN(e.message);
        if (e.field == "email") setemailE(e.message);
        if (e.field == "password") setpassE(e.message);
      });
    }
  };

  return (
    <div className="register_container">
      <div>
        <form onSubmit={getRegister} className="form" action="">
          <h2>Create new account.</h2>
          <div className="login_redirect_link">
            Already have an account? <Link to={"/"}>Login</Link>{" "}
          </div>
          <div className="username">
            <input
              className={fn ? "border_color" : ""}
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
            />

            <input
              className={ln ? "border_color" : ""}
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
            />
          </div>
          {fn ? <p>{fn}</p> : <p>{ln}</p>}
          <input
            className={emailE || msg ? "border_color" : ""}
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>{emailE}</p>
          <input
            className={passE ? "border_color" : ""}
            type={showPass ? `password` : "text"}
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>{passE}</p>
          <span>
            <input
              type="checkbox"
              onClick={() => {
                setShowPass(!showPass);
              }}
            />
            <span>Show Password</span>
          </span>
          <p>{userExists}</p>
          <input type="submit" value="Create Account" />
        </form>
      </div>
    </div>
  );
};
