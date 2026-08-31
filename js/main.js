(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });

    /**
     * Preloader
     */
    let preloader = select('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove()
        });
    }

    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        })
    });

    $(document).ready(function() {

        let mapOptions = {
            zoomControl: true,
            center: [53.647916892862995, 14.555429150925999],
            zoom: 8.2
        };

        var map = L.map('kaart', mapOptions);

        /**
         * Basemaps
         */
        var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 20,
            minZoom: 8,
        }).addTo(map);

        var Openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            minZoom: 8,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            maxZoom: 20,
            minZoom: 8,
        }).addTo(map);

        /**
         * Layers
         */

        var geschiktheidskaart = L.tileLayer.wms('http://localhost:8080/geoserver/Natgeo/wms', {
            layers: 'geschikt',
            format: 'image/png',
            transparent: true,


        });
        map.addLayer(geschiktheidskaart);

        var deelgebieden = L.tileLayer.wms('http://localhost:8080/geoserver/Natgeo/wms', {
            layers: 'deelgebieden',
            format: 'image/png',
            transparent: true,

        });
        map.addLayer(deelgebieden);

        // var agriculture = L.tileLayer.wms('https://gmd.has.nl/geoserver/nageo_2122_540287180/wms', {
        //     layers: 'agriculture(1)',
        //     format: 'image/png',
        //     transparent: true,
        //     opacity: 0.5,
        // });

        // var industry = L.tileLayer.wms('https://gmd.has.nl/geoserver/nageo_2122_540287180/wms', {
        //     layers: 'industry',
        //     format: 'image/png',
        //     transparent: true,
        //     opacity: 0.5,
        // });

        // var tourism = L.tileLayer.wms('https://gmd.has.nl/geoserver/nageo_2122_540287180/wms', {
        //     layers: 'tourism',
        //     format: 'image/png',
        //     transparent: true,
        //     opacity: 0.5,
        // });

        /**
         * layer switcher
         */

        var baseMaps = {
            "Satelliet kaart": Esri_WorldImagery,
            "Openstreetmap": Openstreetmap,
            "Grijze canvas": Esri_WorldGrayCanvas
        };

        var overlayMaps = {
            "geschiktheidskaart": geschiktheidskaart,
            "deelgebieden": deelgebieden,
            "agriculture": agriculture,
            "industry": industry,
            "tourism": tourism
        };
        L.control.layers(baseMaps, overlayMaps).addTo(map);

        changeMap();

    });

    // map.on('overlayadd', function(layer) {
    //     if (layer.name == "geschiktheidskaart") {
    //         $('#legenda').show()
    //     }
    // })

    // map.on('overlayremove', function(layer) {
    //     if (layer.name == "geschiktheidskaart") {
    //         $('#legenda').hide();
    //     }
    // })

    // map.on('overlayadd', function(layer) {
    //     if (layer.name == "deelgebieden") {
    //         $('#legenda2').show()
    //     }
    // })

    // map.on('overlayremove', function(layer) {
    //     if (layer.name == "deelgebieden") {
    //         $('#legenda2').hide();
    //     }
    // })


    // map.on('overlayadd', function(layer) {
    //     if (layer.name == "industry") {
    //         $('#legenda3').show()
    //     }
    // })

    // map.on('overlayremove', function(layer) {
    //     if (layer.name == "industry") {
    //         $('#legenda3').hide();
    //     }
    // })

    // map.on('overlayadd', function(layer) {
    //     if (layer.name == "agriculture") {
    //         $('#legenda4').show()
    //     }
    // })

    // map.on('overlayremove', function(layer) {
    //     if (layer.name == "agriculture") {
    //         $('#legenda4').hide();
    //     }
    // })

    // map.on('overlayadd', function(layer) {
    //     if (layer.name == "tourism") {
    //         $('#legenda5').show()
    //     }
    // })

    // map.on('overlayremove', function(layer) {
    //     if (layer.name == "tourism") {
    //         $('#legenda5').hide();
    //     }
    // })

    // add to map
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    changeMap();

})();
