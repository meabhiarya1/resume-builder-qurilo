import React from "react";

const PDFViewerModalStatic = ({
  showModalModalStatic,
  setShowModalModalStatic,
  selectedResume,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
      <h2 className="text-xl font-bold mb-2">{selectedResume.pdfName}</h2>
      <div className="relative bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setShowModalModalStatic(false)}
          className="absolute top-4 right-6 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">PDF Viewer</h2>

        {/* PDF Embed with Scrollable Container */}
        <div className="h-[80vh] overflow-auto border rounded-lg shadow-md">
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
