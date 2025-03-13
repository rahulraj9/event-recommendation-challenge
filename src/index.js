/**
 * Calculate distance between two geographical points using Haversine formula
 * @param {Object} point1 - {lat, lng}
 * @param {Object} point2 - {lat, lng}
 * @returns {number} Distance in kilometers
 */
function calculateDistance(point1, point2) {
    // Implement the Haversine formula to calculate geographic distance
    const R = 6371; 
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const lat1 = toRadians(point1.lat);
    const lon1 = toRadians(point1.lng);
    const lat2 = toRadians(point2.lat);
    const lon2 = toRadians(point2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c; // Distance in km
}

/**
 * Recommend events for a user
 * @param {Object} user - User data including preferences and location
 * @param {Array} events - Array of event objects
 * @param {Object} eventSimilarity - Object mapping events to similar events
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} Array of recommended event objects
 */
function getRecommendedEvents(user, events, eventSimilarity, limit = 5) {
    // console.log("user",events)
    const userLocation = { lat: user.lat, lng: user.lng };

    const scoredEvents = events.map((event) => {
        const distanceScore = calculateDistance(userLocation, {
            lat: event.lat,
            lng: event.lng,
        });

        const categoryMatch = user.preferences.includes(event.categories)
            ? 1
            : 0;

        const similarityScore = eventSimilarity[event.id] || 0;
        const popularityScore = event.popularity || 0;

        // Weight the scores
        const finalScore =
            similarityScore * 0.4 +
            categoryMatch * 0.3 +
            (1 / (1 + distanceScore)) * 0.2 +
            popularityScore * 0.1;

        return { ...event, score: finalScore };
    });

    // Sort by descending score
    return scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}


module.exports = {
    calculateDistance,
    getRecommendedEvents
};