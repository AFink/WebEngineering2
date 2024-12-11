import React, { useState, useMemo, ReactNode } from "react";
import { Context } from "./context";
import { Control, Map } from "leaflet";

export type MapContext = {
    map: Map | null;
    setMap: React.Dispatch<React.SetStateAction<null>>;

    router: Control | null;
    setRouter: React.Dispatch<React.SetStateAction<null>>;
}

const Provider = ({ children }: { children: ReactNode }) => {
    const [map, setMap] = useState(null);
    const mapProvider = useMemo(() => ({ map, setMap }), [map, setMap]);

    const [router, setRouter] = useState(null);
    const routerProvider = useMemo(() => ({ router, setRouter }), [router, setRouter]);

    return (
        <Context.Provider value={{ ...mapProvider, ...routerProvider }}>{children}</Context.Provider>
    );
};

export default Provider;
