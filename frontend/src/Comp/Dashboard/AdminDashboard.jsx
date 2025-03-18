import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import TotalUsers from "../TotalUsers/TotalUsers";
import Templates from "../Templates/Templates";
import Upload from "../TemplateUplods/Uploads";
import UsersResumeModals from "../AdminModals/UsersResumeModals/UsersResumeModals";
import axios from "axios";
import UserResumePDFViewerModalStatic from "../AdminModals/UsersResumeModals/UserResumePDFViewerModalStatic";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModalModalStatic, setShowModalModalStatic] = useState(false);
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

  const handleUserPdfs = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Get token from storage

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/pdfs/${id}`,
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

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-4 h-[80vh] mt-8 px-4">
        {/* Sidebar (1/3) */}
        <div className="bg-gray-700 p-4 flex flex-col gap-4 rounded-lg">
          {["users", "templates", "uploads"].map((tab) => (
            <div
              key={tab}
              className="bg-gradient-to-b from-stone-300/40 to-transparent p-[4px] rounded-[16px]"
            >
              <button
                className={`group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 
                shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
                active:scale-[0.995] w-full cursor-pointer`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2">
                  <div className="flex gap-2 items-center justify-center">
                    <span className="font-semibold capitalize">{tab}</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Main Content (2/3) */}
        <div className="col-span-3 p-4">
          {activeTab === "users" && (
            <TotalUsers
              users={users}
              loading={loading}
              error={error}
              handleUserPdfs={handleUserPdfs}
            />
          )}
          {activeTab === "templates" && <Templates />}
          {activeTab === "uploads" && <Upload />}
        </div>
      </div>

      {isModalOpen && (
        <UsersResumeModals
          pdfData={pdfData}
          setIsModalOpen={setIsModalOpen}
          setSelectedResume={setSelectedResume}
          setShowModalModalStatic={setShowModalModalStatic}
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
