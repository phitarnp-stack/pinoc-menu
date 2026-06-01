grant insert, update on table
  products,
  menu_items,
  specials
to anon, authenticated;

grant insert, delete on table
  menu_item_taste_profiles
to anon, authenticated;

drop policy if exists "Temporary admin write products" on products;
create policy "Temporary admin write products"
  on products for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Temporary admin write menu items" on menu_items;
create policy "Temporary admin write menu items"
  on menu_items for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Temporary admin write specials" on specials;
create policy "Temporary admin write specials"
  on specials for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Temporary admin write menu item taste profiles" on menu_item_taste_profiles;
create policy "Temporary admin write menu item taste profiles"
  on menu_item_taste_profiles for all
  to anon, authenticated
  using (true)
  with check (true);
