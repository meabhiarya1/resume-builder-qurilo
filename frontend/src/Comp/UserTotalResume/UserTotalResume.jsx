import React from "react";

const UserTotalResume = ({
  pdfsInfo,
  handleViewResume,
  setSelectedResumeType,
}) => {
  if (pdfsInfo.length === 0 || !pdfsInfo) return null;

  return (
    <div
      className="p-6  border border-gray-200 flex flex-col m-2 overflow-auto rounded-lg "
      onClick={() => setSelectedResumeType("Resumes")}
    >
      <h2 className="text-2xl font-bold  mx-auto p-2 text-center">Resumes</h2>
      <div className=" flex-shrink-0">
        <div className="flex  p-4 border rounded-lg shadow-lg bg-white  overflow-x-auto">
          {pdfsInfo?.map((pdf) => (
            <div
              key={pdf._id}
              className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:scale-105 w-[300px] flex-shrink-0"
              onClick={() => handleViewResume(pdf)}
            >
              {pdf.images?.[0] && (
                <img
                  src={`${
                    import.meta.env.VITE_BASE_URL
                  }/${pdf.images[0].path.replace(/\\/g, "/")}`}
                  alt="Resume Preview"
                  className="w-full h-56 object-contain rounded mb-2"
                />
              )}

              <h3 className="text-sm font-semibold text-center truncate max-w-full">
                {pdf.pdfName}
              </h3>
            </div>
          ))}
        </div>
      </div>{" "}
    </div>
  );
};

export default UserTotalResume;
