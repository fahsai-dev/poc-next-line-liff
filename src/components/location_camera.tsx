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
    setPhotoLoading(true);
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
        } else {
          setPhotoLocation(coords);
        }
        setPhotoLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = err.message;
        if (err.code === err.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please enable location services.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        } else if (err.code === err.TIMEOUT) {
          errorMessage = 'Location request timed out.';
        }
        setError(errorMessage);
        setPhotoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // Allow 10 seconds old cached position
      }
    );
  }, []);

  const handleTakePhotoClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    await fetchLocation();
  };

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#F5F5F5',
    borderRadius: '12px',
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

  const photoButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#06C755', // LINE Green
    marginTop: '20px',
  };

  const retryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#666',
    fontSize: '14px',
    padding: '8px 16px',
    width: 'auto',
    marginTop: '8px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#dc3545',
    backgroundColor: '#fff5f5',
    padding: '10px',
    borderRadius: '8px',
    marginTop: '10px',
    border: '1px solid #ffc9c9',
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
          (e.target as HTMLInputElement).value = '';
        }}
      />

      {/* Photo Preview Section */}
      {capturedImage && (
        <div style={{ marginTop: '10px', paddingTop: '10px' }}>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
          />

          {photoLoading && (
            <p style={textStyle}>
              <span className="spinner" style={{ marginRight: '8px' }}>
                ⏳
              </span>
              Fetching photo coordinates...
            </p>
          )}

          {error && (
            <div style={errorStyle}>
              <p style={{ margin: 0 }}>⚠️ {error}</p>
              <button style={retryButtonStyle} onClick={() => fetchLocation()}>
                Retry Fetch Location
              </button>
            </div>
          )}

          {photoLocation && !photoLoading && (
            <div
              style={{
                textAlign: 'left',
                backgroundColor: '#f9f9f9',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #eee',
              }}
            >
              <p style={{ ...textStyle, margin: 0 }}>
                <strong>Photo Lat:</strong> {photoLocation.latitude}
              </p>
              <p style={{ ...textStyle, margin: 0 }}>
                <strong>Photo Lng:</strong> {photoLocation.longitude}
              </p>
              <button
                style={{ ...retryButtonStyle, backgroundColor: '#0070f3', marginTop: '10px' }}
                onClick={() => fetchLocation()}
              >
                Refresh Location
              </button>
            </div>
          )}
        </div>
      )}

      <button style={photoButtonStyle} onClick={handleTakePhotoClick}>
        ถ่ายรูป (Take Photo)
      </button>
    </div>
  );
};

export default LocationCamera;
