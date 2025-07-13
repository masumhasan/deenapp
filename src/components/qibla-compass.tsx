
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LocateFixed } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

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
        <Card className="w-80 h-80 flex flex-col items-center justify-center text-center p-4 bg-card/50 shadow-2xl rounded-full border-none">
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
  
  const Ticks = () => (
    <div className="absolute w-full h-full" style={{
        background: `conic-gradient(
            from -90deg, 
            hsl(var(--foreground)) 0.25deg, 
            transparent 0.25deg 29.75deg,
            hsl(var(--muted-foreground)) 30deg,
            transparent 30.25deg 89.75deg,
            hsl(var(--foreground)) 90deg,
            transparent 90.25deg 119.75deg,
            hsl(var(--muted-foreground)) 120deg,
            transparent 120.25deg 179.75deg,
            hsl(var(--foreground)) 180deg,
            transparent 180.25deg 209.75deg,
            hsl(var(--muted-foreground)) 210deg,
            transparent 210.25deg 269.75deg,
            hsl(var(--foreground)) 270deg,
            transparent 270.25deg 299.75deg,
            hsl(var(--muted-foreground)) 300deg,
            transparent 300.25deg 359.75deg,
            hsl(var(--foreground)) 360deg
        )`
    }}/>
  );


  return (
    <div className="relative w-80 h-80 rounded-full flex items-center justify-center bg-[#222] shadow-[inset_0_0_1.5rem_black,_0_0_1.5rem_black] p-4">
        <Ticks />
        <div 
            className="relative w-[280px] h-[280px] rounded-full transition-transform duration-200 ease-linear bg-[#222] shadow-[inset_0_0_2rem_black]"
            style={{ transform: `rotate(${-heading}deg)` }}
        >
            <div className='absolute w-full h-full rounded-full shadow-[0_0_3rem_black] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.9)_100%)]' />
            <div className='absolute w-full h-full rounded-full opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.4)_0%,_rgba(255,255,255,0)_50%)]' />

            <div className="absolute w-full h-full text-center flex items-center justify-center font-bold text-2xl text-primary" style={{transform: "rotate(0deg)"}}>
                <span className='absolute top-3'>N</span>
            </div>
            <div className="absolute w-full h-full text-center flex items-center justify-center font-bold text-2xl text-foreground/80" style={{transform: "rotate(90deg)"}}>
                <span className='absolute top-3'>E</span>
            </div>
             <div className="absolute w-full h-full text-center flex items-center justify-center font-bold text-2xl text-foreground/80" style={{transform: "rotate(180deg)"}}>
                <span className='absolute top-3'>S</span>
            </div>
            <div className="absolute w-full h-full text-center flex items-center justify-center font-bold text-2xl text-foreground/80" style={{transform: "rotate(270deg)"}}>
                <span className='absolute top-3'>W</span>
            </div>

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#111] shadow-[0_0_0.5rem_black]'/>
        </div>
        
        <div
            className="absolute w-80 h-80 flex justify-center transition-transform duration-200 ease-in-out"
            style={{ transform: `rotate(${qiblaRelativeRotation}deg)` }}
        >
            <div className="w-0 h-0
                border-l-[15px] border-l-transparent
                border-r-[15px] border-r-transparent
                border-b-[100px] border-b-accent drop-shadow-lg
                absolute top-[18px]"
            />
            <LocateFixed className="w-8 h-8 text-accent-foreground absolute top-[100px] drop-shadow-lg" />
        </div>
    </div>
  );
}
