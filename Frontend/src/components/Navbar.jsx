import "./Styles/Navbar.css";

export const Navbar = ({ online, user }) => {
  return (
    <div className="navbar">
      <div>
        <i className="bx bxs-user-circle"></i>{" "}
        <p>
          {user}
          <br />
          <span>{online ? "Online" : ""}</span>
        </p>
      </div>
    </div>
  );
};
