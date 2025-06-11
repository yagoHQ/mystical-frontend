import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type QRModelDialogProps = {
  id: string;
  originPosition: number[];
  originRotation: number[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const QRModelDialog: React.FC<QRModelDialogProps> = ({
  id,
  originPosition,
  originRotation,
  open,
  onOpenChange,
}) => {
  // QR data payload
  const qrData = JSON.stringify({ id });

  // QR code service URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrData
  )}`;

  // Download handler
  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download QR code:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md z-100">
        <DialogHeader>
          <DialogTitle>QR Model Info</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* QR Code Display */}
          <div className="flex flex-col items-center space-y-2">
            <h4 className="text-sm text-muted-foreground">Scan QR Code</h4>
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove(
                    'hidden'
                  );
                }}
              />
              <div className="hidden text-center text-sm text-gray-500 p-8">
                QR Code failed to load
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center max-w-xs">
              Scan with your mobile device to get model information
            </p>
          </div>

          {/* Model Information */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm text-muted-foreground">Model ID</h4>
                <p className="font-medium font-mono text-sm">{id}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm text-muted-foreground">
                  Origin Position
                </h4>
                <p className="font-medium font-mono text-sm">
                  [{originPosition.join(', ')}]
                </p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">
                  Origin Rotation
                </h4>
                <p className="font-medium font-mono text-sm">
                  [{originRotation.join(', ')}]
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 flex flex-col gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(qrData)}
              className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Copy QR Data to Clipboard
            </button>
            <button
              onClick={handleDownload}
              className="w-full px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
            >
              Download QR Image
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModelDialog;
