import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import PDFViewerModal from "../PDFviwerModal/PDFviwerModal";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // ✅ Ensure the worker is loaded
import UserTotalResume from "../UserTotalResume/UserTotalResume";

// ✅ Manually set the workerSrc correctly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const UserDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [images, setImages] = useState([]);
  const [pdfsInfo, setPdfsInfo] = useState([]);

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target.result); // Ensure the file is in base64 format
        setShowModal(true);
      };
      reader.readAsDataURL(file); // Read file as Base64
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // ✅ Extract PDF Pages as Images
  const extractPagesAsImages = async (pdfFile) => {
    try {
      const pdf = await pdfjs.getDocument(pdfFile).promise;
      const pagesArray = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2; // Higher scale for better resolution
        const viewport = page.getViewport({ scale });

        // Create a canvas to render the page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page onto canvas
        await page.render({ canvasContext: context, viewport }).promise;

        // Convert canvas to image URL
        const imageData = canvas.toDataURL("image/png");
        pagesArray.push(imageData);
      }

      setImages(pagesArray);
    } catch (error) {
      console.error("Error extracting PDF pages:", error);
    }
  };

  useEffect(() => {
    if (pdfFile) {
      extractPagesAsImages(pdfFile);
    }
  }, [pdfFile]);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/pdfs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setPdfsInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchedData();
  }, []);

  return (
    <div className="h-screen flex flex-col ">
      {/* Navbar */}
      <Navbar />

      {/* Show Modal when a PDF is uploaded */}
      {showModal && (
        <PDFViewerModal
          setShowModal={setShowModal}
          pdfFile={pdfFile}
          images={images}
          setImages={setImages}
        />
      )}

      <div className="flex  flex-grow ">
        <UserTotalResume pdfsInfo={pdfsInfo} />

        {/* Upload Section */}
        <div className="flex flex-grow items-center justify-center ">
          <div className="group relative w-[420px]">
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10">
              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-white">
                  Upload Files
                </h3>
                <p className="text-sm text-slate-400">
                  Drag & drop your files here
                </p>

                {/* File Upload Input */}
                <div className="group/dropzone mt-6">
                  <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 transition-colors group-hover/dropzone:border-cyan-500/50">
                    <input
                      type="file"
                      className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                      accept="application/pdf"
                      onChange={handleFileUpload} // Handle file selection
                    />
                    <div className="space-y-6 text-center">
                      <p className="text-base font-medium text-white">
                        Drop your files here or browse
                      </p>
                      <p className="text-sm text-slate-400">
                        Support files: PDF
                      </p>
                      <p className="text-xs text-slate-400">
                        Max file size: 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UserTotalResume pdfsInfo={pdfsInfo} />
      </div>
    </div>
  );
};

export default UserDashboard;
