insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'products',
    'products',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'menu-items',
    'menu-items',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'specials',
    'specials',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'hero',
    'hero',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Pinoc public image read" on storage.objects;
create policy "Pinoc public image read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('products', 'menu-items', 'specials', 'hero'));

drop policy if exists "Pinoc admin image upload" on storage.objects;
create policy "Pinoc admin image upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id in ('products', 'menu-items', 'specials', 'hero'));

drop policy if exists "Pinoc admin image update" on storage.objects;
create policy "Pinoc admin image update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id in ('products', 'menu-items', 'specials', 'hero'))
  with check (bucket_id in ('products', 'menu-items', 'specials', 'hero'));

drop policy if exists "Pinoc admin image delete" on storage.objects;
create policy "Pinoc admin image delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id in ('products', 'menu-items', 'specials', 'hero'));
