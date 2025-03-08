"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationCrosshairs } from "react-icons/fa6";
import Store from "@/types/store";
import { storeLocations } from "@/data/store-locations";

// Custom icon for store markers
const storeIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icon for the user's location
const userIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Haversine formula (fallback) to calculate distance (in km) between two coordinates
function haversineDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to format seconds into "days, hours, min"
function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  let parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min`);
  return parts.join(", ") || "0 min";
}

// Component to capture the map instance
const SetMapInstance = ({ setMap }: { setMap: (map: Map) => void }) => {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
};

// Custom Marker component for a store
const StoreMarker = ({
  store,
  isActive,
  onClickCenter,
}: {
  store: Store;
  isActive: boolean;
  onClickCenter: (store: Store) => void;
}) => {
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // When the store becomes active, open its popup
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isActive]);

  return (
    <Marker
      ref={markerRef}
      position={[store.lat, store.lng]}
      icon={storeIcon}
      eventHandlers={{
        click: () => onClickCenter(store),
      }}
    >
      <Popup>
        <div className="text-sm font-bold">{store.name}</div>
        <div className="text-xs">{store.address}</div>
      </Popup>
    </Marker>
  );
};

const StoreLocator = () => {
  // State variables
  const [userLocation, setUserLocation] = useState<[number, number]>();
  const [search, setSearch] = useState<string>("");
  const [filteredStores, setFilteredStores] = useState<Store[]>(storeLocations);
  const [drivingDistances, setDrivingDistances] = useState<Record<number, number | null>>({});
  const [drivingDurations, setDrivingDurations] = useState<Record<number, number | null>>({});
  const [closestStore, setClosestStore] = useState<(Store & { distance: string }) | null>(null);
  // Store for which directions are being displayed
  const [directionStore, setDirectionStore] = useState<(Store & { distance: string }) | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [loadingDistances, setLoadingDistances] = useState<boolean>(false);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);
  const [map, setMap] = useState<Map | null>(null);

  // Update filtered stores based on search input
  useEffect(() => {
    setFilteredStores(
      storeLocations.filter((store) =>
        store.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  // Fetch driving distances & durations when userLocation is set
  useEffect(() => {
    if (userLocation && filteredStores.length > 0) {
      async function fetchDrivingData() {
        setLoadingDistances(true);
        const distances: Record<number, number | null> = {};
        const durations: Record<number, number | null> = {};
        await Promise.all(
          filteredStores.map(async (store) => {
            try {
              // OSRM expects coordinates as lon,lat
              const url = `https://router.project-osrm.org/route/v1/driving/${userLocation![1]},${userLocation![0]};${store.lng},${store.lat}?overview=false`;
              const response = await fetch(url);
              const data = await response.json();
              if (data.routes && data.routes.length > 0) {
                distances[store.id] = data.routes[0].distance / 1000; // convert meters to km
                durations[store.id] = data.routes[0].duration; // in seconds
              } else {
                distances[store.id] = null;
                durations[store.id] = null;
              }
            } catch (error) {
              console.error("Error fetching driving data for store", store.id, error);
              distances[store.id] = null;
              durations[store.id] = null;
            }
          })
        );
        setDrivingDistances(distances);
        setDrivingDurations(durations);
        setLoadingDistances(false);
      }
      fetchDrivingData();
    }
  }, [userLocation, filteredStores]);

  // Compute the closest store (fallback to Haversine if driving data isn’t available)
  useEffect(() => {
    if (userLocation && Object.keys(drivingDistances).length > 0) {
      let minDistance = Infinity;
      let nearestStore: (Store & { distance: string }) | null = null;
      filteredStores.forEach((store) => {
        const driving = drivingDistances[store.id];
        const distance =
          driving != null
            ? driving
            : haversineDistance(userLocation!, [store.lat, store.lng]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestStore = { ...store, distance: distance.toFixed(2) };
        }
      });
      setClosestStore(nearestStore);
    }
  }, [userLocation, drivingDistances, filteredStores]);

  // Function to fetch and display directions for a given store
  const handleGetDirections = async (store: Store & { distance: string }) => {
    if (!userLocation) {
      alert("Please click 'Find My Location' to get your location first.");
      return;
    }
    // Center the map on the store
    if (map) {
      map.flyTo([store.lat, store.lng], 7);
    }
    setDirectionStore(store);
    setLoadingRoute(true);
    try {
      // Request full route geometry in GeoJSON format from OSRM
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${store.lng},${store.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
          (coord: number[]) => [coord[1], coord[0]]
        );
        setRouteGeometry(coords);
      } else {
        setRouteGeometry(null);
      }
    } catch (error) {
      console.error("Error fetching route geometry:", error);
      setRouteGeometry(null);
    }
    setLoadingRoute(false);
  };

  // Function to center the map on a store (without fetching directions)
  const handleCenterStore = (store: Store) => {
    if (map) {
      map.flyTo([store.lat, store.lng], 7);
    }
  };

  // Locate the user using the Geolocation API
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (map) {
            map.flyTo([latitude, longitude], 12);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Error getting your location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full md:border">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 p-4 bg-white">
        <button
          onClick={handleLocateUser}
          className="md:mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow w-full flex justify-center items-center gap-2"
        >
          <FaLocationCrosshairs />
          <span>Find My Location</span>
        </button>
        <input
          type="text"
          placeholder="Search stores..."
          className="w-full p-2 border rounded mb-4 hidden md:block"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {userLocation && loadingDistances && (
          <div className="mb-4 p-2 bg-yellow-100 rounded hidden md:block">Loading distances...</div>
        )}
        <ul className="space-y-4 md:h-[400px] lg:h-[500px] overflow-y-auto hidden md:block">
          {filteredStores.map((store) => {
            const driving = drivingDistances[store.id];
            const distance =
              driving != null
                ? driving
                : userLocation
                  ? haversineDistance(userLocation!, [store.lat, store.lng])
                  : 0;
            const duration = drivingDurations[store.id];
            return (
              <li key={store.id} className="border-b-[1px] pb-3">
                <div className="font-bold">{store.name}</div>
                <div className="text-sm">{store.address}</div>
                <div className="text-sm">
                  {store.city}, {store.state} - {store.pincode}
                </div>
                <div className="text-sm mt-1">
                  Distance: {distance.toFixed(2)} km
                </div>
                {duration != null && (
                  <div className="text-sm">
                    Time: {formatDuration(duration)}
                  </div>
                )}
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleCenterStore(store)}
                    className="bg-gray-300 px-2 py-1 rounded text-sm"
                  >
                    Center
                  </button>
                  <button
                    onClick={() =>
                      handleGetDirections({ ...store, distance: distance.toFixed(2) })
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Direction
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Container: Closest Store Summary and Map */}
      <div className="w-full md:w-2/3 flex flex-col p-4">
        <div className="mb-4 bg-green-100 flex items-center justify-between p-2 text-green-800">
          {closestStore ? (
            <div className="text-sm">
              <span className="font-bold">{closestStore.name}</span> -{" "}
              {closestStore.address}, {closestStore.city}, {closestStore.state},{" "}
              {closestStore.pincode} | Distance: {closestStore.distance} km{" "}
              {drivingDurations[closestStore.id] != null &&
                `| Time: ${formatDuration(drivingDurations[closestStore.id]!)}`}
            </div>
          ) : (
            <div className="text-sm">Please click "Find My Location" to find the closest store</div>
          )}
          {closestStore && (
            <button
              onClick={() =>
                handleGetDirections({ ...closestStore, distance: closestStore.distance })
              }
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Direction
            </button>
          )}
        </div>
        <div className="flex-1 ">
          <MapContainer center={[20.92492, 77.32356,]} zoom={6} className="min-h-[400px] h-full w-full">
            <SetMapInstance setMap={setMap} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Render markers for stores using the custom StoreMarker */}
            {filteredStores.map((store) => (
              <StoreMarker
                key={store.id}
                store={store}
                isActive={directionStore ? store.id === directionStore.id : false}
                onClickCenter={handleCenterStore}
              />
            ))}
            {/* User location marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {/* Render the route if directions are active */}
            {userLocation && directionStore && (
              <>
                {loadingRoute ? (
                  <Polyline
                    positions={[userLocation, [directionStore.lat, directionStore.lng]]}
                    color="green"
                    dashArray="5,5"
                  />
                ) : routeGeometry ? (
                  <Polyline positions={routeGeometry} color="green" />
                ) : (
                  <Polyline
                    positions={[userLocation, [directionStore.lat, directionStore.lng]]}
                    color="green"
                  />
                )}
              </>
            )}
          </MapContainer>
        </div>
        <div className="mobile-store-list md:hidden mt-3">
          <input
            type="text"
            placeholder="Search stores..."
            className="w-full p-2 border rounded mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {userLocation && loadingDistances && (
            <div className="mb-4 p-2 bg-yellow-100 roundedk">Loading distances...</div>
          )}
          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredStores.map((store) => {
              const driving = drivingDistances[store.id];
              const distance =
                driving != null
                  ? driving
                  : userLocation
                    ? haversineDistance(userLocation!, [store.lat, store.lng])
                    : 0;
              const duration = drivingDurations[store.id];
              return (
                <li key={store.id} className="border-b-[1px] pb-3">
                  <div className="font-bold">{store.name}</div>
                  <div className="text-sm">{store.address}</div>
                  <div className="text-sm">
                    {store.city}, {store.state} - {store.pincode}
                  </div>
                  <div className="text-sm mt-1">
                    Distance: {distance.toFixed(2)} km
                  </div>
                  {duration != null && (
                    <div className="text-sm">
                      Time: {formatDuration(duration)}
                    </div>
                  )}
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleCenterStore(store)}
                      className="bg-gray-300 px-2 py-1 rounded text-sm"
                    >
                      Center
                    </button>
                    <button
                      onClick={() =>
                        handleGetDirections({ ...store, distance: distance.toFixed(2) })
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Direction
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
