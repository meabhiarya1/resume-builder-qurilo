import React from "react";

const PDFViewerModalStatic = ({ isOpen, onClose, pdfUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 transition text-lg"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">PDF Viewer</h2>
        
        {/* PDF Embed */}
        <div className="h-[500px] overflow-auto border rounded-lg shadow-md">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModalStatic;
