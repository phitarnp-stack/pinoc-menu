create table if not exists hero_content (
  id text primary key default 'home',
  title text not null,
  subtitle text not null,
  image_url text,
  featured_product_id text references products(id) on delete set null,
  featured_special_id text references menu_items(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hero_content enable row level security;

grant select, insert, update, delete on table hero_content to anon, authenticated;

drop policy if exists "Public read hero content" on hero_content;
create policy "Public read hero content"
  on hero_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin write hero content" on hero_content;
create policy "Admin write hero content"
  on hero_content for all
  to anon, authenticated
  using (true)
  with check (true);

insert into hero_content (
  id,
  title,
  subtitle,
  image_url,
  featured_product_id,
  featured_special_id
)
values (
  'home',
  'Discover Your Perfect Cup',
  'A quieter way to meet specialty coffee: curated origins, refined roast profiles, and tasting notes designed for the cup you are in the mood for.',
  null,
  null,
  null
)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
