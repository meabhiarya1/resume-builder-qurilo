import React, { useState, useEffect } from "react";

const PDFViewerModal = ({
  setShowModal,
  images,
  handleSave,
  saving,
  setImages,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextPage();
      } else if (event.key === "ArrowLeft") {
        prevPage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="relative bg-white rounded-lg shadow-lg w-[80%] max-w-4xl p-6">
        {/* Close Button */}
        <button
          onClick={() => {
            setImages([]);
            setShowModal(false);
          }}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 transition text-lg cursor-pointer"
        >
          ✖
        </button>

        {/* PDF Viewer */}
        <p className="text-gray-700 font-semibold flex justify-center ">
          Page {currentPage + 1} of {images.length}
        </p>
        {images.length > 0 ? (
          <div className="flex flex-col items-center max-h-[80vh]">
            <div className="overflow-auto max-h-[80vh] w-full border rounded-lg p-2">
              <img
                src={images[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="block mx-auto"
              />
            </div>

            {/* Page Navigation */}
            <div className="mt-4 flex items-center justify-between w-full">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 text-white rounded-lg transition cursor-pointer ${
                  currentPage === 0
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg transition cursor-pointer"
              >
                {saving ? "Saving..." : "Save PDF"}
              </button>

              <button
                onClick={() => {
                  setImages([]);
                  setShowModal(false);
                }}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Upload Again
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === images.length - 1}
                className={`px-4 py-2 text-white rounded-lg transition cursor-pointer ${
                  currentPage === images.length - 1
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Extracting pages...</p>
        )}
      </div>
    </div>
  );
};

export default PDFViewerModal;
