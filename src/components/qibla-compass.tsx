
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LocateFixed } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const KAABA_LAT = 21.422487;
const KAABA_LON = 39.826206;

export default function QiblaCompass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  const calculateQiblaDirection = (lat: number, lon: number) => {
    const toRadians = (deg: number) => deg * (Math.PI / 180);
    const toDegrees = (rad: number) => rad * (180 / Math.PI);

    const lat1 = toRadians(lat);
    const lon1 = toRadians(lon);
    const lat2 = toRadians(KAABA_LAT);
    const lon2 = toRadians(KAABA_LON);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let newHeading = event.alpha;
    // For iOS devices
    if (typeof (event as any).webkitCompassHeading !== 'undefined') {
      newHeading = (event as any).webkitCompassHeading;
    }
    if (newHeading !== null) {
      setHeading(newHeading);
    }
  };

  const requestPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Request Geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const qibla = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(qibla);

        // Geolocation successful, now request orientation
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          (DeviceOrientationEvent as any).requestPermission()
            .then((permissionState: string) => {
              if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                setIsLoading(false);
              } else {
                setError(t('motion_permission_denied'));
                setIsLoading(false);
              }
            })
            .catch((e: Error) => {
              setError(t('motion_permission_denied'));
              setIsLoading(false);
            });
        } else {
          // For devices that don't need explicit permission (e.g., Android)
          window.addEventListener('deviceorientation', handleOrientation);
          setIsLoading(false);
        }
      },
      (err) => {
        // Geolocation failed
        setError(t('location_permission_denied'));
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [t]);

  useEffect(() => {
    requestPermissions();
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [requestPermissions]);


  if (isLoading) {
    return (
        <Card className="w-80 h-80 flex flex-col items-center justify-center text-center p-4 bg-card/50 shadow-2xl rounded-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t('requesting_permissions')}</p>
        </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-80">
        <AlertTitle>{t('error')}</AlertTitle>
        <AlertDescription>
          {error}
          <button onClick={requestPermissions} className="font-bold underline mt-2 block">{t('try_again')}</button>
        </AlertDescription>
      </Alert>
    );
  }

  const qiblaRelativeRotation = qiblaDirection !== null && heading !== null ? qiblaDirection - heading : 0;

  return (
    <div className="w-80 h-80 rounded-full flex items-center justify-center bg-card shadow-inner" style={{
        background: 'radial-gradient(circle, hsl(var(--card)) 70%, hsl(var(--background)) 100%)'
    }}>
      <div 
        className="relative w-[280px] h-[280px] rounded-full transition-transform duration-200 ease-linear shadow-2xl" 
        style={{ transform: `rotate(${-heading}deg)` }}
      >
        {/* Compass background with ticks */}
        <div className="absolute w-full h-full rounded-full bg-card/80 backdrop-blur-sm" style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.2)'
        }}>
            {[...Array(36)].map((_, i) => (
                <div key={`tick-${i}`} className="absolute w-full h-full" style={{ transform: `rotate(${i * 10}deg)` }}>
                    <div className={`absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 ${i % 9 === 0 ? 'bg-primary h-6' : i % 3 === 0 ? 'bg-foreground' : 'bg-muted-foreground/50'}`}></div>
                </div>
            ))}
             {['N', 'E', 'S', 'W'].map((dir, i) => (
                <div key={dir} className="absolute w-full h-full">
                <span
                    className="absolute left-1/2 -translate-x-1/2 font-bold text-lg text-primary"
                    style={{ transform: `rotate(${i * 90}deg) translateY(-28px)` }}
                >
                    {dir}
                </span>
                </div>
            ))}
        </div>
      </div>
      
      {/* Qibla Indicator Arrow - rotates relative to compass */}
       <div
        className="absolute w-80 h-80 flex justify-center transition-transform duration-200 ease-in-out"
        style={{ transform: `rotate(${qiblaRelativeRotation}deg)` }}
        >
        <div className="w-0 h-0
            border-l-[15px] border-l-transparent
            border-r-[15px] border-r-transparent
            border-b-[100px] border-b-accent drop-shadow-lg
            absolute top-[30px]"
        />
        <LocateFixed className="w-10 h-10 text-accent-foreground absolute top-[115px] drop-shadow-lg" />
      </div>

       {/* Center pin */}
        <div className="absolute w-5 h-5 bg-accent rounded-full border-2 border-background shadow-md"></div>
    </div>
  );
}
