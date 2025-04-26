"use client";
import { Upload } from "lucide-react";
import { easeIn, easeInOut, motion } from "framer-motion";

const UploadComponent = () => {
  const handelFileUpload = () => {
    // pdf file upload
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async (ev) => {
      if (el.files && el.files.length > 0) {
        const file = el.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("pdf", file);

          await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
          });
          alert(`PDF file uploaded ${file.name}`);
        }
      }
    });
    el.click();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={easeInOut}
      onClick={handelFileUpload}
    >
      <section>
        <div className="flex items-center justify-center flex-col text-xl font-bold bg-gray-900 rounded-xl p-4 gap-2">
          <h3>Upload a PDF file</h3>
          <Upload/>
        </div>  
      </section>

    </motion.div>
  );
};

export default UploadComponent;
