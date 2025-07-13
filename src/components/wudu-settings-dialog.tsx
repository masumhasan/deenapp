
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BellRing } from "lucide-react";

interface WuduSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WuduSettingsDialog({ isOpen, onClose }: WuduSettingsDialogProps) {
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("wuduReminderEnabled");
    if (savedState) {
      setIsReminderEnabled(JSON.parse(savedState));
    }
  }, []);

  const handleReminderToggle = (enabled: boolean) => {
    setIsReminderEnabled(enabled);
    localStorage.setItem("wuduReminderEnabled", JSON.stringify(enabled));
    // Manually dispatch a storage event to sync other tabs/components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <BellRing className="w-6 h-6 text-primary" />
            <DialogTitle className="font-headline text-2xl">Wudu Reminder Settings</DialogTitle>
          </div>
          <DialogDescription>
            Enable this to get a notification 15 minutes before each prayer time.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <Label htmlFor="wudu-reminder-switch" className="font-semibold text-lg">
            Enable Reminder
          </Label>
          <Switch
            id="wudu-reminder-switch"
            checked={isReminderEnabled}
            onCheckedChange={handleReminderToggle}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
