alter table menu_items
  add column if not exists story_status text not null default 'default',
  add column if not exists story_title text,
  add column if not exists story_description text,
  add column if not exists serving_ritual text,
  add column if not exists why_we_created_it text,
  add column if not exists best_for text[] not null default '{}';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'menu_items_story_status_check'
  ) then
    alter table menu_items
      add constraint menu_items_story_status_check
      check (story_status in ('default', 'custom'));
  end if;
end $$;

create index if not exists menu_items_story_status_idx on menu_items(story_status);

notify pgrst, 'reload schema';
