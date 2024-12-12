import {
    useEffect,
    useState,
} from 'react';

import SearchLocation, { ReverseLocation } from './components/SearchLocation';
import { App, BlockTitle, Link, Navbar, Page, Panel, View } from 'framework7-react';
import { LatLng } from 'leaflet';
import LocationMap from './components/Map';

function Main() {
    // use Elbphilharmonie as default location
    const [currentLocation, setCurrentLocation] = useState<LatLng>(new LatLng(53.5412, 9.984));

    const [startingLocation, setStartingLocation] = useState<LatLng>(currentLocation);
    const [startingLocationReversed, setStartingLocationReversed] = useState<ReverseLocation | null>(null);

    const [searchingLocation, setSearchingLocation] = useState<LatLng | null>(null);
    const [searchingLocationReversed, setSearchingLocationReversed] = useState<ReverseLocation | null>(null);

    // fetch current location and set as current and starting location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation(new LatLng(position.coords.latitude, position.coords.longitude));
                setStartingLocation(new LatLng(position.coords.latitude, position.coords.longitude));
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    return (
        <App theme="auto" name="Navigation PWA">
            <Panel left cover dark visibleBreakpoint={960}>
                <View>
                    <Page>
                        <Navbar title="Navigation" />
                        <BlockTitle style={{ marginBottom: "0.2rem", marginTop: "1rem" }}>Start</BlockTitle>
                        <SearchLocation locationReverse={startingLocationReversed} location={startingLocation} setLocation={setStartingLocation} setLocationReversed={setStartingLocationReversed} />
                        <BlockTitle style={{ marginBottom: "0.2rem", marginTop: "1rem" }}>Destination</BlockTitle>
                        <SearchLocation locationReverse={searchingLocationReversed} location={searchingLocation} setLocation={setSearchingLocation} setLocationReversed={setSearchingLocationReversed} />
                    </Page>
                </View>
            </Panel>
            <View main dark
                className='main-view'>
                <Navbar title="Navigation" className='hide-desktop'>
                    <Link slot="nav-left" iconF7="bars" panelOpen="left"></Link>
                </Navbar>
                <Page>
                    <LocationMap />
                </Page>
            </View>
        </App>
    );
}

export default Main;

