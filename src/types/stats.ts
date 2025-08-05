export interface MetricCard {
  title: string;
  value: number;
  change?: number;
  format: 'number' | 'percentage' | 'currency';
}

export interface ImpressionStats {
  date: string;
  campaignId: string;
  creativeId: string;
  surface: string;
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  ecpm: number;
}

export interface LiveLogEntry {
  timestamp: string;
  userId: string; // hashed
  creativeId: string;
  campaignId: string;
  surface: string;
  isViewed: boolean;
  sessionId?: string;
}

export interface StatsRequest {
  dateFrom: string;
  dateTo: string;
  groupBy?: ('day' | 'campaign' | 'surface')[];
  campaignIds?: string[];
  surfaces?: string[];
}