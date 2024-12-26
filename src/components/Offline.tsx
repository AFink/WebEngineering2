import { useState, useEffect } from 'react';
import { Popup, Page, Navbar, Block, Button } from 'framework7-react';

const NetworkStatusPopup = () => {
    const [popupOpened, setPopupOpened] = useState(false);
    const [isOnline, setIsOnline] = useState<boolean>(true);

    const showPopup = (currentState: boolean) => {
        setIsOnline(currentState);
        setPopupOpened(true);
    };

    useEffect(() => {
        // Check initial status and show popup if offline
        if (!navigator.onLine) {
            showPopup(false);
        }

        // Add event listeners for online/offline events
        const handleOnline = () => showPopup(true);
        const handleOffline = () => showPopup(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <Popup opened={popupOpened} onPopupClosed={() => setPopupOpened(false)}>
            <Page>
                <Navbar title="Network Status" />
                <Block>
                    {isOnline ? (<p>You are <b>online</b> again!</p>) : (<><p>You are currently <b>offline</b>!</p> <p>Some features like:</p>
                        <ul>
                            <li>Leaflet map display</li>
                            <li>Routing and navigation</li>
                            <li>Geocoding searches</li>
                        </ul>
                        <p>may not work until you are back online.</p></>)}
                    <Button fill popupClose className='mt-auto'>
                        Close
                    </Button>
                </Block>
            </Page>
        </Popup>
    );
};

export default NetworkStatusPopup;
