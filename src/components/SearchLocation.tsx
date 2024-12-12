import React, { useEffect, useState } from 'react';
import { forwardGeocode, ForwardGeocodeResult } from '../logic/forwardGeocode';
import { List, ListInput, Card, CardContent } from 'framework7-react';
import { reverseGeocode, ReverseGeocodeResult } from '../logic/reverseGeocoding';
import { reverseGeocodeToCity } from '../logic/format';
import { LatLng } from 'leaflet';

export type ReverseLocation = ReverseGeocodeResult;

type SearchLocationProps = {
    setLocation: (location: LatLng) => void;
    setLocationReversed: (location: ReverseLocation | null) => void;
    location: LatLng | null;
    locationReverse: ReverseGeocodeResult | null;
    debounceDelay?: number;
}

function placeholderFormat(location: LatLng | null, locationReverse?: ReverseLocation | null): string {
    if (locationReverse) {
        const {
            address
        } = locationReverse;
        const {
            building,
            amenity,
            tourism,
            road,
            house_number,
            postcode,
            country
        } = address;
        const specialName = building ?? amenity ?? tourism;
        const group1 = `${specialName ? `${specialName}, ` : ''}${road ?? ''}${house_number ? ` ${house_number}` : ''}`;
        const city = reverseGeocodeToCity(locationReverse);
        return `${group1.length > 0 ? `${group1},` : ''}${postcode ? ` ${postcode}` : ''}${city ? ` ${city}` : ''}${country ? `, ${country}` : ''}`;
    } else if (location) {
        return `${location.lat}, ${location.lng}`;
    } else {
        return "Search location";
    }
}

const SearchLocation: React.FC<SearchLocationProps> = ({ locationReverse, location, setLocation, setLocationReversed, debounceDelay = 500 }) => {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<ForwardGeocodeResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                if (!location) return setLocationReversed(null);
                const usedLocation = location;

                setLocationReversed(null);
                const res = await reverseGeocode(location);

                // when location has changed while fetching, don't update the state
                if (location !== usedLocation) return;

                if (res) {
                    setLocationReversed({
                        ...res,
                    });
                } else {
                    setLocationReversed(null);
                }
            } catch (error) {
                console.error("Reverse geocoding error:", error);
                setLocationReversed(null);
            }
        }
        fetchData();
    }, [location, setLocationReversed]);


    // Fetch location suggestions with debounce
    useEffect(() => {
        if (query.trim().length > 2) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeoutId = setTimeout(async () => {
                const results = await forwardGeocode(query);
                setSuggestions(results || []);
            }, debounceDelay);

            setDebounceTimeout(timeoutId);
        } else {
            setSuggestions([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, debounceDelay]);

    const handleSelect = (pos: LatLng) => {
        setLocation(pos);
        setQuery("");
        setSuggestions([]);
    };

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <List style={{ margin: 0 }}>
                <ListInput
                    type="text"
                    value={query}
                    onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                    placeholder={placeholderFormat(location, locationReverse)}
                    clearButton
                />
            </List>

            {suggestions.length > 0 && (
                <Card
                    className="dropdown-card"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        zIndex: 1000,
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "rgba(40, 40, 40, 0.95)", // Solid dark background
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Shadow for separation
                        color: "#ffffff", // White text for Dark Mode
                    }}
                >
                    <CardContent style={{ padding: 0 }}>
                        <List style={{ margin: 0 }}>
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(suggestion.position)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        backgroundColor: index === selectedIndex ? "#555" : "transparent",
                                        color: "#ffffff",
                                    }}
                                >
                                    {suggestion.display_name}
                                </li>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchLocation;
