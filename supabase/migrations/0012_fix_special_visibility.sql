alter table specials
  add column if not exists visibility text not null default 'visible',
  add column if not exists menu_label text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'specials_visibility_check'
  ) then
    alter table specials
      add constraint specials_visibility_check
      check (visibility in ('visible', 'hidden'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'specials_menu_label_check'
  ) then
    alter table specials
      add constraint specials_menu_label_check
      check (menu_label is null or menu_label in ('new', 'seasonal', 'limited'));
  end if;
end $$;

create index if not exists specials_visibility_category_idx
  on specials(visibility, special_category, sort_order);

notify pgrst, 'reload schema';
