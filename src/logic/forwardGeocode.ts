import { LatLng } from "leaflet";

type ForwardGeocodeRawResult = {
    place_id: number;               // Unique ID for the place
    licence: string;                // License information
    osm_type: string;               // The OSM type (e.g., node, way, relation)
    osm_id: number;                 // The OSM ID
    boundingbox: [string, string, string, string]; // Bounding box of the result (minLat, maxLat, minLon, maxLon)
    lat: string;                    // Latitude of the result
    lon: string;                    // Longitude of the result
    display_name: string;           // Full address or name
    class: string;                  // The class of the result (e.g., "place", "road", "building")
    type: string;                   // Type of place (e.g., "city", "village", etc.)
    importance: number;             // A score indicating the importance of the result
    address: {
        country?: string;             // Country
        country_code?: string;        // Country code
        state?: string;               // State/Province
        city?: string;                // City
        village?: string;             // Village
        road?: string;                // Road or street name
        postcode?: string;            // Postcode
    };
}

export type ForwardGeocodeResult = {
    place_id: number;               // Unique ID for the place
    licence: string;                // License information
    osm_type: string;               // The OSM type (e.g., node, way, relation)
    osm_id: number;                 // The OSM ID
    boundingbox: [string, string, string, string]; // Bounding box of the result (minLat, maxLat, minLon, maxLon)
    position: LatLng;               // Latitude and longitude of the result
    display_name: string;           // Full address or name
    class: string;                  // The class of the result (e.g., "place", "road", "building")
    type: string;                   // Type of place (e.g., "city", "village", etc.)
    importance: number;             // A score indicating the importance of the result
    address: {
        country?: string;             // Country
        country_code?: string;        // Country code
        state?: string;               // State/Province
        city?: string;                // City
        village?: string;             // Village
        road?: string;                // Road or street name
        postcode?: string;            // Postcode
    };
}




// logic/forwardGeocode.ts
export async function forwardGeocode(query: string, language = 'de'): Promise<ForwardGeocodeResult[] | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&accept-language=${language}&q=${encodeURIComponent(query)}`
        );
        const data = await response.json() as ForwardGeocodeRawResult[];

        if (data && data.length > 0) {
            return data.map((result: ForwardGeocodeRawResult) => {
                const { lat, lon, ...rest } = result;

                return {
                    ...rest,
                    position: new LatLng(parseFloat(lat), parseFloat(lon)),
                } as ForwardGeocodeResult;
            });
        } else {
            throw new Error("Location not found");
        }
    } catch (error) {
        console.error("Forward geocoding error:", error);
        return null;
    }
}
