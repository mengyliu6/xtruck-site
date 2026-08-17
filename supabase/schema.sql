create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  client_request_id text not null unique,
  product_sku text not null,
  product_name text not null,
  quantity smallint not null check (quantity between 1 and 5),
  currency text not null check (currency = 'USD'),
  unit_price bigint not null check (unit_price > 0),
  subtotal bigint not null check (subtotal > 0),
  shipping_amount bigint not null default 0 check (shipping_amount >= 0),
  total_amount bigint not null check (total_amount = subtotal + shipping_amount),
  payment_provider text not null check (payment_provider = 'paypal'),
  payment_status text not null default 'pending' check (
    payment_status in ('pending', 'approved', 'paid', 'failed', 'cancelled', 'refunded', 'review')
  ),
  fulfillment_status text not null default 'unfulfilled' check (
    fulfillment_status in ('unfulfilled', 'processing', 'shipped', 'completed', 'cancelled')
  ),
  paypal_order_id text,
  paypal_capture_id text,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_country text,
  shipping_address jsonb,
  raw_payment_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists orders_paypal_order_id_unique
  on public.orders (paypal_order_id)
  where paypal_order_id is not null;

create unique index if not exists orders_paypal_capture_id_unique
  on public.orders (paypal_capture_id)
  where paypal_capture_id is not null;

create index if not exists orders_created_at_index on public.orders (created_at desc);
create index if not exists orders_payment_status_index on public.orders (payment_status);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider = 'paypal'),
  provider_event_id text not null unique,
  event_type text not null,
  order_id uuid references public.orders (id) on delete set null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payment_events_order_id_index on public.payment_events (order_id);
create index if not exists payment_events_created_at_index on public.payment_events (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.payment_events enable row level security;

revoke all on table public.orders from anon, authenticated;
revoke all on table public.payment_events from anon, authenticated;
grant all on table public.orders to service_role;
grant all on table public.payment_events to service_role;

-- No anon or authenticated RLS policies are created. Browser clients cannot read or write orders.
