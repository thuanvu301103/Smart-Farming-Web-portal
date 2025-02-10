import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import vnTopo from '../geoData/topoJSON.json';

const Map = () => {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const mapRef = useRef(null); // Store map instance

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            .leaflet-container:focus,
            .leaflet-interactive:focus {
                outline: none !important;
            }
        `;
        document.head.appendChild(style);
    }, []);

    const onProvinceClick = (e) => {

        // Get the province's center
        const bounds = e.target.getBounds();
        const center = bounds.getCenter();

        console.log("New Center:", center.lat, center.lng);
        console.log("Current Zoom Level:", mapRef.current?.getZoom());

        const provinceName = e.target.feature.properties.name;
        setSelectedProvince(provinceName);

        // Move the map smoothly
        if (mapRef.current) {
            mapRef.current.flyTo([center.lat, center.lng], mapRef.current.getZoom());
        }

        console.log("Selected Province:", provinceName);
        console.log("New Center:", center.lat, center.lng);
        console.log("Current Zoom Level:", mapRef.current?.getZoom());
    };

    const defaultStyle = { color: '#ebdfe6', weight: 1, fillColor: '#CBA7BD', fillOpacity: 1 };
    const selectedStyle = { color: '#ebdfe6', weight: 1, fillColor: '#92D654', fillOpacity: 1, dashArray: '5, 5' };

    const style = (feature) => (feature.properties.name === selectedProvince ? selectedStyle : defaultStyle);

    const onEachProvince = (features, layer) => {
        layer.on({ click: onProvinceClick });
        layer.bindTooltip(features.properties.name, { permanent: false, direction: 'top', offset: [0, -10], opacity: 0.8, sticky: true });
    };

    return (
        <MapContainer
            style={{ width: '100%', height: 500, borderRadius: '15px', overflow: 'hidden' }}
            center={[16.047079, 108.20623]}
            zoom={5.4}
            minZoom={5}
            maxZoom={8}
            scrollWheelZoom={true}
            whenCreated={(map) => {
                mapRef.current = map;
            }}
        >
            <GeoJSON data={vnTopo.features} style={style} onEachFeature={onEachProvince} />
            {/*<Popup key="Hoang Sa Island" position={[16.668011, 109.939995]} autoClose={false}>Hoàng Sa</Popup>
            <Popup key="Truong Sa Island" position={[10.487044, 113.250166]} autoClose={false}>Trường Sa</Popup>*/}
        </MapContainer>
    );
};

export default Map;
