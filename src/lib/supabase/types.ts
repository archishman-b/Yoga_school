// Supabase Database Types
// Re-generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_REF

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
  emergency_contact: string | null;
  preferred_language: 'en' | 'hi' | 'bn';
  role: 'member' | 'admin';
  status: 'active' | 'suspended';
  joined_date: string | null;
  created_at: string;
};

export type Batch = {
  id: string;
  name_en: string;
  name_hi: string | null;
  name_bn: string | null;
  timing: string | null;
  days: string | null;
  capacity: number;
  enrolled: number;
  instructor: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  fee_monthly: number | null;
  status: 'active' | 'paused' | 'ended' | 'cancelled';
  created_at: string;
};

export type Enrollment = {
  id: string;
  member_id: string;
  batch_id: string;
  start_date: string | null;
  status: 'active' | 'paused' | 'cancelled';
  notes: string | null;
  created_at: string;
};

export type FeeRecord = {
  id: string;
  member_id: string;
  amount: number;
  month: string;
  due_date: string | null;
  paid_date: string | null;
  method: 'upi' | 'cash' | 'gateway' | null;
  reference: string | null;
  screenshot_url: string | null;
  gateway_order_id: string | null;
  status: 'pending' | 'screenshot_uploaded' | 'confirmed' | 'overdue';
  updated_at: string;
  created_at: string;
};

export type Event = {
  id: string;
  title_en: string;
  title_hi: string | null;
  title_bn: string | null;
  body_en: string | null;
  body_hi: string | null;
  body_bn: string | null;
  media_url: string | null;
  media_type: 'youtube' | 'image' | 'drive' | null;
  tags: string[] | null;
  event_date: string | null;
  pinned: boolean;
  created_at: string;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferred_time: string | null;
  status: 'new' | 'contacted' | 'replied';
  created_at: string;
};
