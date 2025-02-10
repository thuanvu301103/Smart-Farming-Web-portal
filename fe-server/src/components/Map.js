import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import vnTopo from '../geoData/topoJSON.json';

const Map = () => {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const mapRef = useRef(null); // Store map instance

    useEffect(() => {
        if (!mapRef.current) return; // Ensure mapRef exists before using it
    }, []);


    // Function to handle province click
    const onProvinceClick = (e) => {
        const provinceName = e.target.feature.properties.name;
        setSelectedProvince(provinceName);
    };

    const defaultStyle = {
        color: '#ebdfe6',
        weight: 1,
        fillColor: '#CBA7BD',
        fillOpacity: 1,
    };

    const selectedStyle = {
        color: '#ebdfe6',
        weight: 1,
        fillColor: '#92D654',
        fillOpacity: 1,
    };

    const style = (feature) => {
        return feature.properties.name === selectedProvince ? selectedStyle : defaultStyle;
    };

    const onEachProvince = (features, layer) => {
        layer.on({ click: onProvinceClick });
        layer.bindTooltip(features.properties.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            opacity: 0.8,
            sticky: true,
        });
    };

    return (
        <MapContainer
            style={{ width: '100%', height: 650, borderRadius: '15px', overflow: 'hidden' }}
            center={selectedProvince ? null : [16.047079, 50.20623]} 
            zoom={5.4}
            whenCreated={(map) => {
                if (!mapRef.current) {
                    mapRef.current = map; // Assign only once
                }
            }}
            scrollWheelZoom={true}
        >
            <GeoJSON data={vnTopo.features} style={style} onEachFeature={onEachProvince} />
            <Popup key="Hoang Sa Island" position={[16.668011, 109.939995]} autoClose={false}>
                Hoàng Sa
            </Popup>
            <Popup key="Truong Sa Island" position={[10.487044, 113.250166]} autoClose={false}>
                Trường Sa
            </Popup>
        </MapContainer>
    );
};

export default Map;
