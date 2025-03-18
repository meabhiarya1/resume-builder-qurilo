import React from "react";

const PDFViewerModal = ({ setShowModal, images }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="relative bg-white rounded-lg shadow-lg w-[80%] max-w-3xl p-6">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-1 right-4 text-gray-500 hover:text-gray-800 transition size-2 cursor-pointer"
        >
          ✖
        </button>

        {/* PDF Viewer (Now Displays Extracted Images) */}
        {images.length > 0 ? (
          <div className="overflow-auto max-h-[800px]">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Page ${index + 1}`}
                className="mb-4 w-full"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Extracting pages...</p>
        )}
      </div>
    </div>
  );
};

export default PDFViewerModal;
