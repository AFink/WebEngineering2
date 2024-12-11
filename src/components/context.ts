import { createContext } from "react";
import { MapContext } from "./Provider";

export const Context = createContext<MapContext | null>(null);
