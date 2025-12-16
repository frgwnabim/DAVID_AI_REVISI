import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, CheckCircle } from 'lucide-react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg');
        onCapture(imageSrc);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
          <h3 className="text-emerald-800 font-bold text-lg flex items-center gap-2">
             <Camera className="w-5 h-5" />
             Health Scan
          </h3>
          <button onClick={onClose} className="text-emerald-600 hover:text-emerald-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
            {error ? (
                <p className="text-white text-center p-4">{error}</p>
            ) : (
                <>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay UI for "Scanning" look */}
                    <div className="absolute inset-0 border-2 border-emerald-500/50 m-8 rounded-lg pointer-events-none">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
                        <div className="absolute top-2 left-2 bg-emerald-600/80 text-white text-xs px-2 py-1 rounded">Temp. Check Mode</div>
                    </div>
                </>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-6 flex justify-center bg-white">
          <button 
            onClick={handleCapture}
            className="group relative flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-full border-4 border-white shadow-lg group-hover:scale-95 transition-transform"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;