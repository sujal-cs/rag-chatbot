// components/UploadedPDFs.tsx
"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

interface PDFFile {
  name: string;
  url: string;
}

export default function UploadedPDFs() {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPDFs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/list/pdfs");
      if (!res.ok) throw new Error("Failed to fetch PDFs");
      const data = await res.json();
      setPdfs(data.files || []);
    } catch {
      setError("Unable to load uploaded PDFs from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Uploaded PDFs</h2>

      {loading ? (
        <p className="text-gray-400">Loading PDFs...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : pdfs.length === 0 ? (
        <p className="text-gray-500">No PDFs uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {pdfs.map((pdf, index) => {
            // Remove all leading numeric segments like "12345-67890-"
            const displayName = pdf.name.replace(/^(\d+-)+/, "");
            return (
              <li
                key={index}
                className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition"
              >
                <FileText size={32} />
                <div className="flex-1 min-w-0">
                  {/* break-all ensures the long names wrap */}
                  <p className="text-lg font-semibold break-all">
                    {displayName}
                  </p>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    View PDF
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
