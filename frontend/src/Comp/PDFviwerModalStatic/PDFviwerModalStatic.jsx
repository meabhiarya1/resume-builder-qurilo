import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill editor styles

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
    setEditorContent([]); // Clear editor when new resume is selected
    extractTextWithPositions();
  }, [selectedResume]);

  useEffect(() => {
    extractTextWithPositions();
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
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
        oem: 1,
        psm: 6,
      }
    )
      .then(({ data }) => {
        if (!data || !data.text) {
          setEditorContent([]);
          return;
        }

        if (!data.blocks || data.blocks.length === 0) {
          setEditorContent([
            {
              text: data.text,
              x: 0,
              y: 0,
              width: "100%",
            },
          ]);
          return;
        }

        const extractedBlocks = data.blocks.map((block) => ({
          text: block.text || "",
          x: block.bbox.x0,
          y: block.bbox.y0,
          width: block.bbox.x1 - block.bbox.x0,
          height: block.bbox.y1 - block.bbox.y0,
        }));

        setEditorContent(extractedBlocks);
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

          {/* Right Side: Extracted Text Container (React-Quill for Editing) */}
          <div
            className="w-1/2 p-2 flex flex-col overflow-auto bg-gray-100 border border-gray-300 rounded-lg relative mt-[50px]
          "
          >
            <h3 className="font-semibold text-lg mb-2 w-full">
              Extracted Text:
            </h3>
            <div className="relative w-full h-full">
              {editorContent.length > 0 ? (
                editorContent.map((block, index) => (
                  <div
                    key={index}
                    className="absolute bg-white shadow-md p-3 rounded-lg w-full"
                    style={{
                      left: `${block.x * 0.8}px`,
                      top: `${block.y * 0.8}px`,
                      width: `${block.width}px`,
                      fontSize: `${block.height * 0.8}px`,
                    }}
                  >
                    {/* React-Quill Editor */}
                    <ReactQuill
                      value={block.text}
                      onChange={(content) => {
                        const updatedBlocks = [...editorContent];
                        updatedBlocks[index].text = content;
                        setEditorContent(updatedBlocks);
                      }}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ indent: "-1" }, { indent: "+1" }], // Indentation Support
                          [{ align: [] }],
                          ["blockquote", "code-block"],
                          [{ color: [] }, { background: [] }],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "align",
                        "code-block",
                        "color",
                        "background",
                      ]}
                      theme="snow"
                      style={{
                        fontFamily: '"Courier New", monospace',
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.6",
                      }}
                    />
                  </div>
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
