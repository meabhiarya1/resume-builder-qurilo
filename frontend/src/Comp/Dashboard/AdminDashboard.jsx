import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import TotalUsers from "../TotalUsers/TotalUsers";
import Templates from "../Templates/Templates";
import Upload from "../TemplateUplods/Uploads";
import UsersResumeModals from "../AdminModals/UsersResumeModals/UsersResumeModals";
import axios from "axios";
import UserResumePDFViewerModalStatic from "../AdminModals/UsersResumeModals/UserResumePDFViewerModalStatic";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [templatePdfsInfo, setTemplatePdfsInfo] = useState([]);
  const [showModalModalStatic, setShowModalModalStatic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pdf, setPdf] = useState(null);
  const token = localStorage.getItem("token");

  const handleUserPdfs = async (user) => {
    try {
      const token = localStorage.getItem("token");
      setSelectedUser(user);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPdfData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const handleViewResume = (pdf) => {
    setSelectedResume(pdf);
    setShowModalModalStatic(true);
  };

  const handleDeleteResumeTemplate = async (id) => {
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
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/template/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Resume deleted successfully!");

        setTemplatePdfsInfo((prevPdfs) =>
          prevPdfs.filter((pdf) => pdf._id !== id)
        );
      } else {
        console.log("Failed to delete resume. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setShowModalModalStatic(false);
    }
  };

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

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a PDF file to upload.");
      e.target.value = "";
      return;
    }
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        setPdfFile(event.target.result);
        setPdfFileName(file.name);
        setPdf(file);
        setShowTemplateModal(true);
      } catch (error) {
        console.error("Error loading PDF file:", error);
        alert("An unexpected error occurred while loading the PDF.");
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert("Failed to read file. Please try again.");
    };

    reader.readAsDataURL(file);
    e.target.value = "";
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

      setTemplatePdfsInfo((prevPdfs) => [...prevPdfs, response.data.pdf]);
      setShowTemplateModal(false);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchedTempateData = async () => {
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
        setTemplatePdfsInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchedTempateData();
  }, []);

  useEffect(() => {
    if (pdfFile) {
      extractPagesAsImages(pdfFile);
    }
  }, [pdfFile, pdf]);

  return (
    <div>
      <Navbar setActiveTab={setActiveTab} />
      <div className="flex flex-wrap justify-start md:justify-between gap-4 w-full px-4 bg-[#3F4F44] ">
        <div className="w-full overflow-y-auto p-4 h-screen">
          {activeTab === "users" && (
            <TotalUsers
              users={users}
              loading={loading}
              error={error}
              handleUserPdfs={handleUserPdfs}
            />
          )}
          {activeTab === "templates" && (
            <Templates
              templatePdfsInfo={templatePdfsInfo}
              handleViewResume={handleViewResume}
              handleDeleteResumeTemplate={handleDeleteResumeTemplate}
            />
          )}

          {activeTab === "upload" && (
            <Upload
              handleSave={handleSave}
              saving={saving}
              setShowTemplateModal={setShowTemplateModal}
              handleTemplateUpload={handleTemplateUpload}
              showTemplateModal={showTemplateModal}
              images={images}
              setImages={setImages}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <UsersResumeModals
          pdfData={pdfData}
          setIsModalOpen={setIsModalOpen}
          setSelectedResume={setSelectedResume}
          setShowModalModalStatic={setShowModalModalStatic}
          selectedUser={selectedUser}
        />
      )}

      {showModalModalStatic && selectedResume && (
        <UserResumePDFViewerModalStatic
          selectedResume={selectedResume}
          setShowModalModalStatic={setShowModalModalStatic}
          setSelectedResume={setSelectedResume}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
