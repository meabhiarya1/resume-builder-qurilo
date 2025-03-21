import React, { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill editor styles
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist";
import JoditEditor from "jodit-react";
import html2pdf from "html2pdf.js";
import { ArrowBigLeft, ArrowBigRight, Download, Trash2 } from "lucide-react";

const PDFViewerModalStatic = ({
  setShowModalModalStatic,
  selectedResume,
  setSelectedResume,
  handleDeleteResume,
  selectedResumeType,
}) => {
  if (!selectedResume || !selectedResume?.images) return null;
  let contentSet = "";
  const images = selectedResume?.images;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!selectedResume || !selectedResume.pdfName) return;
      setLoading(true);
      const pdfUrl = `${import.meta.env.VITE_BASE_URL}/pdf/${
        selectedResume.pdfName
      }`;

      if (!pdfUrl) return;

      setLoading(false);

      try {
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let htmlContent = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          textContent.items.forEach((item) => {
            const style = `
                        font-size: ${item.transform[0] / 0.7}px;
                        font-weight: ${
                          item.fontName.includes("Bold") ? "bold" : "normal"
                        };
                    `;
            htmlContent += `<p style="${style}">${item.str}</p>`;
          });
        }
        contentSet = htmlContent;
        setContent(htmlContent);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, []);

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

  const handleDownloadPDF = async () => {
    setLoading(true);
    if (contentSet === "") {
      contentSet = content;
    }
    const element = document.createElement("div");
    element.innerHTML = contentSet;
    element.style.width = "210mm"; // Ensures A4 width for proper scaling
    element.style.padding = "10mm"; // Adds padding for better spacing

    const options = {
      margin: 10,
      filename: `${selectedResume?.pdfName || "Edited_Resume"}.pdf`,
      image: { type: "jpeg", quality: 1 }, // Maximum image quality
      html2canvas: {
        scale: 3, // Higher scale improves resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollY: 0, // Prevents scrolling issues when capturing the content
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        precision: 16,
      },
      pagebreak: { mode: ["css", "avoid-all", "legacy"] }, // Ensures proper page breaks
    };

    document.body.appendChild(element);
    await html2pdf().from(element).set(options).save();
    document.body.removeChild(element);
    setLoading(false);
  };

  const handleContentChange = (newContent) => {
    contentSet = newContent;
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 w-full">
      <div className="relative bg-white p-6 rounded-lg shadow-2xl w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row w-full overflow-y-auto ">
          {/* Left Side: Image Viewer */}
          <div className="w-full md:w-1/2 p-2 flex flex-col">
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
                <div className="w-full flex justify-center items-center  ">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${images[
                      currentPage
                    ].path.replace(/\\/g, "/")}`}
                    alt={`Page ${currentPage + 1}`}
                    className=""
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center">No images available</p>
              )}
            </div>
          </div>

          {/* Right Side: Extracted Text Container */}
          <div className="w-full md:w-1/2 p-2 flex flex-col bg-gray-100 border border-gray-300 rounded-lg mt-4 md:mt-[50px] max-h-[calc(90vh-100px)] ">
            <h3 className="font-semibold text-lg mb-2 w-full">
              Extracted Text:
            </h3>
            <div className="relative w-full h-full">
              <div
                id={`resume-page-${currentPage}`}
                className="bg-white shadow-md p-3 rounded-lg w-full"
              >
                <JoditEditor
                  ref={editorRef}
                  value={content || ""}
                  onChange={handleContentChange}
                  config={{
                    readonly: false,
                    height: 550,
                    toolbarAdaptive: false,
                    toolbar: true, // Enable toolbar
                    buttons: [
                      "bold",
                      "italic",
                      "underline",
                      "|", // Basic text formatting
                      "ul",
                      "ol",
                      "|", // Lists
                      "link",
                      "unlink",
                      "|", // Links
                      "undo",
                      "redo",
                      "|", // Undo/Redo
                      "hr",
                      "eraser",
                      "source", // Divider, Clear, Code view
                    ],
                    placeholder: "Insert text here...",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation and Actions */}
        <div className="gap-6 min-w-[35vw] self-end mt-4 mr-2 p-2 rounded-lg shadow-md border border-gray-300 flex flex-wrap items-center justify-between sm:justify-center">
          {/* Prev Arrow */}
          <ArrowBigLeft
            size={25}
            onClick={() => prevPage()}
            disabled={currentPage === 0}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          />

          {/* Page Info */}
          <p className="text-gray-700 font-semibold text-xs sm:text-sm whitespace-nowrap">
            Page {currentPage + 1} of {images.length}
          </p>

          {/* Delete Icon */}
          {selectedResumeType === "Resumes" && (
            <Trash2
              size={18}
              onClick={() => handleDeleteResume(selectedResume._id)}
              className="text-red-600 hover:text-red-800 cursor-pointer"
            />
          )}

          {/* Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 text-white font-semibold rounded-lg transition duration-300 shadow-md flex items-center gap-1 sm:gap-2 cursor-pointer bg-green-600 hover:bg-green-800 transform hover:scale-105"
          >
            <Download size={20} />
            {loading ? "Downloading..." : "PDF"}
          </button>

          {/* Next Arrow */}
          <ArrowBigRight
            size={25}
            onClick={() => nextPage()}
            disabled={currentPage === images.length - 1}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModalStatic;
