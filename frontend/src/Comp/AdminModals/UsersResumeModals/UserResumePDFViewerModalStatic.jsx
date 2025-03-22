import React, { useState } from "react";

const UserResumePDFViewerModalStatic = ({
  setShowModalModalStatic,
  selectedResume,
  setSelectedResume,
}) => {
  if (!selectedResume || !selectedResume.images) return null;

  const images = selectedResume.images;
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-invert backdrop-opacity-30 backdrop-blur-sm z-50">
      <div className="relative bg-white p-4 rounded-lg shadow-2xl w-[90%] max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowModalModalStatic(false);
            setSelectedResume(null);
          }}
          className="absolute top-4 right-6 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center truncate max-w-[300px] mb-3">
          {selectedResume.pdfName}
        </h2>

        {/* Image Viewer */}
        <div className="md:h-[70vh] h-[40vh] w-full flex flex-col border rounded-lg shadow-md overflow-auto">
          {images.length > 0 ? (
            <div className="w-full flex justify-start">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${images[
                  currentPage
                ].path.replace(/\\/g, "/")}`}
                alt={`Page ${currentPage + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center">No images available</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 text-white rounded-lg transition cursor-pointer font-semibold  ${
              currentPage === 0
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <p className="text-gray-700 font-semibold">
            Page {currentPage + 1} of {images.length}
          </p>

          <button
            onClick={nextPage}
            disabled={currentPage === images.length - 1}
            className={`px-4 py-2 text-white rounded-lg transition cursor-pointer font-semibold ${
              currentPage === images.length - 1
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserResumePDFViewerModalStatic;
