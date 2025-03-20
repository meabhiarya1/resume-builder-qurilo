import React, { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill editor styles
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [pageData, setPageData] = useState({}); // Stores extracted & edited content for each page
  const quillRefs = useRef({}); // Store refs for each page's editor
  const [textLoaded, setTextLoaded] = useState(false); // Ensure first page is loaded properly

  useEffect(() => {
    extractAllPagesData(); // Extract data for all pages at once
  }, [selectedResume]);

  const extractAllPagesData = async () => {
    setLoading(true);
    let extractedData = {};

    for (let i = 0; i < images.length; i++) {
      const imagePath = `${import.meta.env.VITE_BASE_URL}/${images[
        i
      ].path.replace(/\\/g, "/")}`;

      try {
        const { data } = await Tesseract.recognize(imagePath, "eng", {
          logger: (m) => console.log(m),
          oem: 1,
          psm: 6,
        });

        extractedData[i] = data.text || "No text found"; // Store extracted text in state
      } catch (error) {
        console.error(`OCR Error on page ${i}:`, error);
        extractedData[i] = "Error extracting text";
      }
    }

    setPageData(extractedData); // Save extracted data in state
    setTextLoaded(true); // Ensure first page is displayed
    setLoading(false);
  };

  useEffect(() => {
    if (textLoaded && quillRefs.current[currentPage]) {
      quillRefs.current[currentPage].getEditor().root.innerHTML =
        pageData[currentPage] || "";
    }
  }, [currentPage, textLoaded]);

  const nextPage = () => {
    // Save current page content before switching
    if (quillRefs.current[currentPage]) {
      setPageData((prev) => ({
        ...prev,
        [currentPage]:
          quillRefs.current[currentPage].getEditor().root.innerHTML,
      }));
    }
    if (currentPage < images.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    // Save current page content before switching
    if (quillRefs.current[currentPage]) {
      setPageData((prev) => ({
        ...prev,
        [currentPage]:
          quillRefs.current[currentPage].getEditor().root.innerHTML,
      }));
    }
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;

    for (let i = 0; i < images.length; i++) {
      let imgData;
      const pageElement = document.getElementById(`resume-page-${i}`);

      if (pageElement) {
        try {
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            useCORS: true,
          });
          imgData = canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Error capturing canvas:", error);
          continue;
        }
      }

      if (imgData) {
        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          pdfWidth - 2 * margin,
          pdfHeight - 2 * margin
        );
      }
    }

    pdf.save(`${selectedResume?.pdfName || "Edited_Resume"}.pdf`);
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

          {/* Right Side: Extracted Text Container */}
          <div className="w-1/2 p-2 flex flex-col overflow-auto bg-gray-100 border border-gray-300 rounded-lg relative mt-[50px]">
            <h3 className="font-semibold text-lg mb-2 w-full">
              Extracted Text:
            </h3>
            <div className="relative w-full h-full">
              <div
                id={`resume-page-${currentPage}`}
                className="absolute bg-white shadow-md p-3 rounded-lg w-full"
              >
                {/* ReactQuill Editor with useRef */}
                <ReactQuill
                  key={currentPage} // Forces re-render when page changes
                  ref={(el) => (quillRefs.current[currentPage] = el)}
                  defaultValue={pageData[currentPage] || ""}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ indent: "-1" }, { indent: "+1" }],
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
            </div>
          </div>
        </div>

        {/* Bottom Navigation and Actions */}
        <div className="mt-2 w-full flex items-center justify-between px-6 bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={() => prevPage()}
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
            onClick={handleDownloadPDF}
            className="px-6 py-3 text-white font-semibold rounded-lg transition duration-300 shadow-md flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-800 transform hover:scale-105"
          >
            📄 Download PDF
          </button>

          <button
            onClick={() => nextPage()}
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
      {/* {isUpdating && <p className="text-center text-gray-600">Saving...</p>} */}
    </div>
  );
};

export default PDFViewerModalStatic;
