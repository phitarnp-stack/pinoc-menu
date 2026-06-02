alter table menu_items
  add column if not exists classic_group text not null default 'none';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_classic_group_check'
  ) then
    alter table menu_items
      add constraint menu_items_classic_group_check
      check (
        classic_group in (
          'black_coffee',
          'milk_coffee',
          'juice_with_coffee',
          'none'
        )
      );
  end if;
end $$;

update menu_items
set classic_group = case id
  when 'item-americano' then 'black_coffee'
  when 'item-latte' then 'milk_coffee'
  when 'item-cappuccino' then 'milk_coffee'
  else classic_group
end
where id in ('item-americano', 'item-latte', 'item-cappuccino')
  and classic_group = 'none';

create index if not exists menu_items_classic_group_idx
  on menu_items(category_id, is_active, classic_group, sort_order);

notify pgrst, 'reload schema';
