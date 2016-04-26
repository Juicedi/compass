(function () {
    'use strict';

    var database = {
        start: {},
        end: {}
    };

    // gets starting location coordinates
    function getStartLocation(whichButton) {
        var yourLocation = {};
        
        if (whichButton === 1) {
            yourLocation = {
                lat: 60.2182261,
                lng: 24.811528
            };
        } else if (whichButton === 2) {
            yourLocation = {
                lat: 31.2246325,
                lng: 121.1965702,
            };
        }
        database.start = yourLocation;
    }

    // gets location coordinates by httpRequest from google geoCode API
    function getEndLocation(callback) {
        var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDUTG34LGXSXBAY-trPXT6z3F_g1h05iYk&address=helsinki';
        var httpRequest = new XMLHttpRequest();
        // when the request is loaded
        httpRequest.onload = function () {
            // we're calling our method
            var response = JSON.parse(httpRequest.response).results[0].geometry.location;
            database.end = response;
            callback();
        };
        httpRequest.open('GET', apiRequest);
        httpRequest.send();
    }

    /**
     * when the request is ready
     * this will handle the data
     */
    function getDirection() {
        var endCoordinates = database.end;
        var startCoordinates = database.start;

        var latDifference = endCoordinates.lat - startCoordinates.lat;
        var lngDifference = endCoordinates.lng - startCoordinates.lng;

        var division = latDifference / lngDifference;
        var rad2deg = 180 / Math.PI;
        var degrees = Math.atan(division) * rad2deg;
        
        if (endCoordinates.lng < startCoordinates.lng) {
            degrees = degrees + 180;
        }

        // invert the degrees, so positive degrees grow counter clockwise
        degrees = degrees - degrees * 2;
        
        showCompass(degrees);
    }

    // shows results in html
    function showCompass(degrees) {
        // console.log(degrees);
        $('#arrow').rotate(degrees);
    }

    function initButtons() {
        $('.hidden').removeClass('hidden');
        $('#sello').on('click', function () {
            getStartLocation(1);
            getDirection();
        });
        $('#shanghai').on('click', function () {
            getStartLocation(2);
            getDirection();
        });
    }
    
    getEndLocation(initButtons);
})();