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

// ✅ Manually set the workerSrc correctly
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
  const token = localStorage.getItem("token");

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
  }, [pdfFile]);

  const handleUserPdfs = async (user) => {
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      setSelectedUser(user);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPdfData(data); // Store the data in state
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const handleViewResume = (pdf) => {
    console.log(pdf);
    setSelectedResume(pdf);
    setShowModalModalStatic(true);
  };

  const handleDeleteResume = async (id) => {
    if (!id) {
      alert("Invalid PDF ID!"); // Show error if ID is missing
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return; // Stop if user cancels

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/template/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure authenticated request
          },
        }
      );

      if (response.status === 200) {
        alert("Resume deleted successfully!");
        // Optionally, remove the PDF from state after deletion
        setTemplatePdfsInfo((prevPdfs) =>
          prevPdfs.filter((pdf) => pdf._id !== id)
        );
      } else {
        console.log("Failed to delete resume. Please try again.");
        // toast.error("Failed to delete resume. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      // toast.error("An error occurred while deleting the resume.");
    } finally {
      setShowModalModalStatic(false);
    }
  };

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

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFileName(file.name);
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target.result); // Ensure the file is in base64 format
        setShowTemplateModal(true);
      };
      reader.readAsDataURL(file); // Read file as Base64
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("pdfName", pdfFileName);

      // Convert base64 images to Blob and append them
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
      alert("PDF saved successfully!");
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("Failed to save PDF");
    } finally {
      setSaving(false);
    }
  };

  // Convert Base64 to Blob
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

  return (
    <div>
      <Navbar setActiveTab={setActiveTab} />
      <div className="grid grid-cols-4 h-[80vh] mt-8 px-4">
        <div className="col-span-6 overflow-y-auto p-4">
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
              handleDeleteResume={handleDeleteResume}
            />
          )}
          {activeTab === "uploads" && (
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
