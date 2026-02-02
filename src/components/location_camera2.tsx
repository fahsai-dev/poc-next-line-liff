import React, { useCallback, useEffect, useRef, useState } from 'react';

const LocationCameraLIFF = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoLocation, setPhotoLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** ตรวจ mobile */
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  /** เปิดกล้อง */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      // setError('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาต Camera');
    }
  };

  /** ปิดกล้อง */
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
  };

  /** ขอ location */
  const fetchLocation = useCallback((cb: (pos: { latitude: number; longitude: number }) => void) => {
    setPhotoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        cb({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setPhotoLoading(false);
      },
      () => {
        setError('ไม่สามารถดึงตำแหน่งได้ กรุณาอนุญาต Location');
        setPhotoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  /** ถ่ายรูป */
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg'));

    fetchLocation((coords) => setPhotoLocation(coords));
    stopCamera();
  };

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#F5F5F5',
    borderRadius: '12px',
    // boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '20px auto',
    textAlign: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <h1
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#333',
        }}
      >
        แบบ-ถ่ายรูป
      </h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!capturedImage ? (
        <>
          <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 8 }} />
          <button onClick={takePhoto} style={{ marginTop: 12, width: '100%' }}>
            📸 ถ่ายรูป
          </button>
        </>
      ) : (
        <>
          <img src={capturedImage} style={{ width: '100%', borderRadius: 8 }} />
          {photoLoading ? (
            <p>กำลังดึงพิกัด…</p>
          ) : (
            photoLocation && (
              <div style={{ textAlign: 'left', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                <p style={{ ...textStyle, margin: 0 }}>
                  <strong>Photo Lat:</strong> {photoLocation.latitude}
                </p>
                <p style={{ ...textStyle, margin: 0 }}>
                  <strong>Photo Lng:</strong> {photoLocation.longitude}
                </p>
              </div>
            )
          )}
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default LocationCameraLIFF;
