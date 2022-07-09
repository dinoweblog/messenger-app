import "./Styles/Navbar.css";

export const Navbar = ({ text, user }) => {
  return (
    <div className="navbar">
      {user ? (
        <p>
          <span>{user.slice(0, 2).toUpperCase()}</span> {user}
        </p>
      ) : (
        <h3>{text}</h3>
      )}
    </div>
  );
};
