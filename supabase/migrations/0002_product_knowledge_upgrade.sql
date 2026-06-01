alter table products
  add column if not exists altitude text,
  add column if not exists variety text,
  add column if not exists brew_recommendation text;

alter table coffee_beans
  add column if not exists altitude text,
  add column if not exists variety text,
  add column if not exists brew_recommendation text;

alter table matcha_products
  add column if not exists brew_recommendation text;

alter table craft_cocoa_products
  add column if not exists brew_recommendation text;

alter table specials
  add column if not exists visibility text not null default 'visible'
    check (visibility in ('visible', 'hidden')),
  add column if not exists menu_label text
    check (menu_label is null or menu_label in ('new', 'seasonal', 'limited'));

create index if not exists specials_visibility_category_idx
  on specials(visibility, special_category, sort_order);
