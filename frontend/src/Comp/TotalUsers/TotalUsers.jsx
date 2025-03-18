import React from "react";

const TotalUsers = ({ loading, users, error }) => {
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          ?.filter((user) => user.role !== "admin") 
          .map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <span className="text-sm font-medium text-blue-600 mt-2 block">
                Role: {user.role}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TotalUsers;
