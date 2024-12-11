import { App, BlockTitle, Link, Navbar, Page, Panel, View } from 'framework7-react';
import LocationMap from './components/Map';

function Main() {
    return (
        <App theme="auto" name="Navigation PWA">
            <Panel left cover dark visibleBreakpoint={960}>
                <View>
                    <Page>
                        <Navbar title="Navigation" />
                        <BlockTitle style={{ marginBottom: "0.2rem", marginTop: "1rem" }}>Start</BlockTitle>
                        <BlockTitle style={{ marginBottom: "0.2rem", marginTop: "1rem" }}>Destination</BlockTitle>
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

