import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Campaign, CampaignSummary, Creative, ListArgs } from '@/types/campaign';
import type { ImpressionStats, StatsRequest, MetricCard } from '@/types/stats';

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      // Add auth headers if needed
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Creative', 'Stats'],
  endpoints: (build) => ({
    // Campaigns
    listCampaigns: build.query<CampaignSummary[], ListArgs>({
      query: (params) => ({ url: '/campaigns', params }),
      providesTags: ['Campaign'],
    }),
    getCampaign: build.query<Campaign, string>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: build.mutation<Campaign, Partial<Campaign>>({
      query: (body) => ({ url: '/campaigns', method: 'POST', body }),
      invalidatesTags: ['Campaign'],
    }),
    updateCampaign: build.mutation<Campaign, { id: string; data: Partial<Campaign> }>({
      query: ({ id, data }) => ({ url: `/campaigns/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Campaign', id }],
    }),
    deleteCampaign: build.mutation<void, string>({
      query: (id) => ({ url: `/campaigns/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Campaign'],
    }),

    // Creatives
    listCreatives: build.query<Creative[], void>({
      query: () => '/creatives',
      providesTags: ['Creative'],
    }),
    uploadCreative: build.mutation<Creative, FormData>({
      query: (formData) => ({
        url: '/creatives',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Creative'],
    }),
    deleteCreative: build.mutation<void, string>({
      query: (id) => ({ url: `/creatives/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Creative'],
    }),

    // Stats
    getMetrics: build.query<MetricCard[], void>({
      query: () => '/stats/metrics',
      providesTags: ['Stats'],
    }),
    getImpressionStats: build.query<ImpressionStats[], StatsRequest>({
      query: (params) => ({ url: '/stats/impressions', params }),
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