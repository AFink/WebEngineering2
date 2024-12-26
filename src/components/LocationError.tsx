import { useState } from 'react';
import { Popup, Page, Navbar, Block, Button } from 'framework7-react';

const LocationErrorPopup = ({ errorCode, retry }: { errorCode: number, retry: () => void }) => {
    const [popupOpened, setPopupOpened] = useState(true);

    const description = errorCode === 1 ? 'Permission denied' : errorCode === 2 ? 'Position unavailable' : errorCode === 3 ? 'Timeout' : 'Unknown error';
    const message = errorCode === 1 ? 'Please allow location access in your browser settings.' : errorCode === 2 ? 'Please check your location settings and try again.' : errorCode === 3 ? 'Please check your internet connection and try again.' : 'Please try again later.';

    return (
        <Popup opened={popupOpened} onPopupClosed={() => setPopupOpened(false)}>
            <Page>
                <Navbar title="Location Error" />
                <Block>
                    <p>There was an error getting your location: <b>{description}</b></p>
                    <p>{message}</p>

                    <p>You can still use the application, just enter your desired position into the search field. The default position is the Elbphilharmonie.</p>
                    <Button fill onClick={() => { retry(); setPopupOpened(false); }}>
                        Retry
                    </Button>
                    <Button outline popupClose className='mt-1'>
                        Close
                    </Button>
                </Block>
            </Page>
        </Popup>
    );
};

export default LocationErrorPopup;
