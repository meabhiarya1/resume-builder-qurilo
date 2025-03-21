import React from "react";

const UsersResumeModals = ({
  pdfData,
  setIsModalOpen,
  setSelectedResume,
  setShowModalModalStatic,
  selectedUser,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-invert backdrop-opacity-30 backdrop-blur-sm z-50">
      {/* Modal Card */}
      <div className="w-[600px] p-4 relative flex flex-col items-center justify-center bg-gray-800 border border-gray-700 shadow-lg rounded-2xl mx-4">
        {/* Modal Content */}
        <div className="text-center p-3 flex-auto justify-center">
          <h2 className="text-xl font-bold py-4 text-gray-200">
            {selectedUser.name}'s Resumes
          </h2>{" "}
          <p className="text-md text-gray-300 px-2 mb-2">
           {selectedUser.email}
          </p>
          <p className="text-sm text-gray-400 px-2">
            Here are the uploaded resumes. Click "Show Details" to view more.
          </p>
        </div>

        <div className="w-full max-h-60 overflow-y-auto p-3 space-y-2">
          {pdfData?.length > 0 ? (
            pdfData.map((pdf, index) => (
              <div
                key={index}
                className="bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white truncate max-w-[300px]" >
                    {pdf.pdfName}
                  </h3>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 px-3 py-2 text-white text-sm rounded-lg cursor-pointer font-semibold"
                  onClick={() => {
                    setSelectedResume(pdf);
                    setShowModalModalStatic(true);
                  }}
                >
                  Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-red-400">No Resume found.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="p-2 mt-3 text-center space-x-2">
          <button
            className="bg-gray-700 px-5 py-2 text-sm font-medium border border-gray-600 text-gray-300 rounded-full hover:border-gray-500 hover:bg-gray-800 transition cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersResumeModals;
