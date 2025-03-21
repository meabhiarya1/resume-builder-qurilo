import React from "react";
import { Trash2, Eye } from "lucide-react";

const Templates = ({
  templatePdfsInfo,
  handleViewResume,
  handleDeleteResumeTemplate,
}) => {
  return (
    <div className="px-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Total Templates
      </h2>

      <div className="overflow-y-auto max-h-[600px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 border rounded-lg shadow-lg bg-white">
        {templatePdfsInfo?.map((pdf) => (
          <div
            key={pdf._id}
            className="relative p-4 bg-gray-100 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-xl flex flex-col items-center"
          >
            {pdf.images?.[0] && (
              <img
                src={`${
                  import.meta.env.VITE_BASE_URL
                }/${pdf.images[0].path.replace(/\\/g, "/")}`}
                alt="Preview"
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}

            {/* PDF Name */}
            <h3 className="text-sm font-semibold text-center text-gray-800 mb-2 truncate w-[200px]">
              {pdf.pdfName}
            </h3>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full">
              {/* View Button */}
              <button
                onClick={() => handleViewResume(pdf)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition w-full cursor-pointer"
              >
                <Eye size={16} />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteResumeTemplate(pdf._id)}
                className="flex items-center justify-center gap-2 bg-red-600 px-4 py-2 rounded-md text-sm font-medium w-full text-white hover:text-black transition cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
