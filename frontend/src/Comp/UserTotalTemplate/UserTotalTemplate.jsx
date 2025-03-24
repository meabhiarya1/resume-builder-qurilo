import React from "react";

const UserTotalTemplate = ({
  templates,
  handleViewResume,
  setSelectedResumeType,
}) => {
  return (
    <div
      className="p-6 border-gray-800 flex flex-col m-2 rounded-lg border-3 bg-black/30 min-h-[40vh]"
      onClick={() => setSelectedResumeType("Templates")}
    >
      <h2 className="text-2xl font-bold mx-auto p-2 text-center text-amber-50">
        Templates
      </h2>

      <div className="flex-shrink-0 ">
        <div className="flex gap-4 p-4  rounded-lg shadow-[0_12px_24px_rgba(0,0,0,0.25)] overflow-x-auto custom-scrollbar ">
          {templates && templates.length > 0 ? (
            templates.map((pdf) => (
              <div
                key={pdf._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:scale-105 w-[300px] flex-shrink-0"
                onClick={() => handleViewResume(pdf)}
              >
                {pdf.images?.[0] ? (
                  <img
                    src={`${
                      import.meta.env.VITE_BASE_URL
                    }/${pdf.images[0].path.replace(/\\/g, "/")}`}
                    alt="Template Preview"
                    className="w-full h-56 object-contain rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-200 text-gray-500 rounded mb-2">
                    No Preview
                  </div>
                )}
                <h3 className="text-sm font-semibold text-center truncate max-w-full">
                  {pdf.pdfName || "Unnamed Template"}
                </h3>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full py-10">
              No Templates Available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTotalTemplate;
