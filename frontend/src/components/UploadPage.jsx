import axios from "axios";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Await } from "react-router-dom";
function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    setError(null);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith(".csv")) setFile(f);
    else setError("Please drop a .csv file");
  }

  async function handleUpload(e) {
    e?.preventDefault();
    if (!file) return setError("No file selected");
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("datasetfile", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/upload-csv/",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPreview(res.data);

      try {
        localStorage.setItem("uploaded_preview", JSON.stringify(res.data));
      } catch (e) {}
    } catch (e) {
      setError(
        e?.response?.data?.error || (e.message ? e.message : "Upload failed")
      );
    } finally {
      setUploading(false);
    }
  }

  function clear() {
    setFile(null);
    setPreview(null);
    setError(null);
    inputRef.current.value = null;
    localStorage.removeItem("uploaded_preview");
  }

  function handleFileChange(e) {
    setError(null);
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".csv")) setFile(f);
    else setError("Please select a .csv file");
  }

  return (
    <div className="min-h-[60vh] p-6 mt-17">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="rounded-2xl bg-gray-900/60 border border-gray-700 p-6 shadow-xl">
          <h2>Upload dataset</h2>
          <p></p>
          <p className="text-sm text-gray-300 mb-4">
            Drag and drop a CSV file here, or click to choose a file.
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <div className="text-center">
                <p className="text-gray-300">
                  {file ? (
                    <>
                      Selected file:
                      <span className="text-white">{file.name}</span>
                    </>
                  ) : (
                    "Drop CSV here or click to browse"
                  )}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  (Only .csv supported)
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={inputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white"
              >
                {uploading ? "Uploading..." : "Upload and preview"}
              </button>

              <button
                type="button"
                onClick={clear}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-100"
              >
                Clear
              </button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-400">{String(error)}</div>
            )}
          </form>

          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <h3 className="text-lg text-white mb-2">Preview - first rows</h3>
              <div className="overflow-auto max-h-64 border-t border-gray-700 pt-2">
                {preview.preview && preview.preview.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(preview.preview[0]).map((col) => (
                          <th
                            key={col}
                            className="text-left px-2 py-1 text-xs text-gray-300 uppercase"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.preview.map((row, i) => (
                        <tr
                          key={i}
                          className={
                            i % 2 === 0 ? "bg-gray-900/40" : "bg-transparent"
                          }
                        >
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-2 py-1 text-gray-200">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <pre className="text-sm text-gray-200">
                    {JSON.stringify(preview, null, 2)}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UploadPage;
