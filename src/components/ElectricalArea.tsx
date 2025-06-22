
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Folder, FileText, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DocumentUpload from "./DocumentUpload";

interface ElectricalDocument {
  id: string;
  name: string;
  type: 'image' | 'document';
  data: string;
  uploadDate: string;
}

interface SubArea {
  id: string;
  name: string;
  documents: ElectricalDocument[];
}

interface Area {
  id: string;
  name: string;
  code: string;
  subAreas: SubArea[];
  documents: ElectricalDocument[];
}

interface ElectricalAreaProps {
  area: Area;
  onUpdateArea: (updatedArea: Partial<Area>) => void;
  onDeleteArea: () => void;
  canDelete: boolean;
}

const ElectricalArea = ({ area, onUpdateArea, onDeleteArea, canDelete }: ElectricalAreaProps) => {
  const [newSubAreaName, setNewSubAreaName] = useState('');
  const [showAddSubArea, setShowAddSubArea] = useState(false);

  const addSubArea = () => {
    if (!newSubAreaName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid sub-area name.",
        variant: "destructive"
      });
      return;
    }

    const newSubArea: SubArea = {
      id: Date.now().toString(),
      name: newSubAreaName.trim(),
      documents: []
    };

    onUpdateArea({
      subAreas: [...area.subAreas, newSubArea]
    });

    setNewSubAreaName('');
    setShowAddSubArea(false);
    
    toast({
      title: "Sub-Area Added",
      description: `${newSubAreaName} has been added to ${area.name}.`,
    });
  };

  const deleteSubArea = (subAreaId: string) => {
    onUpdateArea({
      subAreas: area.subAreas.filter(sa => sa.id !== subAreaId)
    });
    
    toast({
      title: "Sub-Area Deleted",
      description: "Sub-area has been removed successfully.",
    });
  };

  const addDocumentToArea = (doc: ElectricalDocument) => {
    const areaDocuments = area.documents || [];
    onUpdateArea({
      documents: [...areaDocuments, doc]
    });
  };

  const addDocumentToSubArea = (subAreaId: string, doc: ElectricalDocument) => {
    const updatedSubAreas = area.subAreas.map(sa => 
      sa.id === subAreaId 
        ? { ...sa, documents: [...sa.documents, doc] }
        : sa
    );
    
    onUpdateArea({ subAreas: updatedSubAreas });
  };

  const deleteDocumentFromArea = (documentId: string) => {
    const areaDocuments = area.documents || [];
    onUpdateArea({
      documents: areaDocuments.filter(doc => doc.id !== documentId)
    });
    
    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully.",
    });
  };

  const deleteDocumentFromSubArea = (subAreaId: string, documentId: string) => {
    const updatedSubAreas = area.subAreas.map(sa => 
      sa.id === subAreaId 
        ? { ...sa, documents: sa.documents.filter(doc => doc.id !== documentId) }
        : sa
    );
    
    onUpdateArea({ subAreas: updatedSubAreas });
    
    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully.",
    });
  };

  const viewDocument = (electricalDoc: ElectricalDocument) => {
    if (electricalDoc.type === 'image') {
      // Open image in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${electricalDoc.name}</title></head>
            <body style="margin:0;padding:20px;background:#f0f0f0;">
              <h2>${electricalDoc.name}</h2>
              <img src="${electricalDoc.data}" style="max-width:100%;height:auto;" />
            </body>
          </html>
        `);
      }
    } else {
      // For documents, create download link
      const link = window.document.createElement('a');
      link.href = electricalDoc.data;
      link.download = electricalDoc.name;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Area Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{area.name}</h2>
          <p className="text-gray-600">Area Code: {area.code}</p>
        </div>
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Area
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Area</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{area.name}"? This action cannot be undone and will remove all sub-areas and documents.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteArea} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Area Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Area Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Document Upload for Area */}
            <DocumentUpload
              onUpload={(doc) => addDocumentToArea(doc)}
            />
            
            {/* Area Documents List */}
            {area.documents && area.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Documents:</h4>
                <div className="grid gap-2">
                  {area.documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {doc.type === 'image' ? (
                          <Image className="h-5 w-5 text-green-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-600" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewDocument(doc)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteDocumentFromArea(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Sub-Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sub-Areas</CardTitle>
        </CardHeader>
        <CardContent>
          {!showAddSubArea ? (
            <Button 
              onClick={() => setShowAddSubArea(true)}
              className="w-full border-dashed border-2 border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Area
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Input
                placeholder="Enter sub-area name"
                value={newSubAreaName}
                onChange={(e) => setNewSubAreaName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubArea()}
              />
              <Button onClick={addSubArea}>Add</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddSubArea(false);
                  setNewSubAreaName('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sub-Areas List */}
      <div className="grid gap-4">
        {area.subAreas.map((subArea) => (
          <Card key={subArea.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{subArea.name}</CardTitle>
                  <Badge variant="secondary">
                    {subArea.documents.length} docs
                  </Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Sub-Area</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{subArea.name}"? This will also remove all associated documents.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteSubArea(subArea.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Document Upload */}
                <DocumentUpload
                  onUpload={(doc) => addDocumentToSubArea(subArea.id, doc)}
                />
                
                {/* Documents List */}
                {subArea.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Documents:</h4>
                    <div className="grid gap-2">
                      {subArea.documents.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {doc.type === 'image' ? (
                              <Image className="h-5 w-5 text-green-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-blue-600" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => viewDocument(doc)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteDocumentFromSubArea(subArea.id, doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {area.subAreas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No sub-areas created yet. Add your first sub-area to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ElectricalArea;
