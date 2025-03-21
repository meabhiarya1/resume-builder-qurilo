import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative flex w-3/4 max-w-96 h-24 overflow-hidden bg-white shadow-lg rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" height="96" width="16">
          <path
            strokeLinecap="round"
            strokeWidth="2"
            stroke="indianred"
            fill="indianred"
            d="M 8 0 
             Q 4 4.8, 8 9.6 
             T 8 19.2 
             Q 4 24, 8 28.8 
             T 8 38.4 
             Q 4 43.2, 8 48 
             T 8 57.6 
             Q 4 62.4, 8 67.2 
             T 8 76.8 
             Q 4 81.6, 8 86.4 
             T 8 96 
             L 0 96 
             L 0 0 
             Z"
          ></path>
        </svg>

        <div className="flex flex-col justify-center mx-2.5 overflow-hidden w-full">
          <p className="text-xl font-bold text-[indianred] leading-8 truncate">
            Error !
          </p>
          <p className="text-sm text-zinc-400 leading-5 max-h-10">
            Oh no! You should login before posting.
          </p>
        </div>

        <div className="p-2 w-full flex justify-center">
          <button
            className="px-4 py-1.5 bg-[indianred] text-white rounded-md shadow-md hover:bg-red-600 transition cursor-pointer"
            onClick={() => {
              const token = localStorage.getItem("token");
              token ? navigate("/dashboard") : navigate("/");
            }}
          >
            Go to {localStorage.getItem("token") ? "Dashboard" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
