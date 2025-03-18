import React from "react";

const UserTotalResume = ({ pdfsInfo, handleViewResume }) => {

  return (
    <div className="p-6 max-w-5xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Total Resumes
      </h2>

      <div className="w-[400px] flex-shrink-0">
        <div className="overflow-y-auto max-h-[600px] grid grid-cols-2 gap-4 p-4 border rounded-lg shadow-lg bg-white">
          {pdfsInfo?.map((pdf) => (
            <div
              key={pdf._id}
              className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:scale-105"
              onClick={() => handleViewResume(pdf)}
            >
              <h3 className="text-sm font-semibold max-w-sm text-center">
                {pdf.pdfName}
              </h3>
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default UserTotalResume;
