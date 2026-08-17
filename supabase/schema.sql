create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  provider text not null check (provider in ('paypal', 'manual')),
  provider_order_id text unique,
  provider_capture_id text,
  payment_method text not null check (payment_method in ('paypal', 'bank_transfer')),
  sku text not null,
  product_name text not null,
  quantity integer not null check (quantity between 1 and 5),
  currency text not null default 'USD',
  unit_amount integer not null check (unit_amount >= 0),
  subtotal_amount integer not null check (subtotal_amount >= 0),
  shipping_amount integer not null default 0 check (shipping_amount >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  customer_name text,
  customer_email text,
  customer_phone text,
  company_name text,
  shipping_address jsonb,
  payment_status text not null default 'pending'
    check (payment_status in (
      'pending',
      'approved',
      'awaiting_bank_transfer',
      'paid',
      'review',
      'failed',
      'refunded',
      'disputed'
    )),
  fulfillment_status text not null default 'unfulfilled'
    check (fulfillment_status in ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number text,
  raw_provider_data jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_fulfillment_status_idx on public.orders (fulfillment_status);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  provider text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.payment_events enable row level security;

-- No public policies are created. The website writes through Vercel Functions with
-- SUPABASE_SERVICE_ROLE_KEY, while anonymous browser clients cannot read order data.
