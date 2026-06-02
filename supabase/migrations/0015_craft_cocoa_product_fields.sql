alter table products
  add column if not exists batch_number text,
  add column if not exists season text,
  add column if not exists percent text;

notify pgrst, 'reload schema';
