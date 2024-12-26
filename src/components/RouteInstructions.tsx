import { useContext, useState } from 'react';
import { Context } from './context';
import { Card, CardHeader, CardContent, List, ListItem, Badge, Icon, Tabs, Tab, Toolbar, Link } from 'framework7-react';
import { Routing } from 'leaflet';

type RouteInstructionsProps = {
    routes: Routing.IRoute[];
};

function RouteInstructions({ routes }: RouteInstructionsProps) {
    const context = useContext(Context);
    const { map, router } = context || {};

    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

    function formatDistance(distance?: number) {
        if (distance === undefined) return "";
        return distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance} m`;
    }

    function formatTime(time?: number) {
        if (time === undefined) return "";
        return time >= 3600 ? `${Math.floor(time / 3600)} h ${Math.round((time % 3600) / 60)} min` : `${Math.round(time / 60)} min`;
    }

    function onClick(e: React.MouseEvent<HTMLButtonElement>, route: Routing.IRoute, instruction: Routing.IInstruction) {
        e.preventDefault();
        if (map && route.coordinates) {
            // @ts-expect-error Internal property
            map.panTo(route.coordinates[instruction.index]);
        }
    }

    function selectRoute(e: React.MouseEvent<HTMLButtonElement>, routeIndex: number) {
        e.preventDefault();
        if (map && router) {
            const route = routes[routeIndex];
            //@ts-expect-error Internal event
            router.fire('routeselected', { route });
            setSelectedRouteIndex(routeIndex);
        }
    }

    // Framework7 icon selection based on instruction
    const getF7IconForInstruction = (instruction: Routing.IInstruction) => {
        switch (instruction.type as Routing.IInstruction["type"] & "Head") {
            case "Head":
                return "location";
            case "DestinationReached":
            case "WaypointReached":
                return "flag";
            case "Roundabout":
                return "arrow_counterclockwise";
            case "Right":
                return "arrow_right";
            case "Left":
                return "arrow_left";
            case "SharpRight":
            case "SharpLeft":
            case "TurnAround":
                return "arrow_uturn_down";
            case "Straight":
                return "arrow_up";
            case "SlightRight":
                return "arrow_up_right";
            case "SlightLeft":
                return "arrow_up_left";
            default:
                return "arrow_forward";
        }
    };

    return (
        <div>
            <Toolbar top tabbar className='top-0 mt-1'>
                {routes.map((_route: Routing.IRoute, routeIndex: number) => (
                    <Link key={routeIndex} tabLink={`#tab-${routeIndex + 1}`} tabLinkActive={routeIndex == selectedRouteIndex}
                        onClick={(e) => selectRoute(e, routeIndex)}
                    >Route {routeIndex + 1}</Link>
                ))}
            </Toolbar>
            <Tabs>
                {routes.map((route: Routing.IRoute, routeIndex: number) => (
                    <Tab key={routeIndex} id="tab-1" className="page-content pt-0" tabActive={routeIndex == selectedRouteIndex} >
                        <Card key={routeIndex} className="route-card">
                            <CardHeader className="route-header">
                                <div className="div">
                                    <span className="route-title">Route {routeIndex + 1}</span>
                                    <div>
                                        <Badge color="blue">{formatDistance(route.summary?.totalDistance)}</Badge> &nbsp;
                                        <Badge color="green">{formatTime(route.summary?.totalTime)}</Badge>

                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>

                                <List>
                                    {route.instructions?.map((instruction, instructionIndex) => (
                                        <ListItem
                                            key={instructionIndex}
                                            link="#"
                                            className="instruction-item"
                                            onClick={(e) => onClick(e, route, instruction)}
                                            title={instruction.text}
                                            after={`${formatDistance(instruction.distance)}`}
                                        >
                                            <Icon f7={getF7IconForInstruction(instruction)} slot='media' />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}

export default RouteInstructions;
