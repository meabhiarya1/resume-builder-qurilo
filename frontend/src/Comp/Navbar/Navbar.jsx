import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);


  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-lg">Resume Builder</h1>
      <div>
        {user && (
          <>
            <span className="mr-4">Hello, {user?.name}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded cursor-pointer">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
