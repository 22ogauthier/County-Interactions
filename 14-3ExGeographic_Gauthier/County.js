/** County.js ************
 * Olivia Gauthier
 * IGME-102: 14-3ex Geographic sample, 12/1/23
 * Load 2 states' county data and viz their locations
 * County: name, id, and location data for
 * one US county.
 * County.getDist: get distance between 2 counties
 */
class County {
    /**
     * constructor: load identifying and location
     * properties of a county
     * @param {[string]} fields, array of county data
     */
    constructor(fields) {
        //console.log(fields);
        //fields has [USPS*	GEOID*	ANSICODE	NAME*	ALAND
        //	AWATER	ALAND_SQMI	AWATER_SQMI
        //INTPTLAT*  INTPTLONG*]
        //set the * items as properties
        [this.state, this.id, , this.name, , , , , this.lat, this.lon] = fields;
        console.log(this);
    }

    display() {
        fill(100, 130);
        ellipse(this.x, this.y, 8);
    }

    /**
     * getDistance: return distance
     * in miles between 2 counties
     * ref:
     * http://powerappsguide.com/blog/post/formulas-calculate-the-distance-between-2-points-longitude-latitude
     * @param {County} start 
     * @param {County} dest 
     * @returns {number}
     */
    static getDistance(start, dest) {
        //Exit if start or dest are undefined 
        if (!start || !dest) {
            return;
        }

        /* equation from PowerApps blog:
        lat1 = 
        lon1 = 
        lat2 = 
        lon2 = 
        r = 6371 #radius of Earth (KM)
        p = 0.017453292519943295  #Pi/180
        a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2

        d = 2 * r * asin(sqrt(a)) #2*R*asin
        */
        let r = 3959; //miles, not km
        let lat1 = start.lat;
        let lon1 = start.lon;
        let lat2 = dest.lat;
        let lon2 = dest.lon;
        let p = PI / 180;

        let a = 0.5 - cos((lat2 - lat1) * p) / 2 +
            cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2;

        let distance = 2 * r * asin(sqrt(a));
        return distance;
    }

    /**
     * getBearing: get bearing angle from 1 county to a 2nd county
     * @param {County} start starting county
     * @param {County} dest destination county
     * @returns {number} 
     */
    static getBearing(start, dest) {
        //Exit if start or dest are undefined 
        if (!start || !dest) {
            return;
        }

        let x = cos(dest.lat) * sin(dest.lon - start.lon);
        let y = cos(start.lat) * sin(dest.lat) - (sin(start.lat) * cos(dest.lat) * cos (dest.lon - start.lon));
        let bearing = atan2(x, y);

        return bearing;
    }

    /**
     * mouseWithin: returns whether the mouse is within this's radius
     * @returns {boolean} true if within
     */
    mouseWithin() {
        return dist(this.x, this.y, mouseX, mouseY) <= 4;
    }
}