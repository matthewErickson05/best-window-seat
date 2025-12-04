import {landmarks} from "./landmarks.js";
/**
 * Finds the visible landmarks
 * @param {*} coordinates [heading, lat, long, alt]
 */

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const toRadians = angle => angle * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}


function detectAtWayPoint(coordinates, leftSeen, rightSeen, leftSeenIds, rightSeenIds) {
    const heading = coordinates[4];
    const lat = coordinates[1];
    const long = coordinates[2];
    const altitude = coordinates[3];

    //Calculate visible range based on altitude
    // horizon distance = sqrt(1.75*altitude)
    // horizon distance in miles, altitude in feet
    // lets say "visibility" is one third of the way to the horizon in miles
    var visibility = Math.sqrt((1.75*altitude)) / 3;

    //Add landmarks within visible range
    //Calculate visibility score (cities at low altitude is easier to see than cities at high)
    
    landmarks.forEach(landmark => {
        let distance = calculateDistance(lat, long, landmark.lat, landmark.lon);
        //Calculate distance from plane to landmark in miles

        if (distance < visibility) {
            //distance calculation
            const dx = long - landmark.lon;
            const dy = lat - landmark.lat;
    
            // Direction AT B, pointing toward A (BA). This is the line's direction "touching" B.
            let ux = -dx, uy = -dy;
            const len = Math.hypot(ux, uy);
            if (len !== 0) {
                ux /= len; uy /= len;
        
                // Heading vector: 0° = North (+y), increases clockwise → [sin θ, cos θ]
                const r = heading * Math.PI / 180;
                const hx = Math.sin(r), hy = Math.cos(r);
        
                // Signed angle from heading → BA. Use -cross to make clockwise positive.
                const dot = hx*ux + hy*uy;
                const cross = hx*uy - hy*ux;
                const angle = (Math.atan2(-cross, dot) * 180 / Math.PI + 360) % 360;
        
                // Optional cleanup for tiny round-off like 359.999999 → 0
                let angleDeg = (Math.abs(angle - 360) < 1e-9) ? 0 : angle;
                console.log(landmark.name + " " + angleDeg);

                if (angleDeg > 30 && angleDeg < 150) {
                    console.log(landmark.name);
                    //Right side of plane - check if already added
                    if (!rightSeenIds.has(landmark.id || landmark.name)) {
                        rightSeen.push(landmark);
                        rightSeenIds.add(landmark.id || landmark.name);
                    }
                    //Calculate viewing score
                }
                else if (angleDeg > 210 && angleDeg < 330) {
                    //Left Side of plane - check if already added
                    if (!leftSeenIds.has(landmark.id || landmark.name)) {
                        leftSeen.push(landmark);
                        leftSeenIds.add(landmark.id || landmark.name);
                    }
                    //Calculate viewing score
        
                }
            }
        }
    })
}

export default function detectAllLandmarks(path) {
try {

    let leftSeen = [];
    let rightSeen = [];
    let leftSeenIds = new Set();  // Track IDs/names of landmarks already added to left
    let rightSeenIds = new Set(); // Track IDs/names of landmarks already added to right

    for (let i = 0; i < path.length; i++) {
        detectAtWayPoint(path[i], leftSeen, rightSeen, leftSeenIds, rightSeenIds);
    }

    console.log(rightSeen);
    return [leftSeen, rightSeen];
} catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }

}