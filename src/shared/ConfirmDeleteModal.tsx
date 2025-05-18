import * as React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface ConfirmDeleteModalProps {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  title,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md rounded-2xl p-8 z-100 bg-white">
        {/* icon */}
        <div className="flex justify-center">
          <Trash2 className="w-16 h-16 text-red-400" />
        </div>

        {/* message */}
        <h2 className="mt-6 text-center text-xl leading-snug">
          Are you sure you want
          <br />
          to delete the {title} ?
        </h2>

        {/* button */}
        <div className="mt-8">
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg py-2 px-4 cursor-pointer h-16 text-lg"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
