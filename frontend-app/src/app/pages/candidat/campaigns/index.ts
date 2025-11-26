// The candidate campaigns listing re-uses the public/start-page implementation.
// Re-export the `CampaignsPage` from the start-page folder so builds don't fail
// when a local `campaigns.ts` is not present.
export { CampaignsPage } from '../../start-page/campaigns/campaigns';
