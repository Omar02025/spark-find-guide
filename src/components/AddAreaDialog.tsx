
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AddAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddArea: (name: string, code: string) => void;
}

const AddAreaDialog = ({ open, onOpenChange, onAddArea }: AddAreaDialogProps) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !code.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both area name and code.",
        variant: "destructive"
      });
      return;
    }

    if (code.length > 5) {
      toast({
        title: "Code Too Long",
        description: "Area code should be 5 characters or less.",
        variant: "destructive"
      });
      return;
    }

    onAddArea(name.trim(), code.trim().toUpperCase());
    setName('');
    setCode('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setName('');
    setCode('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Electrical Area</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area-name">Area Name</Label>
            <Input
              id="area-name"
              placeholder="e.g., Switchgear Room, Control Panel"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area-code">Area Code</Label>
            <Input
              id="area-code"
              placeholder="e.g., SG, CP, MCC"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={5}
            />
            <p className="text-sm text-gray-500">
              Short code for tab display (max 5 characters)
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Area</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAreaDialog;
