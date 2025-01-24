export interface ICampaign {
  id?: number;
  type: 'Cost per Order' | 'Cost per Click' | 'Buy One Get One';
  startDate: Date;
  endDate: Date;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}
