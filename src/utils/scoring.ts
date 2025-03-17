interface Workstream {
    id: number;
    name: string;
    target_threshold: number;
  }
  
  interface Activity {
    id: number;
    workstream_id: number;
    name: string;
    weight: number;
    actual_points: number;
    possible_points: number;
    workstreams?: Workstream;
  }
  
  export interface ParsedWorkstream {
    id: number;
    name: string;
    target_threshold: number;
    readiness: number;
    color: string;
    assessment: string;
  }
  
  export function parseWorkstreams(
    workstreams: Workstream[],
    activities: Activity[]
  ): ParsedWorkstream[] {
    return workstreams.map((ws) => {
      const wsActivities = activities.filter((act) => act.workstream_id === ws.id);
  
      const validActivities = wsActivities.filter(
        (act) => act.actual_points / act.possible_points >= 0.75
      );
  
      let weightedSum = 0;
      validActivities.forEach((act) => {
        weightedSum += (act.actual_points / act.possible_points) * act.weight;
      });
  
      const readiness = Math.round(weightedSum);
  
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
  