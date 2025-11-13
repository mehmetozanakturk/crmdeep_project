'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';

interface AddCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignAdded: () => void;
}

export function AddCampaignModal({ open, onOpenChange, onCampaignAdded }: AddCampaignModalProps) {
  const { currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    platform: 'meta',
    status: 'draft',
    campaign_type: 'awareness',
    budget: '',
    start_date: '',
    end_date: '',
    ad_copy: '',
    landing_page_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to create a campaign');
        return;
      }

      const { error } = await supabase.from('campaigns').insert({
        organization_id: currentOrganization.id,
        name: formData.name,
        platform: formData.platform,
        status: formData.status,
        campaign_type: formData.campaign_type,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        reach: 0,
        currency: 'TRY',
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        ad_copy: formData.ad_copy || null,
        landing_page_url: formData.landing_page_url || null,
        created_by: user.id,
      });

      if (error) throw error;

      onCampaignAdded();
      onOpenChange(false);
      setFormData({
        name: '',
        platform: 'meta',
        status: 'draft',
        campaign_type: 'awareness',
        budget: '',
        start_date: '',
        end_date: '',
        ad_copy: '',
        landing_page_url: '',
      });
    } catch (error) {
      console.error('Error adding campaign:', error);
      alert('Error adding campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Summer Sale 2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meta">Meta Ads (Facebook/Instagram)</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                  <SelectItem value="twitter">Twitter Ads</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                placeholder="1000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="campaign_type">Campaign Type</Label>
              <Select value={formData.campaign_type} onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="consideration">Consideration</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="remarketing">Remarketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ad_copy">Ad Copy</Label>
            <Textarea
              id="ad_copy"
              placeholder="Write your ad copy here..."
              value={formData.ad_copy}
              onChange={(e) => setFormData({ ...formData, ad_copy: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="landing_page_url">Landing Page URL</Label>
            <Input
              id="landing_page_url"
              type="url"
              placeholder="https://example.com/landing"
              value={formData.landing_page_url}
              onChange={(e) => setFormData({ ...formData, landing_page_url: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
