export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO
  endDate: string;
  audience?: AudienceTargeting;
  weight: number; // 0‑100
  consecutiveCap: number;
  limitImpressions: number;
  impressionsDone?: number;
  ctr?: number;
  ecpm?: number;
  creatives: CreativeRef[];
  creativeFiles?: Creative[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  audience?: AudienceTargeting;
  weight: number;
  consecutiveCap: number;
  limitImpressions: number;
  impressionsDone?: number;
  impressions?: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  ctr?: number;
  ecpm?: number;
}

export interface CreativeRef {
  id: string;
  weight: number;
}

export interface Creative {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  hash: string;
  surface: 'promo_block' | 'map_object';
  dimensions: {
    width: number;
    height: number;
  };
  uploadedAt: string;
  usedInCampaigns: number;
}

export interface AudienceTargeting {
  type: 'role' | 'file';
  role?: string;
  fileName?: string;
  fileSize?: number;
  estimatedReach?: number;
}

export interface ListArgs {
  status?: Campaign['status'][];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}