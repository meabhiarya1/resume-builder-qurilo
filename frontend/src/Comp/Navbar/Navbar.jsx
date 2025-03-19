import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-lg flex items-center">Resume Builder</h1>
      <div className="flex gap-4">
        {" "}
        {user?.role === "admin" &&
          ["users", "templates", "uploads"].map((tab) => (
            <div
              key={tab}
              className="bg-gradient-to-b from-stone-300/40 to-transparent rounded-[16px]"
            >
              <button
                className={`group px-[3px] rounded-[12px] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
                active:scale-[0.995] w-full cursor-pointer`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="  rounded-[8px] px-2 py-1">
                  <div className="flex gap-2 items-center justify-center">
                    <span className="capitalize">{tab}</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        {user && (
          <>
            <span className="mr-4 text-sm text-center flex items-center">
              Hello, {user?.name}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
