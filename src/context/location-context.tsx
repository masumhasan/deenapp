
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface LocationContextType {
  location: Location;
  setLocation: (location: Location) => void;
  locations: Location[];
}

const locations: Location[] = [
    { name: "Dhaka, Bangladesh", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka" },
    { name: "London, UK", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
    { name: "New York, USA", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York" },
    { name: "Cairo, Egypt", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo" },
    { name: "Mecca, Saudi Arabia", latitude: 21.4225, longitude: 39.8262, timezone: "Asia/Riyadh"},
];

const defaultLocation = locations[0];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location>(defaultLocation);

  useEffect(() => {
    const savedLocationName = localStorage.getItem('locationName');
    if (savedLocationName) {
        const savedLocation = locations.find(l => l.name === savedLocationName);
        if (savedLocation) {
            setLocation(savedLocation);
        }
    }
  }, []);

  const handleSetLocation = (loc: Location) => {
    setLocation(loc);
    localStorage.setItem('locationName', loc.name);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation: handleSetLocation, locations }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
