import React from "react";
import Navbar from "../Navbar/Navbar";

const UserDashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />


      <div className="flex flex-grow items-center justify-center">
        <div className="group relative w-[420px]">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10">
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-sky-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>
            <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>

            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Upload Files
                  </h3>
                  <p className="text-sm text-slate-400">
                    Drag & drop your files here
                  </p>
                </div>
                <div className="rounded-lg bg-cyan-500/10 p-2">
                  <svg
                    className="h-6 w-6 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="group/dropzone mt-6">
                <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 transition-colors group-hover/dropzone:border-cyan-500/50">
                  <input
                    type="file"
                    className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                    multiple=""
                  />
                  <div className="space-y-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">
                      <svg
                        className="h-10 w-10 text-cyan-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>

                    <div className="space-y-2">
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

              <div className="mt-6 grid gap-4">
                <button className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 p-px font-medium text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset] transition-colors hover:shadow-[0_1000px_0_0_hsl(0_0%_100%_/_2%)_inset] cursor-pointer">
                  <span className="relative flex items-center justify-center gap-2 rounded-xl bg-slate-950/50 px-4 py-2 transition-colors group-hover/btn:bg-transparent">
                    Upload
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
