/** reittiä varten
* https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyDUTG34LGXSXBAY-trPXT6z3F_g1h05iYk&origin=60.2182261,24.81152&destination=60.1711124,24.9417507&mode=walking
*/
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
     * When the request is ready,
     * this will handle the data and show in what direction is the end point
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

    function calculateDistance() {
        
        var lat1 = 60.2182348;
        var lon1 = 24.8107336;
        
        var lat2 = 60.2176518;
        var lon2 = 24.8106959;
        
        // Converts numeric degrees to radians
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }
        
        //The haversine formula calculates the distance between two coordinates 
        var R = 6371000; // km 
        //has a problem with the .toRad() method below.
        var x1 = lat2 - lat1;
        var dLat = x1.toRad();
        var x2 = lon2 - lon1;
        var dLon = x2.toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        console.log(d + 'm');
    }
    calculateDistance();

    getEndLocation(initButtons);
})();