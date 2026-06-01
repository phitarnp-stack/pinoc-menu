grant usage on schema public to anon, authenticated;

grant select on table
  products,
  menu_items,
  specials
to anon, authenticated;

grant insert, update, delete on table
  products,
  menu_items,
  specials
to anon, authenticated;

grant select, insert, delete on table
  menu_item_taste_profiles
to anon, authenticated;

alter table products enable row level security;
alter table menu_items enable row level security;
alter table specials enable row level security;
alter table menu_item_taste_profiles enable row level security;

drop policy if exists "MVP admin insert products" on products;
create policy "MVP admin insert products"
  on products for insert
  to anon, authenticated
  with check (true);

drop policy if exists "MVP admin update products" on products;
create policy "MVP admin update products"
  on products for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "MVP admin delete products" on products;
create policy "MVP admin delete products"
  on products for delete
  to anon, authenticated
  using (true);

drop policy if exists "MVP admin insert menu items" on menu_items;
create policy "MVP admin insert menu items"
  on menu_items for insert
  to anon, authenticated
  with check (true);

drop policy if exists "MVP admin update menu items" on menu_items;
create policy "MVP admin update menu items"
  on menu_items for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "MVP admin delete menu items" on menu_items;
create policy "MVP admin delete menu items"
  on menu_items for delete
  to anon, authenticated
  using (true);

drop policy if exists "MVP admin insert specials" on specials;
create policy "MVP admin insert specials"
  on specials for insert
  to anon, authenticated
  with check (true);

drop policy if exists "MVP admin update specials" on specials;
create policy "MVP admin update specials"
  on specials for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "MVP admin delete specials" on specials;
create policy "MVP admin delete specials"
  on specials for delete
  to anon, authenticated
  using (true);

drop policy if exists "MVP admin insert menu item taste profiles" on menu_item_taste_profiles;
create policy "MVP admin insert menu item taste profiles"
  on menu_item_taste_profiles for insert
  to anon, authenticated
  with check (true);

drop policy if exists "MVP admin delete menu item taste profiles" on menu_item_taste_profiles;
create policy "MVP admin delete menu item taste profiles"
  on menu_item_taste_profiles for delete
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
