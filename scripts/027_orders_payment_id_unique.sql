-- One order per Square payment (applied in production 2026-10-09).
create unique index if not exists orders_payment_id_unique on public.orders (payment_id) where payment_id is not null;
