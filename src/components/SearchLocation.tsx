import React, { useEffect, useState } from 'react';
import { forwardGeocode, ForwardGeocodeResult } from '../logic/forwardGeocode';
import { List, ListInput, Card, CardContent, BlockTitle } from 'framework7-react';
import { WikipediaResult, wikipediaSearch } from '../logic/wikipediaSearch';
import { reverseGeocode, ReverseGeocodeResult } from '../logic/reverseGeocoding';
import { reverseGeocodeToCity } from '../logic/format';
import { LatLng } from 'leaflet';

export type ReverseLocation = ReverseGeocodeResult & {
    wiki?: WikipediaResult[];
};

type SearchLocationProps = {
    setLocation: (location: LatLng) => void;
    setLocationReversed: (location: ReverseLocation | null) => void;
    title: string;
    defaultLocation?: LatLng | null;
    location: LatLng | null;
    locationReverse: ReverseGeocodeResult | null;
    debounceDelay?: number;
    userLanguage: string;
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

const SearchLocation: React.FC<SearchLocationProps> = ({ title, userLanguage, locationReverse, defaultLocation, location, setLocation, setLocationReversed, debounceDelay = 500 }) => {
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
                const res = await reverseGeocode(location, userLanguage);

                // when location has changed while fetching, don't update the state
                if (location !== usedLocation) return;

                if (res) {
                    const wiki = await wikipediaSearch(reverseGeocodeToCity(res), userLanguage);

                    // when location has changed while fetching, don't update the state
                    if (location !== usedLocation) return;

                    setLocationReversed({
                        ...res,
                        wiki,
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
    }, [location, setLocationReversed, userLanguage]);


    // Fetch location suggestions with debounce
    useEffect(() => {
        if (query.trim().length > 2) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeoutId = setTimeout(async () => {
                const results = await forwardGeocode(query, userLanguage);
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
        <div className='relative w-100'>
            <BlockTitle>{title}
                {defaultLocation && (
                    <a className='small' onClick={() => setLocation(defaultLocation)}> (Set to current location)</a>
                )}
            </BlockTitle>

            <List className='m-0'>
                <ListInput
                    type="text"
                    value={query}
                    onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                    placeholder={placeholderFormat(location, locationReverse)}
                    clearButton
                />
            </List>

            {
                suggestions.length > 0 && (
                    <Card className="dropdown-card" >
                        <CardContent>
                            <List className='m-0'>
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelect(suggestion.position)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`dropdown-item ${selectedIndex === index ? 'selected' : ''}`}
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    );
};

export default SearchLocation;
