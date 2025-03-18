import React from "react";

const PDFViewerModal = ({ setShowModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      {/* Modal Box */}
      <div className="relative bg-white rounded-lg shadow-lg w-[80%] max-w-3xl p-6">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          ✖
        </button>

        {/* PDF Viewer Placeholder */}
        <div className="h-[500px] flex items-center justify-center border border-gray-300 rounded-md bg-gray-100">
          <p className="text-gray-500">PDF Viewer Content Here</p>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;
