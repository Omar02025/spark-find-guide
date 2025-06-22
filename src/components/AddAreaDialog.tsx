
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AddAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddArea: (name: string) => void;
}

const AddAreaDialog = ({ open, onOpenChange, onAddArea }: AddAreaDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter an area name.",
        variant: "destructive"
      });
      return;
    }

    if (name.trim().length < 10 || name.trim().length > 20) {
      toast({
        title: "Invalid Length",
        description: "Area name must be between 10 and 20 characters.",
        variant: "destructive"
      });
      return;
    }

    onAddArea(name.trim());
    setName('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setName('');
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
              placeholder="e.g., Switchgear Room Main, Control Panel North"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
            <p className="text-sm text-gray-500">
              Area name must be between 10-20 characters ({name.length}/20)
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
