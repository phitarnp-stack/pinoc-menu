grant select, insert, update, delete on table menu_item_products to anon, authenticated;

alter table menu_item_products enable row level security;

drop policy if exists "MVP admin insert menu item products" on menu_item_products;
create policy "MVP admin insert menu item products"
  on menu_item_products for insert
  to anon, authenticated
  with check (true);

drop policy if exists "MVP admin update menu item products" on menu_item_products;
create policy "MVP admin update menu item products"
  on menu_item_products for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "MVP admin delete menu item products" on menu_item_products;
create policy "MVP admin delete menu item products"
  on menu_item_products for delete
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
