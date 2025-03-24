import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import PDFViewerModal from "../PDFviwerModal/PDFviwerModal";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import UserTotalResume from "../UserTotalResume/UserTotalResume";
import PDFViewerModalStatic from "../PDFviwerModalStatic/PDFviwerModalStatic";
import axios from "axios";
import UserTotalTemplate from "../UserTotalTemplate/UserTotalTemplate";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const UserDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [images, setImages] = useState([]);
  const [pdfsInfo, setPdfsInfo] = useState([]);
  const [pdfFileName, setPdfFileName] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModalModalStatic, setShowModalModalStatic] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedResumeType, setSelectedResumeType] = useState("");
  const [saving, setSaving] = useState(false);

  // Handle View Resume
  const handleViewResume = (pdf) => {
    setSelectedResume(pdf);
    setShowModalModalStatic(true);
  };
  
  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("No file selected.");
      event.target.value = "";
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        setPdfFile(e.target.result);
        setPdfFileName(file.name);
        setPdf(file);
        setShowModal(true);
      } catch (error) {
        console.error("Error setting PDF file:", error);
        alert("An unexpected error occurred while processing your file.");
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert("Failed to read the file. Please try again.");
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error initiating file read:", error);
      alert("Could not initiate file reading. Please try again.");
    }

    event.target.value = "";
  };

  // Extract PDF Pages as Images
  const extractPagesAsImages = async (pdfFile) => {
    try {
      setImages([]);
      const pdf = await pdfjs.getDocument(pdfFile).promise;
      const pagesArray = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const imageData = canvas.toDataURL("image/png");
        pagesArray.push(imageData);
      }
      setImages(pagesArray);
      setPdfFile(null);
    } catch (error) {
      console.error("Error extracting PDF pages:", error);
    }
  };

  const handleDeleteResume = async (id) => {
    if (!id) {
      alert("Invalid PDF ID!");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.status === 200) {
        alert("Resume deleted successfully!");
        setPdfsInfo((prevPdfs) => prevPdfs?.filter((pdf) => pdf?._id !== id));
      } else {
        console.log("Failed to delete resume. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setShowModalModalStatic(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      if (!pdf) {
        alert("No PDF file selected!");
        setSaving(false);
        return;
      }
      const formData = new FormData();
      formData.append("pdfName", pdfFileName);
      formData.append("pdf", pdf);

      images.forEach((image, index) => {
        formData.append(
          "images",
          dataURItoBlob(image),
          `page-${index + 1}.png`
        );
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) {
        setPdfsInfo([]);
        return;
      }

      setPdfsInfo((prevPdfs) => [...prevPdfs, response?.data?.pdf]);
      setShowModal(false);
      setImages([]);
      alert("PDF saved successfully!");
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("Failed to save PDF");
    } finally {
      setSaving(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/admin/templates`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 401) {
        setPdfsInfo([]);
        return;
      }
      // console.log("Templates Data:", response?.data);
      setTemplates(response?.data?.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    if (pdfFile) {
      extractPagesAsImages(pdfFile);
    }
  }, [pdfFile, pdf]);

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
        if (response.status === 401) {
          setPdfsInfo([]);
          return;
        }
        const data = await response?.json();
        setPdfsInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchedData();
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="flex flex-col bg-[#3F4F44] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {showModal && (
        <PDFViewerModal
          setShowModal={setShowModal}
          pdfFile={pdfFile}
          images={images}
          setImages={setImages}
          pdfFileName={pdfFileName}
          handleSave={handleSave}
          saving={saving}
        />
      )}

      <div className="flex max-md:flex-col-reverse max-lg:gap-6 my-4  ">
        <div className="min-md:overflow-y-auto   w-[100vw] min-2xl:w-[75vw] min-xl:[60vw] custom-scrollbar">
          <UserTotalResume
            pdfsInfo={pdfsInfo}
            handleViewResume={handleViewResume}
            selectedResume={selectedResume}
            setSelectedResumeType={setSelectedResumeType}
          />

          <UserTotalTemplate
            templates={templates}
            handleViewResume={handleViewResume}
            setSelectedResumeType={setSelectedResumeType}
          />
        </div>

        {/* Upload Section */}
        <div className="flex items-center w-[100vw] min-2xl:w-[25vw] min-xl:[40vw] mt-[70px] px-6 justify-center h-[calc(100vh-250px)] max-md:h-[200px] max-lg:mb-12">
          <div className="border-3 border-gray-700 w-[100%] overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10">
            <div className=" p-6 ">
              <h3 className="text-lg font-semibold text-amber-50">
                Upload Files
              </h3>
              <p className="text-sm text-slate-400">
                Drag & drop your files here
              </p>

              {/* File Upload Input */}
              <div className=" mt-6">
                <div className=" h-[calc(100vh-250px)] max-md:h-[200px]  rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 transition-colors group-hover/dropzone:border-cyan-500/50 flex flex-col justify-center">
                  <input
                    type="file"
                    className=" inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                  />
                  <div className="space-y-6 text-center">
                    <p className="text-base font-medium text-white">
                      Drop your files here or browse
                    </p>
                    <p className="text-sm text-slate-400">Support files: PDF</p>
                    <p className="text-xs text-slate-400">
                      Max file size: 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showModalModalStatic && selectedResume && (
          <PDFViewerModalStatic
            selectedResume={selectedResume}
            setShowModalModalStatic={setShowModalModalStatic}
            setSelectedResume={setSelectedResume}
            handleDeleteResume={handleDeleteResume}
            selectedResumeType={selectedResumeType}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
