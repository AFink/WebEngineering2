# Web Engineering 2 - React Navigation

In diesem Repository befindet sich unser Projekt für die Web Engineering 2 Vorlesung.

## Aufgabenstellung

Entwickeln Sie eine Web-Applikation die innerhalb eines Location-Based-Service eine Karte darstellt.
Innerhalb der Karte soll eine Position (oder aktueller Standort) mit ihren Geo-Koordinaten ausgewählt
werden können. Über diese Koordinaten soll mittels Reverse-Geocoding der Ort ermittelt und über
Wikipedia die entsprechenden Information zur Örtlichkeit ausgelesen und visualisiert werden

Anschließend soll die Fahrroute von der gegenwärtigen Position zum ausgewählten Ort dargestellt
werden

## Installation

1. Repository klonen
2. `npm install` ausführen
3. `npm run dev` ausführen

Die Anwendung wird nun unter [https://localhost:5173/](https://localhost:5173/) ausgeführt.

**Hinweis:** Da das Projekt eine PWA bereitstellt, muss der Zugriff über HTTPS erfolgen. Beim ersten Start erzeugt Vite ein Zertifikat, wozu gegebenenfalls das Passwort des Benutzers oder des Administrators benötigt wird. Da es sich um ein selbstsigniertes Zertifikat handelt, muss beim Aufruf der Seite im Browser eine Warnung bestätigt werden.

## Verwendete Technologien

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Framework7](https://framework7.io/react/)
- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)

## Teammitglieder

- Andreas Fink
- Naila Ihle
- Silas Burgmaier
- Ben Felber
- Fabian Kast
- Torben Frühauf
- Uli Gapp
