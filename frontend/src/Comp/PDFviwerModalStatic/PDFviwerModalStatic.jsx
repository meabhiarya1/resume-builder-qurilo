import React, { useState, useEffect } from "react";
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
  const [editorContent, setEditorContent] = useState([]);

  useEffect(() => {
    setEditorContent(""); // Clear editor when new resume is selected
    extractTextWithPositions();
  }, [selectedResume]);

  useEffect(() => {
    extractTextWithPositions();
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

  const extractTextWithPositions = () => {
    if (!images[currentPage]) return;
    setLoading(true);

    Tesseract.recognize(
      `${import.meta.env.VITE_BASE_URL}/${images[currentPage].path.replace(
        /\\/g,
        "/"
      )}`,
      "eng",
      {
        logger: (m) => console.log(m),
        oem: 1, // LSTM OCR Engine
        psm: 3, // Fully automatic page segmentation
      }
    )
      .then(({ data }) => {
        console.log("Full OCR Response:", data);

        if (!data || !data.text) {
          setEditorContent([]);
          return;
        }

        if (!data.words || data.words.length === 0) {
          console.warn(
            "Tesseract did not return word positioning data. Trying alternative extraction..."
          );

          // Convert text into a formatted structure if word positions are missing
          const formattedText = data.text
            .replace(/ /g, "&nbsp;") // Preserve spaces
            .replace(/\n/g, "<br>"); // Preserve line breaks

          setEditorContent([{ text: formattedText, x: 0, y: 0 }]); // Default position
          return;
        }

        // Extract words with their positions
        const extractedWords = data.words.map((word) => ({
          text: word.text,
          x: word.bbox.x0, // Left position
          y: word.bbox.y0, // Top position
          width: word.bbox.x1 - word.bbox.x0, // Word width
          height: word.bbox.y1 - word.bbox.y0, // Word height
        }));

        setEditorContent(extractedWords);
      })
      .catch((error) => {
        console.error("OCR Error:", error);
        setEditorContent([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 w-full">
      <div className="relative bg-white p-6 rounded-lg shadow-2xl w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Top Section: PDF Viewer and Extracted Text */}
        <div className="flex-grow flex w-full overflow-hidden">
          {/* Left Side: Image Viewer */}
          <div className="w-1/2 p-2 flex flex-col">
            <button
              onClick={() => {
                setShowModalModalStatic(false);
                setSelectedResume(null);
              }}
              className="absolute top-3 right-6 text-gray-600 hover:text-gray-900 text-lg font-bold cursor-pointer"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedResume.pdfName}
            </h2>

            <div className="flex-grow flex flex-col border rounded-lg shadow-md overflow-auto relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                  <p className="text-lg font-semibold text-gray-700">
                    Extracting...
                  </p>
                </div>
              )}
              {images.length > 0 ? (
                <div className="w-full flex justify-center items-center">
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
          </div>

          {/* Right Side: Extracted Text Container */}
          <div className="w-1/2 p-2 mt-[48px] flex flex-col overflow-auto bg-gray-100 border border-gray-300 rounded-lg relative">
            <div className="relative">
              {editorContent.length > 0 ? (
                editorContent.map((word, index) => (
                  <div
                    key={index}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    className="absolute bg-white/80 p-1 rounded-md"
                    style={{
                      left: `${word.x * 0.8}px`, // SCALING FACTOR
                      top: `${word.y * 0.8}px`, // SCALING FACTOR
                      fontSize: `${word.height * 0.8}px`, // SCALING TEXT SIZE
                      minWidth: `${word.width}px`, // Preserve width
                      fontFamily: "mono",
                    }}
                    dangerouslySetInnerHTML={{ __html: word.text }}
                    onInput={(e) => {
                      const updatedWords = [...editorContent];
                      updatedWords[index].text = e.target.innerHTML;
                      setEditorContent(updatedWords);
                    }}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center">No text extracted</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation and Actions */}
        <div className="mt-2 w-full flex items-center justify-between px-6 bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 text-white rounded-lg transition cursor-pointer ${
              currentPage === 0
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-700"
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
              currentPage === images.length - 1
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-700"
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
