import UploadComponent from "./components/upload-component";
import Chat from "./components/Chat";
import UploadedPDFs from "./components/UploadedPDF";

export default function Home() {
  return (
    <div>
      <div className="flex h-screen">
        <div className="w-[30%] p-4 justify-center items-center">
          <section className="flex flex-col gap-4">
            <UploadComponent />
            <UploadedPDFs />
          </section>
        </div>
        <div className="w-[70%] p-4 border-l-2 border-gray-800">
          <Chat />
        </div>
      </div>
    </div>
  );
}
