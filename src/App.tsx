import {
    useEffect,
    useState,
} from 'react';

import Map from './components/Map';
import SearchLocation, { ReverseLocation } from './components/SearchLocation';
import RouteInstructions from './components/RouteInstructions';
import { App, Link, Navbar, Page, Panel, View } from 'framework7-react';
import NetworkStatusPopup from './components/Offline';
import { LatLng, Routing } from 'leaflet';
import LocationErrorPopup from './components/LocationError';

function Main() {
    const [routes, setRoutes] = useState<Routing.IRoute[] | null>(null);

    const [userLanguage, setUserLanguage] = useState<string>('de');

    // use Elbphilharmonie as default location
    const [currentLocation, setCurrentLocation] = useState<LatLng>(new LatLng(53.5412, 9.984));
    const [locationError, setLocationError] = useState<number | null>(null);

    const [startingLocation, setStartingLocation] = useState<LatLng>(currentLocation);
    const [startingLocationReversed, setStartingLocationReversed] = useState<ReverseLocation | null>(null);

    const [searchingLocation, setSearchingLocation] = useState<LatLng | null>(null);
    const [searchingLocationReversed, setSearchingLocationReversed] = useState<ReverseLocation | null>(null);


    // get user's preferred language from browser
    useEffect(() => {
        const language = navigator.language || 'en';
        setUserLanguage(language.split('-')[0]);
    }, [setUserLanguage]);

    function getLocation() {
        setLocationError(null);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation(new LatLng(position.coords.latitude, position.coords.longitude));
            }, (error) => {
                setLocationError(error.code);
            });
        } else {
            setLocationError(4);
        }
    }

    // fetch current location and set as current and starting location
    useEffect(() => {
        getLocation();
    }, []);

    return (
        <App theme="auto" name="Navigation PWA">
            <NetworkStatusPopup />
            {locationError && <LocationErrorPopup errorCode={locationError} retry={getLocation} />}
            <Panel left cover dark visibleBreakpoint={960}>
                <View>
                    <Page>
                        <Navbar title="Navigation" />
                        <Navbar title="Navigation" className='hide-desktop'>
                            <Link slot="nav-left" iconF7="xmark" panelClose="left" />
                        </Navbar>
                        <SearchLocation title="Start" userLanguage={userLanguage} defaultLocation={currentLocation} locationReverse={startingLocationReversed} location={startingLocation} setLocation={setStartingLocation} setLocationReversed={setStartingLocationReversed} />
                        <SearchLocation title="Destination" userLanguage={userLanguage} defaultLocation={currentLocation} locationReverse={searchingLocationReversed} location={searchingLocation} setLocation={setSearchingLocation} setLocationReversed={setSearchingLocationReversed} />
                        {routes && <RouteInstructions routes={routes} />}
                    </Page>
                </View>
            </Panel>
            <View main dark
                className='main-view'>
                <Navbar title="Navigation" className='hide-desktop'>
                    <Link slot="nav-left" iconF7="bars" panelOpen="left"></Link>
                </Navbar>
                <Page>
                    <Map setRoutes={setRoutes} setSearchingLocation={setSearchingLocation} setStartingLocation={setStartingLocation} startingLocation={startingLocation} startingLocationReversed={startingLocationReversed} searchingLocation={searchingLocation} searchingLocationReversed={searchingLocationReversed} />
                </Page>
            </View>
        </App>
    );
}

export default Main;

