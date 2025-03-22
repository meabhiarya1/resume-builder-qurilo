import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 text-white flex flex-col md:flex-row items-center justify-between gap-3">
      <h1 className="text-lg font-semibold">Resume Builder</h1>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {user?.role === "admin" &&
          ["users", "templates", "uploads"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="cursor-pointer px-3 py-1 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all text-sm capitalize"
            >
              {tab}
            </button>
          ))}
      </div>

      {user && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">Hello, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
