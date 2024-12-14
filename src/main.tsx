import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Framework7 from "framework7/lite-bundle";
import Framework7React from "framework7-react";
//@ts-ignore
import 'framework7-icons';
//@ts-ignore
import 'framework7/css/bundle';
import App from "./App";
import Provider from './components/Provider';

// eslint-disable-next-line react-hooks/rules-of-hooks
Framework7.use(Framework7React);


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <App />
        </Provider>
    </StrictMode>,
)