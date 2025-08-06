import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Campaign, CampaignSummary, Creative, ListArgs } from '@/types/campaign';
import type { ImpressionStats, StatsRequest, MetricCard } from '@/types/stats';
import { mockCampaigns, mockMetrics, mockCampaignDetails } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage for campaigns to persist across page reloads
const CAMPAIGNS_STORAGE_KEY = 'commerce-campaigns';
const CAMPAIGN_DETAILS_STORAGE_KEY = 'commerce-campaign-details';

// Load campaigns from localStorage or use defaults
const loadCampaigns = (): CampaignSummary[] => {
  try {
    const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...mockCampaigns];
  } catch {
    return [...mockCampaigns];
  }
};

// Load campaign details from localStorage or use defaults
const loadCampaignDetails = (): Campaign[] => {
  try {
    const stored = localStorage.getItem(CAMPAIGN_DETAILS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...mockCampaignDetails];
  } catch {
    return [...mockCampaignDetails];
  }
};

// Save campaigns to localStorage
const saveCampaigns = (campaigns: CampaignSummary[]) => {
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (error) {
    console.error('Failed to save campaigns to localStorage:', error);
  }
};

// Save campaign details to localStorage
const saveCampaignDetails = (details: Campaign[]) => {
  try {
    localStorage.setItem(CAMPAIGN_DETAILS_STORAGE_KEY, JSON.stringify(details));
  } catch (error) {
    console.error('Failed to save campaign details to localStorage:', error);
  }
};

// Runtime storage
let runtimeCampaigns = loadCampaigns();
let runtimeCampaignDetails = loadCampaignDetails();

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Campaign', 'Creative', 'Stats'],
  endpoints: (build) => ({
    // Campaigns
    listCampaigns: build.query<CampaignSummary[], ListArgs>({
      queryFn: async (params) => {
        await delay(300); // Simulate network delay
        
        let filteredCampaigns = [...runtimeCampaigns];
        
        // Apply search filter
        if (params.search) {
          filteredCampaigns = filteredCampaigns.filter(campaign =>
            campaign.name.toLowerCase().includes(params.search!.toLowerCase())
          );
        }
        
        // Apply status filter
        if (params.status && params.status.length > 0) {
          filteredCampaigns = filteredCampaigns.filter(campaign =>
            params.status!.includes(campaign.status)
          );
        }
        
        return { data: filteredCampaigns };
      },
      providesTags: ['Campaign'],
    }),
    getCampaign: build.query<Campaign, string>({
      queryFn: async (id) => {
        await delay(200);
        const campaign = runtimeCampaignDetails.find(c => c.id === id);
        if (!campaign) {
          return { error: { status: 404, data: 'Campaign not found' } };
        }
        return { data: campaign };
      },
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: build.mutation<Campaign, Partial<Campaign>>({
      queryFn: async (body) => {
        await delay(500);
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          name: body.name || 'New Campaign',
          description: body.description || '',
          startDate: body.startDate || new Date().toISOString(),
          endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          weight: body.weight || 10,
          consecutiveCap: body.consecutiveCap || 3,
          limitImpressions: body.limitImpressions || 10000,
          impressionsDone: 0,
          creatives: body.creatives || [],
          creativeFiles: body.creativeFiles || [],
          status: body.status || 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Add to runtime storage
        runtimeCampaignDetails.push(newCampaign);
        
        // Create summary version for campaigns list
        const campaignSummary: CampaignSummary = {
          id: newCampaign.id,
          name: newCampaign.name,
          startDate: newCampaign.startDate,
          endDate: newCampaign.endDate,
          weight: newCampaign.weight,
          consecutiveCap: newCampaign.consecutiveCap,
          limitImpressions: newCampaign.limitImpressions,
          impressionsDone: newCampaign.impressionsDone,
          status: newCampaign.status,
        };
        runtimeCampaigns.push(campaignSummary);
        
        // Save to localStorage
        saveCampaigns(runtimeCampaigns);
        saveCampaignDetails(runtimeCampaignDetails);
        
        return { data: newCampaign };
      },
      invalidatesTags: ['Campaign'],
    }),
    updateCampaign: build.mutation<Campaign, { id: string; data: Partial<Campaign> }>({
      queryFn: async ({ id, data }) => {
        await delay(300);
        const campaignIndex = runtimeCampaignDetails.findIndex(c => c.id === id);
        if (campaignIndex === -1) {
          return { error: { status: 404, data: 'Campaign not found' } };
        }
        
        const updatedCampaign = { 
          ...runtimeCampaignDetails[campaignIndex], 
          ...data, 
          updatedAt: new Date().toISOString() 
        };
        
        // Update in runtime storage
        runtimeCampaignDetails[campaignIndex] = updatedCampaign;
        
        // Update campaign summary as well
        const summaryIndex = runtimeCampaigns.findIndex(c => c.id === id);
        if (summaryIndex !== -1) {
          runtimeCampaigns[summaryIndex] = {
            ...runtimeCampaigns[summaryIndex],
            name: updatedCampaign.name,
            startDate: updatedCampaign.startDate,
            endDate: updatedCampaign.endDate,
            weight: updatedCampaign.weight,
            consecutiveCap: updatedCampaign.consecutiveCap,
            limitImpressions: updatedCampaign.limitImpressions,
            impressionsDone: updatedCampaign.impressionsDone,
            status: updatedCampaign.status,
          };
        }
        
        // Save to localStorage
        saveCampaigns(runtimeCampaigns);
        saveCampaignDetails(runtimeCampaignDetails);
        
        return { data: updatedCampaign };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Campaign', id }],
    }),
    deleteCampaign: build.mutation<void, string>({
      queryFn: async (id) => {
        await delay(200);
        return { data: undefined };
      },
      invalidatesTags: ['Campaign'],
    }),

    // Creatives
    listCreatives: build.query<Creative[], void>({
      queryFn: async () => {
        await delay(200);
        return { data: [] }; // Empty for now
      },
      providesTags: ['Creative'],
    }),
    uploadCreative: build.mutation<Creative, FormData>({
      queryFn: async (formData) => {
        await delay(1000);
        const mockCreative: Creative = {
          id: Date.now().toString(),
          name: 'New Creative',
          fileName: 'creative.jpg',
          fileSize: 150000,
          mimeType: 'image/jpeg',
          hash: 'abc123',
          surface: 'promo_block',
          dimensions: { width: 320, height: 168 },
          uploadedAt: new Date().toISOString(),
          usedInCampaigns: 0,
        };
        return { data: mockCreative };
      },
      invalidatesTags: ['Creative'],
    }),
    deleteCreative: build.mutation<void, string>({
      queryFn: async (id) => {
        await delay(200);
        return { data: undefined };
      },
      invalidatesTags: ['Creative'],
    }),

    // Stats
    getMetrics: build.query<MetricCard[], void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockMetrics };
      },
      providesTags: ['Stats'],
    }),
    getImpressionStats: build.query<ImpressionStats[], StatsRequest>({
      queryFn: async () => {
        await delay(400);
        return { data: [] }; // Empty for now
      },
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useListCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useListCreativesQuery,
  useUploadCreativeMutation,
  useDeleteCreativeMutation,
  useGetMetricsQuery,
  useGetImpressionStatsQuery,
} = adsApi;