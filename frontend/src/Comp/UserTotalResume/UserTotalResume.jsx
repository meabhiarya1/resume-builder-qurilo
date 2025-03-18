import React, { useState } from "react";
import PDFviwerModalStatic from "../PDFviwerModalStatic/PDFviwerModalStatic"; // Assuming you have a Modal component

const UserTotalResume = ({ pdfsInfo }) => {
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewResume = (pdf) => {
    setSelectedResume(pdf);
    setShowModal(true);
  };

  return (
    <div className="p-6 max-w-5xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        User Total Resumes
      </h2>
      <div className="overflow-y-auto max-h-[600px] grid grid-cols-2 gap-4 p-4 border rounded-lg shadow-lg">
        {pdfsInfo?.map((pdf) => (
          <div
            key={pdf._id}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
            onClick={() => handleViewResume(pdf)}
          >
            <h3 className="text-lg font-semibold max-w-md">{pdf.pdfName}</h3>
          </div>
        ))}
      </div>

      {showModal && selectedResume && (
        <PDFviwerModalStatic onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-2">{selectedResume.pdfName}</h2>
        </PDFviwerModalStatic>
      )}
    </div>
  );
};

export default UserTotalResume;
