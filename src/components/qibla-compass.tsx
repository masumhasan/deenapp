
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Compass, Loader2, LocateFixed, Triangle } from 'lucide-react';
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
      setHeading(360 - newHeading);
    }
  };

  const requestPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        // Request location permission
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const qibla = calculateQiblaDirection(latitude, longitude);
                setQiblaDirection(qibla);
                
                // Now request orientation permission after getting location
                if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                    (DeviceOrientationEvent as any).requestPermission()
                    .then((permissionState: string) => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            setError(t('motion_permission_denied'));
                        }
                    })
                    .finally(() => setIsLoading(false));
                } else {
                    // For devices that don't need explicit permission
                    window.addEventListener('deviceorientation', handleOrientation);
                    setIsLoading(false);
                }
            },
            (err) => {
                setError(t('location_permission_denied'));
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

    } catch (e: any) {
        setError(e.message);
        setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    requestPermissions();
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [requestPermissions]);

  if (isLoading) {
    return (
        <Card className="w-80 h-80 flex flex-col items-center justify-center text-center p-4">
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

  const finalRotation = heading !== null && qiblaDirection !== null ? heading - qiblaDirection : 0;

  return (
    <Card className="w-80 h-80 rounded-full flex items-center justify-center p-4 shadow-2xl bg-card/50">
      <div className="relative w-full h-full">
        {/* Compass Background */}
        <div
          className="w-full h-full rounded-full transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
        >
          {['N', 'E', 'S', 'W'].map((dir, i) => (
            <div key={dir} className="absolute w-full h-full">
              <span
                className="absolute left-1/2 -top-1 -translate-x-1/2 font-bold text-lg text-primary"
                style={{ transform: `rotate(${i * 90}deg) translateY(-130px)` }}
              >
                {dir}
              </span>
            </div>
          ))}
          {/* Compass ticks */}
           {[...Array(36)].map((_, i) => (
                <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 10}deg)` }}>
                    <div className={`absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 ${i % 3 === 0 ? 'bg-foreground' : 'bg-muted-foreground/50'}`}></div>
                </div>
            ))}
        </div>

        {/* Qibla Indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${finalRotation}deg)` }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-0 w-12 h-1/2 flex flex-col items-center">
                <LocateFixed className="w-10 h-10 text-accent drop-shadow-lg" />
            </div>
          </div>
        </div>
        
         {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-accent rounded-full border-2 border-background"></div>

      </div>
    </Card>
  );
}
