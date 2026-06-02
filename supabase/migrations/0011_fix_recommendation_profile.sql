alter table menu_items
  add column if not exists drink_type text,
  add column if not exists feeling_tags text[] not null default '{}',
  add column if not exists adventure_level text,
  add column if not exists body_level integer,
  add column if not exists flavor_preferences text[] not null default '{}',
  add column if not exists comfort_level text,
  add column if not exists intensity_level integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_drink_type_check'
  ) then
    alter table menu_items
      add constraint menu_items_drink_type_check
      check (
        drink_type is null
        or drink_type in (
          'coffee',
          'milk_coffee',
          'matcha',
          'craft_cocoa',
          'non_coffee',
          'cold_brew'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_adventure_level_check'
  ) then
    alter table menu_items
      add constraint menu_items_adventure_level_check
      check (
        adventure_level is null
        or adventure_level in ('familiar', 'curious', 'adventurous')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_body_level_check'
  ) then
    alter table menu_items
      add constraint menu_items_body_level_check
      check (body_level is null or body_level between 1 and 5);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_comfort_level_check'
  ) then
    alter table menu_items
      add constraint menu_items_comfort_level_check
      check (
        comfort_level is null
        or comfort_level in (
          'comfort_zone',
          'something_new',
          'explore_origin',
          'surprise_me'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_intensity_level_check'
  ) then
    alter table menu_items
      add constraint menu_items_intensity_level_check
      check (intensity_level is null or intensity_level between 1 and 5);
  end if;
end $$;

create index if not exists menu_items_drink_type_idx on menu_items(drink_type);
create index if not exists menu_items_feeling_tags_idx on menu_items using gin(feeling_tags);
create index if not exists menu_items_adventure_level_idx on menu_items(adventure_level);
create index if not exists menu_items_flavor_preferences_idx on menu_items using gin(flavor_preferences);
create index if not exists menu_items_comfort_level_idx on menu_items(comfort_level);

notify pgrst, 'reload schema';
