
"use client";

import { useEffect, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BellRing, StopCircle } from "lucide-react";

interface WuduReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WuduReminderDialog({ isOpen, onClose }: WuduReminderDialogProps) {
  const audioRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const playSound = () => {
    if (!audioRef.current) {
        try {
            audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch(e) {
            console.error("AudioContext not supported", e);
            return;
        }
    }
    
    // Stop any existing sound
    if (oscillatorRef.current) {
        oscillatorRef.current.stop();
    }
    
    const oscillator = audioRef.current.createOscillator();
    const gainNode = audioRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioRef.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioRef.current.currentTime); // A4 pitch
    gainNode.gain.setValueAtTime(1, audioRef.current.currentTime);
    
    oscillator.start();
    oscillator.stop(audioRef.current.currentTime + 1); // Play for 1 second
    oscillatorRef.current = oscillator;
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      playSound();
      // Optional: Vibrate for 500ms if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(500);
      }
    } else {
        stopSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleStop = () => {
    stopSound();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <BellRing className="w-16 h-16 text-primary animate-bounce" />
          <AlertDialogTitle className="text-2xl font-headline mt-4">
            Wudu Reminder
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="text-center text-muted-foreground">
          It's 15 minutes until the next prayer. Time to make Wudu!
        </div>
        <AlertDialogFooter className="mt-4">
          <Button onClick={handleStop} className="w-full">
            <StopCircle className="mr-2 h-5 w-5" />
            Dismiss
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
