
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: 'image' | 'document';
  data: string;
  uploadDate: string;
}

interface DocumentUploadProps {
  onUpload: (document: Document) => void;
}

const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      const document: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        data: result,
        uploadDate: new Date().toISOString()
      };

      onUpload(document);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
    };

    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="space-y-4">
        <div className="flex justify-center space-x-2">
          <Image className="h-8 w-8 text-gray-400" />
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
          <p className="text-sm text-gray-500">
            Images, PDFs, and other documents (max 10MB)
          </p>
        </div>
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        />
        
        <p className="text-xs text-gray-400">
          Supported: Images, PDF, DOC, XLS, TXT
        </p>
      </div>
    </div>
  );
};

export default DocumentUpload;
