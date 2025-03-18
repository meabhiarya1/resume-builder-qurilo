import React from "react";

const TotalUsers = ({ loading, users, error, handleUserPdfs }) => {
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-6">
      <h2 className="text-2xl font-bold mb-4 text-center"> Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          ?.filter((user) => user.role !== "admin") // Exclude admin users
          .map((user) => (
            <div
              key={user._id}
              className="flex flex-col bg-white rounded-3xl shadow-lg border border-gray-200"
            >
              <div className="px-6 py-8 sm:p-10 sm:pb-6">
                <div className="grid items-center justify-center w-full text-left">
                  <div>
                    <h2 className="text-lg font-medium tracking-tighter text-gray-600 lg:text-2xl">
                      {user.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex px-6 pb-8 sm:px-8 ">
                <button
                  className="cursor-pointer flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
                  onClick={() => handleUserPdfs(user)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TotalUsers;
