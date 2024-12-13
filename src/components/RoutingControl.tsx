import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

type RoutingMachineProps = {
    position?: string;
    start: L.LatLng;
    end: L.LatLng;
    color: string;
    setRoutes: (routes: L.Routing.IRoute[]) => void;
};

const createRoutineMachineLayer = ({ position, start, end, color, setRoutes }: RoutingMachineProps) => {
    const instance = L.Routing.control({
        // @ts-expect-error Internal property to place the control in the specified position
        position,
        collapseBtnClass: "d-hidden",
        waypoints: [start, end],
        draggableWaypoints: true,
        routeWhileDragging: true,
        reverseWaypoints: true,
        fitSelectedRoutes: true,
        lineOptions: {
            styles: [
                {
                    color,
                },
            ],
            extendToWaypoints: true,
            missingRouteTolerance: 2,
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createMarker: function (_waypointIndex: number, _waypoint: L.Routing.Waypoint, _numberOfWaypoints: number) {
            return false;
        },
    });

    instance.on("routesfound", (e: { routes: L.Routing.IRoute[] }) => {
        setRoutes(e.routes);
        console.log("Routes found:", e);
    });

    return instance;
};

//@ts-expect-error Properties do get passed into the component
const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;