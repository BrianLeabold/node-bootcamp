/* eslint-disable */

export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc3VsdGJyaWFuIiwiYSI6ImNrNHJhN2dlaTJ4YTgzb3FzbnpwY2JmemsifQ.enQPEMHI-MX0XhqknOoVBg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/consultbrian/ck4rbces61q0l1cmr330nqd71',
        // Useage Options
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 9,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker for each location
        const el = document.createElement('div');
        el.className = 'marker';
        //Add markers
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
        // Extend boundaries of the map to include locations
        bounds.extend(loc.coordinates);
        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};

