import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Framework7 from "framework7/lite-bundle";
import Framework7React from "framework7-react";
//@ts-ignore
import 'framework7-icons';
//@ts-ignore
import 'framework7/css/bundle';
import './index.css'
import App from "./App";
import Provider from './components/Provider';
import { registerSW } from "virtual:pwa-register";

// eslint-disable-next-line react-hooks/rules-of-hooks
Framework7.use(Framework7React);


// add this to prompt for a refresh
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <App />
        </Provider>
    </StrictMode>,
)