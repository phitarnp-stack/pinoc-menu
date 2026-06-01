grant usage on schema public to anon, authenticated;

grant select on table
  products,
  coffee_beans,
  matcha_products,
  craft_cocoa_products,
  menu_categories,
  menu_items,
  menu_item_products,
  specials,
  taste_profiles,
  product_taste_profiles,
  menu_item_taste_profiles,
  feeling_tags
to anon, authenticated;

alter table products enable row level security;
alter table coffee_beans enable row level security;
alter table matcha_products enable row level security;
alter table craft_cocoa_products enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table menu_item_products enable row level security;
alter table specials enable row level security;
alter table taste_profiles enable row level security;
alter table product_taste_profiles enable row level security;
alter table menu_item_taste_profiles enable row level security;
alter table feeling_tags enable row level security;

drop policy if exists "Public read products" on products;
create policy "Public read products"
  on products for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read coffee beans" on coffee_beans;
create policy "Public read coffee beans"
  on coffee_beans for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read matcha products" on matcha_products;
create policy "Public read matcha products"
  on matcha_products for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read craft cocoa products" on craft_cocoa_products;
create policy "Public read craft cocoa products"
  on craft_cocoa_products for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read menu categories" on menu_categories;
create policy "Public read menu categories"
  on menu_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read menu items" on menu_items;
create policy "Public read menu items"
  on menu_items for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read menu item products" on menu_item_products;
create policy "Public read menu item products"
  on menu_item_products for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read specials" on specials;
create policy "Public read specials"
  on specials for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read taste profiles" on taste_profiles;
create policy "Public read taste profiles"
  on taste_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read product taste profiles" on product_taste_profiles;
create policy "Public read product taste profiles"
  on product_taste_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read menu item taste profiles" on menu_item_taste_profiles;
create policy "Public read menu item taste profiles"
  on menu_item_taste_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read feeling tags" on feeling_tags;
create policy "Public read feeling tags"
  on feeling_tags for select
  to anon, authenticated
  using (true);
