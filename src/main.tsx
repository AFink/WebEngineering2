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

// eslint-disable-next-line react-hooks/rules-of-hooks
Framework7.use(Framework7React);


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)