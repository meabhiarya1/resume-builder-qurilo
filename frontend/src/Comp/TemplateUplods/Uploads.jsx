import React from "react";
import TemplateViewerModal from "../TemplateViewerModal/TemplateViewerModal";


const Uploads = ({
  handleSave,
  saving,
  setShowTemplateModal,
  handleTemplateUpload,
  showTemplateModal,
  images,
  setImages,
}) => {

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="flex flex-grow">
        <div className="flex flex-grow items-center justify-center">
          <div className="group relative w-[420px]">
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10">
              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-white">
                  Upload Template Files
                </h3>
                <p className="text-sm text-slate-400">
                  Drag & drop your files here
                </p>

                <div className="group/dropzone mt-6">
                  <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 transition-colors group-hover/dropzone:border-cyan-500/50">
                    <input
                      type="file"
                      className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                      accept="application/pdf"
                      onChange={handleTemplateUpload}
                    />
                    <div className="space-y-4 text-center">
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
      </div>

      {/* Template Viewer Modal */}
      {showTemplateModal && (
        <TemplateViewerModal
          setShowTemplateModal={setShowTemplateModal}
          images={images}
          setImages={setImages}
          handleSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
};

export default Uploads;
