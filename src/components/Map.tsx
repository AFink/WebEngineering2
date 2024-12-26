import 'leaflet/dist/leaflet.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import L, { LatLng, Map, Routing } from 'leaflet';
import 'leaflet-routing-machine';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { LayersControl, MapContainer, TileLayer, ZoomControl } from 'react-leaflet';

import "leaflet-routing-machine";
import RoutingControl from "./RoutingControl";
import { Context } from './context';
import { DraggableMarker } from './Marker';
import { MapContext } from './Provider';
import { ReverseLocation } from './SearchLocation';


L.Marker.prototype.options.icon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const DEFAULT_ZOOM = 16;

type LocationMapProps = {
    startingLocation: LatLng;
    startingLocationReversed: ReverseLocation | null;
    searchingLocation: LatLng | null;
    searchingLocationReversed: ReverseLocation | null;
    setSearchingLocation: (location: LatLng) => void;
    setStartingLocation: (location: LatLng) => void;
    setRoutes: (routes: Routing.IRoute[] | null) => void;
};

const LocationMap: React.FC<LocationMapProps> = ({ startingLocation, startingLocationReversed, searchingLocation, searchingLocationReversed, setSearchingLocation, setStartingLocation, setRoutes }) => {
    const context = useContext(Context) as MapContext;
    const { setMap, setRouter } = context || {};
    const mapRef = useRef<Map>(null);
    const routingRef = useRef<Routing.Control>(null);
    const [routes, setRoutesData] = useState<Routing.IRoute[] | null>(null);

    // Set router instance in context
    useEffect(() => {
        if (routingRef.current && setRouter) {
            // @ts-expect-error context prop
            setRouter(routingRef.current);
        }
    }, [routingRef, setRouter, startingLocation, searchingLocation]);

    // Update waypoints when locations change
    useEffect(() => {
        const waypoints = [startingLocation];

        if (searchingLocation) {
            waypoints.push(searchingLocation);
        }

        if (routingRef.current) {
            routingRef.current.setWaypoints(waypoints);
            setRoutes(null);
            setRoutesData(null);
        }
    }, [startingLocation, searchingLocation, setRoutes, setRoutesData]);

    // Set map instance in context
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        // @ts-expect-error context prop
        if (setMap) setMap(map);
    }, [mapRef, setMap]);

    // Fit markers and route into map bounds
    useEffect(() => {
        const locations: LatLng[] = [];

        // Add starting location into locations
        if (startingLocation) {
            locations.push(startingLocation);
        }

        // Add searching location into locations
        if (searchingLocation) {
            locations.push(searchingLocation);
        }

        // Add route into locations
        if (routingRef.current) {
            const fixedRoutingRef = routingRef.current as unknown as Routing.Control & { _selectedRoute: Routing.IRoute };
            if (fixedRoutingRef._selectedRoute) {
                const coordinates = fixedRoutingRef._selectedRoute?.coordinates;
                coordinates?.forEach((coordinate) => {
                    locations.push(coordinate);
                });
            }
        }

        // Fit map to bounds
        if (mapRef.current) {
            const map = mapRef.current;
            const bounds = L.latLngBounds(locations);
            map.fitBounds(bounds, { paddingTopLeft: [70, 30], paddingBottomRight: [50, 30], maxZoom: DEFAULT_ZOOM });
        }
    }, [searchingLocation, startingLocation, routes, mapRef]);

    return (
        <div className='map-container'>
            {/* @ts-expect-error internal prop */}
            <MapContainer whenReady={(mapInstance) => { mapRef.current = mapInstance.target }} zoomControl={false} center={startingLocation} zoom={DEFAULT_ZOOM} className='w-100 h-100'>
                {/* @ts-expect-error custom prop */}
                {searchingLocation && <RoutingControl ref={routingRef as unknown as React.LegacyRef<Routing.Control>} setRoutes={(routes) => { setRoutes(routes); setRoutes(routes); }} position={"topleft"} start={startingLocation} end={searchingLocation} color={"#757de8"} />}
                <LayersControl position="bottomright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap Standard">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Humanitarian">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Topographic">
                        <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                        />
                    </LayersControl.BaseLayer>

                    {startingLocation && (
                        <DraggableMarker location={startingLocation} locationReversed={startingLocationReversed} setLocation={setStartingLocation} />
                    )}
                    {searchingLocation && (
                        <DraggableMarker location={searchingLocation} locationReversed={searchingLocationReversed} setLocation={setSearchingLocation} />
                    )}
                </LayersControl>
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    );
};

export default LocationMap;
