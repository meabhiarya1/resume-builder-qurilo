import React from "react";
import { Trash2, Eye } from "lucide-react";

const Templates = ({
  templatePdfsInfo,
  handleViewResume,
  handleDeleteResumeTemplate,
}) => {
  return (
    <div className="px-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-amber-50">
        Total Templates
      </h2>

      <div
        className={`overflow-y-auto max-h-[750px] gap-4 p-4 border-3 rounded-lg shadow-lg custom-scrollbar ${
          templatePdfsInfo.length > 0
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "flex items-center justify-center"
        }`}
      >
        {templatePdfsInfo.length > 0 ? (
          templatePdfsInfo?.map((pdf) => (
            <div
              key={pdf._id}
              className="relative p-3 bg-black/30 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col items-center"
            >
              {pdf.images?.[0] && (
                <img
                  src={`${
                    import.meta.env.VITE_BASE_URL
                  }/${pdf.images[0].path.replace(/\\/g, "/")}`}
                  alt="Preview"
                  className="h-56 object-contain rounded mb-2"
                />
              )}

              <h3 className="text-sm font-semibold text-center text-amber-50 mb-2 truncate w-full min-w-24">
                {pdf.pdfName}
              </h3>

              <div className="flex gap-2 max-w-[200px]">
                <button
                  onClick={() => handleViewResume(pdf)}
                  className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => handleDeleteResumeTemplate(pdf._id)}
                  className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-amber-100  ">No Templates Found</div>
        )}
      </div>
    </div>
  );
};

export default Templates;
