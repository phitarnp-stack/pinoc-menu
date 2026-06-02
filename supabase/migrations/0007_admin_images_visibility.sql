alter table products
  add column if not exists image_url text,
  add column if not exists public_field_visibility jsonb not null default '{}'::jsonb;

alter table menu_items
  add column if not exists image_url text,
  add column if not exists public_field_visibility jsonb not null default '{}'::jsonb;

notify pgrst, 'reload schema';
