import React from "react";

const TotalUsers = ({ loading, users, error, handleUserPdfs }) => {
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-6 flex flex-col justify-between items-center gap-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-50">
        Users
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24  ">
        {users
          ?.filter((user) => user.role !== "admin")
          .map((user) => (
            <div
              key={user?._id}
              className="flex flex-col rounded-3xl shadow-lg border-3 border-gray-500 max-w-[300px] justify-between items-center"
            >
              <div className="px-6 py-8 sm:p-10 sm:pb-6">
                <div className="grid items-center justify-center w-full text-left">
                  <img
                    src="../src/assets/dp.jpg"
                    alt="Users"
                    className="w-20 h-20 mx-auto m-4 rounded-2xl object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-medium tracking-tighter text-amber-50 lg:text-2xl text-center">
                      {user?.name}
                    </h2>
                    <p className="mt-2 text-sm text-amber-50 text-center">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex px-6 pb-8 sm:px-8 ">
                <button
                  className="cursor-pointer flex items-center justify-center w-full px-6 py-2.5 text-center text-amber-50 duration-200 bg-black border-2 border-black rounded-full hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
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
