-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'new_order', 'order_completed', 'low_stock'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  order_id UUID REFERENCES orders(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB -- Additional data like customer_name, total_amount, etc.
);

-- Enable RLS (optional, bisa disable untuk development)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy untuk admin access
CREATE POLICY "Admin full access notifications" ON notifications
FOR ALL USING (true);

-- Index untuk performance
CREATE INDEX idx_notifications_type_unread ON notifications(type, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
