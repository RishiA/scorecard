// src/utils/scoring.ts

/**
 * Calculates the readiness score for each workstream based on its activities.
 * Only includes activities where actual_points/possible_points >= 0.75.
 * Assumes that the total weight for valid activities sums up to 100.
 *
 * @param workstreams - Array of workstream objects.
 * @param activities - Array of activity objects.
 * @returns Array of workstream objects with readiness, color, and assessment.
 */
export function parseWorkstreams(workstreams: any[], activities: any[]) {
    return workstreams.map((ws) => {
      // Get all activities that belong to this workstream
      const wsActivities = activities.filter((act) => act.workstream_id === ws.id);
      
      // Filter out activities with actual score below 75%
      const validActivities = wsActivities.filter(
        (act) => (act.actual_points / act.possible_points) >= 0.75
      );
  
      // Calculate weighted readiness sum
      let weightedSum = 0;
      validActivities.forEach((act) => {
        weightedSum += (act.actual_points / act.possible_points) * act.weight;
      });
  
      // The weightedSum is on a scale of 0 to 100
      const readiness = Math.round(weightedSum);
  
      // Determine the color and assessment based on thresholds:
      // - Green if readiness >= 80%
      // - Yellow if readiness is between 50% and 79%
      // - Red if readiness < 50%
      let color = 'red';
      let assessment = 'Expansion Not Recommended';
      if (readiness >= 80) {
        color = 'green';
        assessment = 'Expansion Recommended';
      } else if (readiness >= 50) {
        color = 'yellow';
        assessment = 'Expansion Cautioned';
      }
  
      return {
        id: ws.id,
        name: ws.name,
        target_threshold: ws.target_threshold,
        readiness,
        color,
        assessment,
      };
    });
  }
  