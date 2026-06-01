alter table products
  add column if not exists slug text,
  add column if not exists product_type text,
  add column if not exists status text not null default 'active',
  add column if not exists price numeric(10, 2) not null default 0,
  add column if not exists description text not null default '',
  add column if not exists flavor_notes text[] not null default '{}',
  add column if not exists image_placeholder text not null default '',
  add column if not exists available_for text not null default '',
  add column if not exists origin text,
  add column if not exists region text,
  add column if not exists producer text,
  add column if not exists altitude text,
  add column if not exists variety text,
  add column if not exists process text,
  add column if not exists roast_level text,
  add column if not exists brew_recommendation text,
  add column if not exists is_seasonal boolean not null default false,
  add column if not exists available_from date,
  add column if not exists available_until date;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_product_type_check'
  ) then
    alter table products
      add constraint products_product_type_check
      check (product_type in ('coffee_bean', 'matcha', 'craft_cocoa'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_status_check'
  ) then
    alter table products
      add constraint products_status_check
      check (status in ('active', 'inactive'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_price_check'
  ) then
    alter table products
      add constraint products_price_check
      check (price >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_roast_level_check'
  ) then
    alter table products
      add constraint products_roast_level_check
      check (
        roast_level is null
        or roast_level in ('Light', 'Medium-Light', 'Medium', 'Medium-Dark')
      );
  end if;
end $$;

create unique index if not exists products_slug_unique_idx on products(slug);
create index if not exists products_product_type_status_idx on products(product_type, status);
create index if not exists products_seasonal_window_idx
  on products(is_seasonal, available_from, available_until);

grant select, insert, update on table products to anon, authenticated;

notify pgrst, 'reload schema';
