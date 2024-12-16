import { useMemo, useRef } from "react"
import { Marker, Popup } from "react-leaflet"
import { reverseGeocodeToCity } from "../logic/format"
import { LatLng, Marker as MarkerType } from "leaflet"
import { WikipediaResult } from "../logic/wikipediaSearch"
import { ReverseLocation } from "./SearchLocation"

type DraggableMarkerProps = {
    location: LatLng;
    setLocation: (location: LatLng) => void;
    locationReversed: ReverseLocation | null;
};

export function DraggableMarker({ location, setLocation, locationReversed }: DraggableMarkerProps) {
    const markerRef = useRef<MarkerType>(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setLocation(marker.getLatLng())
                }
            },
        }),
        [setLocation],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={location}
            ref={markerRef}>
            <Popup minWidth={90}>
                {(!locationReversed || locationReversed == null) && <div>Loading data...</div>}

                {locationReversed && (
                    <div>
                        <h1>{reverseGeocodeToCity(locationReversed)}</h1>
                        <p>{locationReversed.address.road}{locationReversed.address.house_number ? ` ${locationReversed.address.house_number}` : ''}, {locationReversed.address.postcode} {reverseGeocodeToCity(locationReversed)}, {locationReversed.address.country}</p>
                        {locationReversed.wiki && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {locationReversed.wiki.map((result: WikipediaResult, i: number) => (
                                    <div key={i}>
                                        <a className="link external" href={result.url} target="_blank" rel="noreferrer">{result.title}</a>
                                        <div dangerouslySetInnerHTML={{ __html: `${result.snippet}…` }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Popup>
        </Marker>
    )
}