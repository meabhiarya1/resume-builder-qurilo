import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import TotalUsers from "../TotalUsers/TotalUsers";
import Templates from "../Templates/Templates";
import Upload from "../TemplateUplods/Uploads";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(null);

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
                <div
                  className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2"
                >
                  <div className="flex gap-2 items-center justify-center">
                    <span className="font-semibold capitalize">
                      {tab}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Main Content (2/3) */}
        <div className="col-span-3 p-4">
          {activeTab === "users" && <TotalUsers />}
          {activeTab === "templates" && <Templates />}
          {activeTab === "uploads" && <Upload />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
