alter table public.orders
  add column if not exists shipping_carrier text,
  add column if not exists tracking_number text,
  add column if not exists confirmation_email_sent_at timestamptz,
  add column if not exists shipping_email_sent_at timestamptz;

create index if not exists orders_customer_email_lower_index
  on public.orders (lower(customer_email));
create index if not exists orders_fulfillment_status_index
  on public.orders (fulfillment_status);

create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('order_confirmation', 'shipping_update')),
  subject text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists email_templates_set_updated_at on public.email_templates;
create trigger email_templates_set_updated_at
before update on public.email_templates
for each row execute function public.set_updated_at();

insert into public.email_templates (key, subject, body)
values
  (
    'order_confirmation',
    'Xtruck order confirmation - {{order_number}}',
    E'Hello {{customer_name}},\n\nThank you for your Xtruck order.\n\nOrder Number: {{order_number}}\nProduct: {{product_name}}\nQuantity: {{quantity}}\nTotal: {{total}}\nPayment Status: {{payment_status}}\nFulfillment Status: {{fulfillment_status}}\n\nView your order status: {{order_status_url}}\n\nXtruck'
  ),
  (
    'shipping_update',
    'Your Xtruck order has shipped - {{order_number}}',
    E'Hello {{customer_name}},\n\nYour Xtruck order has shipped.\n\nOrder Number: {{order_number}}\nShipping Carrier: {{shipping_carrier}}\nTracking Number: {{tracking_number}}\nFulfillment Status: {{fulfillment_status}}\n\nView your order status: {{order_status_url}}\n\nXtruck'
  )
on conflict (key) do nothing;

alter table public.email_templates enable row level security;
revoke all on table public.email_templates from anon, authenticated;
grant all on table public.email_templates to service_role;

-- Browser clients receive no policies for orders or email_templates.
-- All reads and writes continue through authenticated Vercel Functions.
