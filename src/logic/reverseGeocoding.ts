import { LatLng } from 'leaflet';

export type ReverseGeocodeResult = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: {
        country?: string;
        state?: string;
        city?: string;
        village?: string;
        road?: string;
        postcode?: string;
        building?: string;
        amenity?: string;
        tourism?: string;
        house_number?: string;
    };
    boundingbox: [string, string, string, string]; // [minLat, maxLat, minLon, maxLon]
}


export async function reverseGeocode(pos: LatLng): Promise<ReverseGeocodeResult> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`
        );
        const data = await response.json();

        if (data && data.display_name) {
            return data;
        } else {
            throw new Error("Address not found");
        }
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        throw error;
    }
}