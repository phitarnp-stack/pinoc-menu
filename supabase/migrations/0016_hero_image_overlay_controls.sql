alter table menu_items
  add column if not exists hero_content_mode text not null default 'image_with_menu_info',
  add column if not exists custom_overlay_title text,
  add column if not exists custom_overlay_text text,
  add column if not exists overlay_fields text[] not null default array['name', 'taste_note', 'price']::text[];

alter table hero_content
  add column if not exists hero_content_mode text not null default 'image_with_menu_info',
  add column if not exists custom_overlay_title text,
  add column if not exists custom_overlay_text text,
  add column if not exists overlay_fields text[] not null default array['name', 'taste_note']::text[];

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_hero_content_mode_check'
  ) then
    alter table menu_items
      add constraint menu_items_hero_content_mode_check
      check (hero_content_mode in ('image_only', 'image_with_menu_info', 'custom_overlay'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'hero_content_hero_content_mode_check'
  ) then
    alter table hero_content
      add constraint hero_content_hero_content_mode_check
      check (hero_content_mode in ('image_only', 'image_with_menu_info', 'custom_overlay'));
  end if;
end $$;

notify pgrst, 'reload schema';
