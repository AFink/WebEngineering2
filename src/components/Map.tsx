import 'leaflet/dist/leaflet.css';
import React, { useContext, useEffect, useRef } from 'react';
import L, { LatLng, Map, Routing } from 'leaflet';
import 'leaflet-routing-machine';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { LayersControl, MapContainer, TileLayer, ZoomControl } from 'react-leaflet';

import "leaflet-routing-machine";
import { MapContext } from './Provider';
import { Context } from './context';

L.Marker.prototype.options.icon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const DEFAULT_ZOOM = 16;

type LocationMapProps = {
};

const LocationMap: React.FC<LocationMapProps> = () => {
    const context = useContext(Context) as MapContext;
    const { setMap, setRouter } = context || {};
    const mapRef = useRef<Map>(null);
    const routingRef = useRef<Routing.Control>();

    // Set router instance in context
    useEffect(() => {
        if (routingRef.current && setRouter) {
            // @ts-expect-error context prop
            setRouter(routingRef.current);
        }
    }, [routingRef, setRouter]);

    // Set map instance in context
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        // @ts-expect-error context prop
        if (setMap) setMap(map);
    }, [mapRef, setMap]);

    return (
        <div className='map-container'>
            {/* @ts-expect-error internal prop */}
            <MapContainer center={new LatLng(52.4, 10.2)} whenReady={(mapInstance) => { mapRef.current = mapInstance.target }} zoomControl={false} zoom={DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }}>
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
                </LayersControl>
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    );
};

export default LocationMap;
