import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ElectricalArea from "@/components/ElectricalArea";
import AddAreaDialog from "@/components/AddAreaDialog";

interface Area {
  id: string;
  name: string;
  code: string;
  subAreas: SubArea[];
}

interface SubArea {
  id: string;
  name: string;
  documents: ElectricalDocument[];
}

interface ElectricalDocument {
  id: string;
  name: string;
  type: 'image' | 'document';
  data: string;
  uploadDate: string;
}

const Index = () => {
  const [areas, setAreas] = useState<Area[]>([
    {
      id: 'rm',
      name: 'Room/Motor',
      code: 'RM',
      subAreas: []
    },
    {
      id: 'im', 
      name: 'Instrument/Motor',
      code: 'IM',
      subAreas: []
    },
    {
      id: 'cb',
      name: 'Circuit Breaker',
      code: 'CB', 
      subAreas: []
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('rm');
  const [showAddAreaDialog, setShowAddAreaDialog] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAreas = localStorage.getItem('electricalAreas');
    if (savedAreas) {
      setAreas(JSON.parse(savedAreas));
    }
  }, []);

  // Save to localStorage whenever areas change
  useEffect(() => {
    localStorage.setItem('electricalAreas', JSON.stringify(areas));
  }, [areas]);

  const addArea = (name: string, code: string) => {
    const newArea: Area = {
      id: code.toLowerCase().replace(/\s+/g, '-'),
      name,
      code,
      subAreas: []
    };
    
    setAreas(prev => [...prev, newArea]);
    setActiveTab(newArea.id);
    toast({
      title: "Area Added",
      description: `${name} (${code}) has been added successfully.`,
    });
  };

  const updateArea = (areaId: string, updatedArea: Partial<Area>) => {
    setAreas(prev => prev.map(area => 
      area.id === areaId ? { ...area, ...updatedArea } : area
    ));
  };

  const deleteArea = (areaId: string) => {
    if (areas.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one area.",
        variant: "destructive"
      });
      return;
    }

    setAreas(prev => prev.filter(area => area.id !== areaId));
    
    // Switch to first available tab if current tab is deleted
    if (activeTab === areaId) {
      const remainingAreas = areas.filter(area => area.id !== areaId);
      setActiveTab(remainingAreas[0]?.id || '');
    }
    
    toast({
      title: "Area Deleted",
      description: "Area has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-3 rounded-full">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Electrical Troubleshooting Guide
                </h1>
                <p className="text-gray-600">
                  Professional electrical & automation reference tool
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddAreaDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-auto bg-gray-100 p-1 rounded-t-lg">
              {areas.map((area) => (
                <TabsTrigger 
                  key={area.id} 
                  value={area.id}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
                >
                  {area.code}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {areas.map((area) => (
              <TabsContent key={area.id} value={area.id} className="p-6">
                <ElectricalArea
                  area={area}
                  onUpdateArea={(updatedArea) => updateArea(area.id, updatedArea)}
                  onDeleteArea={() => deleteArea(area.id)}
                  canDelete={areas.length > 1}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <AddAreaDialog
        open={showAddAreaDialog}
        onOpenChange={setShowAddAreaDialog}
        onAddArea={addArea}
      />
    </div>
  );
};

export default Index;
