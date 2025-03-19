import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import JoditEditor from "jodit-react";

const PDFViewerModalStatic = ({
  setShowModalModalStatic,
  selectedResume,
  setSelectedResume,
  handleDeleteResume,
  selectedResumeType,
}) => {
  if (!selectedResume || !selectedResume.images) return null;

  const images = selectedResume.images;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    setEditorContent(""); // Clear editor content when a new resume is selected
    extractTextWithPositions(); // Extract text on resume selection
  }, [selectedResume]);

  useEffect(() => {
    extractTextWithPositions(); // Extract text when page changes
  }, [currentPage]);

  const extractTextWithPositions = () => {
    if (!images[currentPage]) return;
    setLoading(true);

    Tesseract.recognize(
      `${import.meta.env.VITE_BASE_URL}/${images[currentPage].path.replace(/\\/g, "/")}`,
      "eng",
      {
        logger: (m) => console.log(m),
      }
    )
      .then(({ data }) => {
        setEditorContent(data.text || "No text found");
      })
      .catch((error) => {
        console.error("OCR Error:", error);
        setEditorContent("Error extracting text");
      })
      .finally(() => setLoading(false));
  };

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 w-full">
      <div className="relative bg-white p-6 rounded-lg shadow-2xl w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Top Section: PDF Viewer and Extracted Text */}
        <div className="flex-grow flex w-full overflow-hidden">
          {/* Left Side: Image Viewer Fitted in Div */}
          <div className="w-2/3 p-2 border-r flex flex-col">
            <button
              onClick={() => {
                setShowModalModalStatic(false);
                setSelectedResume(null);
              }}
              className="absolute top-4 right-6 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedResume.pdfName}
            </h2>

            <div className="flex-grow flex flex-col border rounded-lg shadow-md overflow-auto relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                  <p className="text-lg font-semibold text-gray-700">Extracting...</p>
                </div>
              )}
              {images.length > 0 ? (
                <div className="w-full flex justify-center items-center">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${images[currentPage].path.replace(/\\/g, "/")}`}
                    alt={`Page ${currentPage + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center">No images available</p>
              )}
            </div>
          </div>

          {/* Right Side: Extracted Text */}
          <div className="w-1/2 p-2 flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Extracted Text:</h3>
            <div className="flex-grow p-3 bg-gray-100 rounded-md border overflow-auto">
              <JoditEditor value={editorContent} onChange={setEditorContent} />
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation and Actions */}
        <div className="mt-2 w-full flex items-center justify-between px-6 bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 text-white rounded-lg transition cursor-pointer ${
              currentPage === 0 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            ◀ Previous
          </button>

          <p className="text-gray-700 font-semibold">
            Page {currentPage + 1} of {images.length}
          </p>

          {selectedResumeType === "Resumes" && (
            <button
              onClick={() => handleDeleteResume(selectedResume._id)}
              className="px-6 py-3 text-white font-semibold rounded-lg transition duration-300 shadow-md flex items-center gap-2 cursor-pointer bg-red-700 hover:bg-red-850 active:bg-red-800 transform hover:scale-105"
            >
              🗑️ Delete Resume
            </button>
          )}

          <button
            onClick={nextPage}
            disabled={currentPage === images.length - 1}
            className={`px-4 py-2 text-white rounded-lg transition cursor-pointer ${
              currentPage === images.length - 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModalStatic;