// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoibGl0dGxleHUiLCJhIjoiY2l3Yzl5dzE3MDAzNjJ5dW01cDQ3ajVocyJ9.ePXOQGL4SV7q6vxYv8mUBQ'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-73.918435,40.702564], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 12, // set the default zoom programatically
	style: 'mapbox://styles/littlexu/cjput8cjr0klv2sptxgwhpfts', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'NYC OpenData (https://opendata.cityofnewyork.us/)', // Custom text used to attribute data source(s)
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});


// Legend
var layers = [ // an array of the possible values you want to show in your legend

];

var colors = [ // an array of the color values for each legend item
    '#ef486f',
    '#da5dbd',
    '#f37794',
    '#ebf4ed',
    '#daece3',
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; // name of the current legend item, from the layers array
    var color =colors[i]; // color value of the current legend item, from the colors array 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 

    // map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

    //     var parks = map.queryRenderedFeatures(e.point, {    
    //         layers: ['cville-parks']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
    //     });
              
    //     if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

    //         $('#info-window-body').html('<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><img class="park-image" src="img/' + parks[0].properties.PARKNAME + '.jpg">');

    //     } else {    // what shows up in the info window if you are NOT hovering over a park

    //         $('#info-window-body').html('<p>Not hovering over a <strong>park</strong> right now.</p>');
            
    //     }

    // });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['cville-bus-stops']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stops.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(stops[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>Stop ID: ' + stops[0].properties.stop_id + '</h3><p>' + stops[0].properties.stop_name + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// 11.01 starts here----------------------------------------------

// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['Commercial Area', 'Commercial Area'],                      // layers[0]
        ['Cafe', 'Cafe'],                              // layers[1][1] = 'Parks'
        ['Public Space', 'Public Space'],     
        ['National Park', 'National Park'],
        ['Cemetery', 'Cemetery']
        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });


// CHANGE LAYER STYLE
// Refer to example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
    var swatches = $("#swatches");

    var colors = [  // an array of color options for the bus stop ponts
        '#ff4747',
        '#F06543',
        '#813C5F',
        '#443047'
    ]; 

    var layer = 'hotspot';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
        });

        $(swatches).append(swatch);
    });

// 11.08 starts here----------------------------------------------
// SCROLL TO ZOOM THROUGH SITES
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'darden-towe': {
            name: "La Esquina",
            description: "STAR PATRONS Kate Hudson, Julia Roberts, George Clooney THE SCOOP Celebrities flock to this Mexican eatery as much for the mystery as for the eats. V.I.P. patrons know to enter the street level taqueria and proceed through a dingy door marked Employees Only to reach the subterranean dining area, but just knowing how to get there isn't always enough-the restaurant operates on a strict reservations-only policy. WHAT TO ORDER Indulge in the Costillas de Puerco, a charred Chipotle-Guava Glazed Pork Spare Ribs with sweet plantains and escabeche, $21 .",
            imagepath: "img/La Esquina.jpg",
            bearing: 0,
            center: [ -73.997588, 40.721100],
            zoom: 16,
            pitch: 60
        },
        'mcguffey-park': {
            name: "'Empire Hotel Rooftop",
            description: "STAR PATRONS Kelly Ripa, Sean Combs, George Clooney THE SCOOP Nestled in between two N.Y.C. landmarks-the bustling Lincoln Center and the idyllic Central Park-this boutique hotel is the perfect base of operations for visiting culturehounds. After a gut renovation, the hotel now boasts a thoroughly modern decor and luxe amenities like teak showers and Frette linens. The rooftop bar is the perfect place to have a drink and take in the sweeping panoramas of the New York skyline. WHAT TO ORDER: Try the Kobe beef sliders, $16 or their millionaire deviled eggs with white truffle oil and gold leaf & caviar topping, $15.",
            imagepath: "img/Empire Hotel Rooftop.jpg",
            bearing: 0,
            center: [-73.982130, 40.771488],
            zoom: 18,
            pitch: 30
        },
        'mcintire-park': {
            name: "Butter",
            description: "STAR PATRONS Sarah Jessica Parker, Leighton Meester, Beyonce THE SCOOP On Monday nights, Butter sizzles with actors, models and musicians, but this East Village hangout is known as much for its impressive menu as it is for the celebrity clientele. Getting your foot in the door after-hours isn't easy, so book a table for dinner, take time to enjoy your entree and hang around for the late-night action. WHAT TO ORDER Try the Butter Raspberry Crush cocktail-a fruity blend of Belvedere Vodka, fresh raspberries, fresh lemon juice, syrup and soda, $14. Start dinner off with a Spring Pea Salad, $14. Popular entrees include a Grilled Florida Grouper, $26 and Roasted Hudson Valley Duck Breast, $27.",
            imagepath: "img/Butter.jpg",
            bearing: -8,
            center: [ -73.992345, 40.728520],
            zoom: 15,
            pitch: 50
        },
        'rivanna-river': {
            name: "The Yard at Soho Grand",
            description: "STAR PATRONS Ed Westwick, Kristen Dunst, Rachel Bilson, Liv Tyler, Helena Christensen, Susan Sarandon and Josh Harnett THE SCOOP This exclusive space is closed off to the public from 11AM to 4PM. For instant access, book a room at the hotel. Guests and VIPs can visit the sandstone-tiled courtyard for sunbathing, reading, or dining al fresco. From towels, to sun block, or a cool water mist spray, the cocktail servers in the Yard accommodate every request. Check out their savory menu filled with dishes like grilled swordfish skewers, king crab legs, lobster rolls and mini ice cream cones or key lime pie while sipping their Grand creations like the Grand Margarita and the Tartini. WHAT TO ORDER Order their tasty king crab legs, $22; and try their Butter Pimms Summer Punch, $65 (pitcher) and $16 (glass).",
            imagepath: "img/The Yard at Soho Grand.jpg",
            bearing: -50,
            center: [ -74.004653, 40.721320],
            zoom: 16.6,
            pitch: 54
        }
    };

    console.log(chapters['darden-towe']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h2>" + chapters[key]['name'] + "</h2><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }


// ADD GEOJSON DATA (static layers)

    // See example at https://www.mapbox.com/mapbox-gl-js/example/live-geojson/
    var staticUrl = 'https://opendata.arcgis.com/datasets/edaeb963c9464edeb14fea9c7f0135e3_11.geojson';
    map.on('load', function () {
        window.setInterval(function() { // window.setInterval allows you to repeat a task on a time interval. See https://www.w3schools.com/jsref/met_win_setinterval.asp
            console.log();
            map.getSource('polling-places').setData(staticUrl);
        }, 2000); // 2000 is in milliseconds, so every 2 seconds. Change this number as needed but be aware that more frequent requests will be more processor-intensive, expecially for large datasets.
        
        map.addSource('polling-places', { type: 'geojson', data: staticUrl });
        map.addLayer({
            "id": "polling-places",
            "type": "symbol",
            "source": "polling-places",
            "layout": {
                "icon-image": "embassy-15"
            }
        });
    });

