function ResultsPanel({ flightData, landmarkData }) {
  if (!flightData) {
    return null;
  }

  // Extract left and right seen landmarks
  const leftSeen = landmarkData?.[0] || [];
  const rightSeen = landmarkData?.[1] || [];

  // Determine recommendation
  const getRecommendation = () => {
    const leftCount = leftSeen.length;
    const rightCount = rightSeen.length;

    if (leftCount === 0 && rightCount === 0) {
      return {
        side: "Either",
        message: "No major landmarks visible from this flight path.",
        icon: "✈️"
      };
    }

    if (leftCount > rightCount) {
      return {
        side: "Left",
        message: `${leftCount} landmark${leftCount === 1 ? '' : 's'} visible on the left side.`,
        icon: "👈"
      };
    } else if (rightCount > leftCount) {
      return {
        side: "Right", 
        message: `${rightCount} landmark${rightCount === 1 ? '' : 's'} visible on the right side.`,
        icon: "👉"
      };
    } else {
      return {
        side: "Either",
        message: `Equal landmarks on both sides (${leftCount} each).`,
        icon: "⚖️"
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="results-panel">
      <div className="flight-info">
        <h3>Flight Found!</h3>
        <p><strong>Flight:</strong> {flightData.flightNumber}</p>
        <p><strong>Callsign:</strong> {flightData.callsign}</p>
        {flightData.departureAirport && (
          <p><strong>Route:</strong> {flightData.departureAirport} → {flightData.arrivalAirport}</p>
        )}
        <p><strong>Waypoints:</strong> {flightData.coordinates?.length || 0}</p>
      </div>
       
      <div className="recommendation">
        <h4>🎯 Seat Recommendation</h4>
        <div className="seat-choice">
          <p><strong>{recommendation.icon} Sit on the {recommendation.side} side</strong></p>
          <p>{recommendation.message}</p>
        </div>
        
        {(leftSeen.length > 0 || rightSeen.length > 0) && (
          <div className="landmark-details">
            {leftSeen.length > 0 && (
              <div className="landmarks-left">
                <strong>Left side landmarks:</strong>
                <ul>
                  {leftSeen.slice(0, 5).map((landmark, index) => (
                    <li key={index}>{landmark.name}</li>
                  ))}
                  {leftSeen.length > 5 && <li>...and {leftSeen.length - 5} more</li>}
                </ul>
              </div>
            )}
            
            {rightSeen.length > 0 && (
              <div className="landmarks-right">
                <strong>Right side landmarks:</strong>
                <ul>
                  {rightSeen.slice(0, 5).map((landmark, index) => (
                    <li key={index}>{landmark.name}</li>
                  ))}
                  {rightSeen.length > 5 && <li>...and {rightSeen.length - 5} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPanel;