import React, { useCallback, useRef, useState } from 'react';

const LocationCamera = () => {
  const [error, setError] = useState<string | null>(null);

  // Photo state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoLocation, setPhotoLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [photoLoading, setPhotoLoading] = useState<boolean>(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);

  const fetchLocation = useCallback((callback?: (pos: { latitude: number; longitude: number }) => void) => {
    if (callback) {
      setPhotoLoading(true);
    }

    setError(null);

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      setPhotoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        if (callback) {
          callback(coords);
          setPhotoLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = err.message;
        if (err.code === err.TIMEOUT) {
          errorMessage = 'Timeout expired (Location permission or GPS signal took too long)';
        }
        setError(errorMessage);
        setPhotoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const handleTakePhotoClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Get location at this moment
    fetchLocation((coords) => {
      setPhotoLocation(coords);
    });

    // 2. Convert file to Base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
    width: '100%',
  };

  const retryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#666',
    marginTop: '20px',
  };

  const photoButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    marginTop: '20px',
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
        แบบ ECOM Browser
      </h1>

      {/* Hidden inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        onClick={(e) => {
          // Reset value to allow capturing the same photo/file if needed
          (e.target as HTMLInputElement).value = '';
        }}
      />

      {/* Photo Preview Section */}
      {capturedImage && (
        <div style={{ marginTop: '10px', paddingTop: '10px' }}>
          {/* <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Captured Photo</h3> */}
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
          />
          {photoLoading ? (
            <p style={textStyle}>Fetching photo coordinates...</p>
          ) : photoLocation ? (
            <div style={{ textAlign: 'left', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
              <p style={{ ...textStyle, margin: 0 }}>
                <strong>Photo Lat:</strong> {photoLocation.latitude}
              </p>
              <p style={{ ...textStyle, margin: 0 }}>
                <strong>Photo Lng:</strong> {photoLocation.longitude}
              </p>
            </div>
          ) : null}
        </div>
      )}

      <button style={photoButtonStyle} onClick={handleTakePhotoClick}>
        ถ่ายรูป (Take Photo)
      </button>
    </div>
  );
};

export default LocationCamera;
