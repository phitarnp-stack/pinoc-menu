alter table menu_items
  add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_status_check'
  ) then
    alter table menu_items
      add constraint menu_items_status_check
      check (status in ('active', 'inactive', 'archived'));
  end if;
end $$;

update menu_items
set status = case
  when is_active then 'active'
  when status = 'archived' then 'archived'
  else 'inactive'
end;

insert into menu_categories (id, slug, name, description, sort_order, is_active)
values (
  'cold-brew-japan-traditional',
  'cold-brew-japan-traditional',
  'Cold Brew [Japan Traditional]',
  'Slow, patient cold brew inspired by Japanese extraction rituals and quiet clarity.',
  5,
  true
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

update menu_categories
set sort_order = 6
where id = 'special'
  and sort_order < 6;

create index if not exists menu_items_status_idx
  on menu_items(status, is_active, category_id, sort_order);

notify pgrst, 'reload schema';
