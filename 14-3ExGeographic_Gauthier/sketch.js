/** sketch.js *************
* Olivia Gauthier
* IGME-102: 14-3ex Geographic sample, 12/1/23
* Load 2 states' county data and viz their locations
* NJ & MA for me
UX: when a user clicks on 2 counties in succession, show bearing and sitance information about their path
*/

"use strict"; //catch some common coding errors

/* Global variables */
//store County instances
const counties = [];

//store up to 2 counties to show path info for 
const path = []

/**
 * setup :
 */
function setup() {
   createCanvas(700, 640);
   noStroke();
   angleMode(DEGREES);

   loadStrings("media/2023_Gaz_counties_national.txt", loadCounties);
}

/**
 * mouseClicked: if clicked on a county, add it to the path, and show path information
 */
function mouseClicked() {
   const clickedCounty = counties.find(county => {
      return county.mouseWithin();
   })
   console.log("clicked?", clickedCounty);
   if (clickedCounty) {
      //add new county to the path
      path.push(clickedCounty);

      //shift out oldest county if 3 counties now 
      if (path.length > 2) {
         path.shift();
      }

      //show viz and the path information
      showViz();
      showPathInfo(...path);
   }
}

/**
 * loadCounties: load raw text data into
 * county instances in an array
 * @param {[string]} rawCounties 
 */
function loadCounties(rawCounties) {
   console.log(rawCounties.length);
   //iterate looking for PA or VA counties
   rawCounties.forEach(line => {
      const fields = line.split("\t");
      if (fields[0] === "NJ" || fields[0] === "MA") {
         //add this county to the collection
         counties.push(new County(fields));
      }
   });

   //set the x and y properties of the counties
   setXYs();

   //show alll the counties
   showViz();
}

/**
 * setXYs: set .x, .y properties
 * for counties based on their lat,lon
 * to distibute safely within canvas
 */
function setXYs() {
   //Starting values for lat,lon ranges
   //extremely opposite actual values:
   let minLat = 100;
   let maxLat = -100;
   let minLon = 100;
   let maxLon = -100;

   //calc min latitude
   minLat = counties.reduce((smallest, county) => {
      return min(smallest, county.lat);
   }, minLat);
   console.log("minLat", minLat);
   //calc max latitude
   maxLat = counties.reduce((biggest, county) => {
      return max(biggest, county.lat);
   }, maxLat);
   console.log("maxLat", maxLat);
   //calc min longitude
   minLon = counties.reduce((smallest, county) => {
      return min(smallest, county.lon);
   }, minLon);
   console.log("minLon", minLon);
   //calc max longitude
   maxLon = counties.reduce((biggest, county) => {
      return max(biggest, county.lon);
   }, maxLon);
   console.log("maxLon", maxLon);

   //set .x .y based on min/max lat-lons:
   counties.forEach(county => {
      county.y = map(county.lat, maxLat, minLat,
         50, height - 50);
      county.x = map(county.lon, maxLon, minLon,
         100, width - 100);
   });
}

/**
 * showViz: display all the counties
 */
function showViz() {
   background("beige");
   //show alll the counties
   counties.forEach(county => {
      county.display();
   });
}

/**
 * showPathInfo: show distance and bearing info on canvas for start -> destination counties
 * @param {County} start starting county
 * @param {County} dest destination county
 */
function showPathInfo(start, dest) {
   //Exit if start or dest are undefined 
   if (!start || !dest) {
      return;
   }

   const distance = round(County.getDistance(start, dest));
   const bearing = round(County.getBearing(start, dest));

   textSize(24);
   fill(0);
   let str = "Actual distance is " + distance + " mi";
   str += "\nBearing is " + bearing + "°";
   text(str, 300, 450);

   //highlight start and destination counties
   textSize(16);
   fill(0, 100, 0); // dark green
   text(start.name, start.x, start.y);
   fill(0, 255, 0, 200); //green
   ellipse(start.x, start.y, 7);

   fill(100, 0, 0); // dark red
   text(dest.name, dest.x, dest.y);
   fill(255, 0, 0, 180); //red
   ellipse(dest.x, dest.y, 7);
}