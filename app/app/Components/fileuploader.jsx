import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";

export default function FileUpload() {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    // Handle file uploads (e.g., sending to backend)
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    removeFile,
  } = useDropzone({ onDrop, multiple: true, accept: { "image/*": [] } });

  return (
    <Card className="w-full max-w-lg mx-auto p-6 border border-dashed rounded-xl shadow-md">
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-10 rounded-lg cursor-pointer text-center transition duration-300 ease-in-out ${
            isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
          <p className="text-gray-600 mt-2">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here or click to browse"}
          </p>
        </div>

        {/* Uploaded Files List */}
        <div className="mt-4">
          {acceptedFiles.length > 0 && (
            <ul className="space-y-2">
              {acceptedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
