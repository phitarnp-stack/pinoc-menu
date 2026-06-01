create extension if not exists pgcrypto;

create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  product_type text not null check (product_type in ('coffee_bean', 'matcha', 'craft_cocoa')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  price numeric(10, 2) not null default 0 check (price >= 0),
  description text not null default '',
  flavor_notes text[] not null default '{}',
  image_placeholder text not null default '',
  available_for text not null default '',
  origin text,
  region text,
  producer text,
  process text,
  roast_level text check (roast_level is null or roast_level in ('Light', 'Medium-Light', 'Medium', 'Medium-Dark')),
  is_seasonal boolean not null default false,
  available_from date,
  available_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists coffee_beans (
  product_id text primary key references products(id) on delete cascade,
  origin text,
  region text,
  producer text,
  process text,
  roast_level text check (roast_level is null or roast_level in ('Light', 'Medium-Light', 'Medium', 'Medium-Dark')),
  is_house_blend boolean not null default false,
  is_filter_option boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists matcha_products (
  product_id text primary key references products(id) on delete cascade,
  grade text,
  origin_region text,
  preparation_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists craft_cocoa_products (
  product_id text primary key references products(id) on delete cascade,
  cocoa_origin text,
  cocoa_percentage numeric(5, 2),
  preparation_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_items (
  id text primary key,
  category_id text not null references menu_categories(id) on delete restrict,
  slug text not null,
  name text not null,
  price numeric(10, 2) not null default 0 check (price >= 0),
  description text not null default '',
  flavor_notes text[] not null default '{}',
  recommended_for text not null default '',
  image_placeholder text not null default '',
  is_active boolean not null default true,
  is_seasonal boolean not null default false,
  available_from date,
  available_until date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists menu_item_products (
  id text primary key,
  menu_item_id text not null references menu_items(id) on delete cascade,
  product_id text not null references products(id) on delete restrict,
  role text not null default 'option' check (role in ('default', 'option', 'base', 'seasonal_option')),
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  available_from date,
  available_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (menu_item_id, product_id, role)
);

create table if not exists specials (
  id text primary key,
  menu_item_id text not null references menu_items(id) on delete cascade,
  special_category text not null check (special_category in ('coffee', 'non_coffee', 'cold_brew')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  available_from date,
  available_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (menu_item_id, special_category)
);

create table if not exists taste_profiles (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_taste_profiles (
  product_id text not null references products(id) on delete cascade,
  taste_profile_id text not null references taste_profiles(id) on delete cascade,
  intensity integer not null default 3 check (intensity between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (product_id, taste_profile_id)
);

create table if not exists menu_item_taste_profiles (
  menu_item_id text not null references menu_items(id) on delete cascade,
  taste_profile_id text not null references taste_profiles(id) on delete cascade,
  intensity integer not null default 3 check (intensity between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (menu_item_id, taste_profile_id)
);

create table if not exists customer_profiles (
  id text primary key,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null default '',
  avatar_placeholder text not null default '',
  preferred_login_method text not null default 'line_liff_future',
  member_since date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists feeling_tags (
  id text primary key,
  slug text not null unique,
  name text not null,
  sentiment text not null default 'neutral' check (sentiment in ('positive', 'neutral', 'negative')),
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasting_history (
  id text primary key,
  customer_id text not null references customer_profiles(id) on delete cascade,
  menu_item_id text references menu_items(id) on delete set null,
  product_id text references products(id) on delete set null,
  tasted_at timestamptz not null default now(),
  rating integer not null check (rating between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (menu_item_id is not null or product_id is not null)
);

create table if not exists tasting_history_feeling_tags (
  tasting_id text not null references tasting_history(id) on delete cascade,
  feeling_tag_id text not null references feeling_tags(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (tasting_id, feeling_tag_id)
);

create table if not exists favorites (
  id text primary key,
  customer_id text not null references customer_profiles(id) on delete cascade,
  menu_item_id text references menu_items(id) on delete cascade,
  product_id text references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (menu_item_id is not null or product_id is not null)
);

create table if not exists customer_taste_profile_scores (
  id text primary key,
  customer_id text not null references customer_profiles(id) on delete cascade,
  taste_profile_id text not null references taste_profiles(id) on delete cascade,
  score integer not null default 0 check (score between 0 and 100),
  sample_count integer not null default 0 check (sample_count >= 0),
  last_updated_at timestamptz not null default now(),
  unique (customer_id, taste_profile_id)
);

create unique index if not exists favorites_customer_menu_item_unique
  on favorites(customer_id, menu_item_id)
  where menu_item_id is not null;

create unique index if not exists favorites_customer_product_unique
  on favorites(customer_id, product_id)
  where product_id is not null;

create index if not exists products_product_type_status_idx on products(product_type, status);
create index if not exists products_seasonal_window_idx on products(is_seasonal, available_from, available_until);
create index if not exists menu_categories_active_sort_idx on menu_categories(is_active, sort_order);
create index if not exists menu_items_category_active_sort_idx on menu_items(category_id, is_active, sort_order);
create index if not exists menu_item_products_menu_item_idx on menu_item_products(menu_item_id, is_active, sort_order);
create index if not exists specials_category_sort_idx on specials(special_category, sort_order);
create index if not exists tasting_history_customer_tasted_at_idx on tasting_history(customer_id, tasted_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at before update on products for each row execute function set_updated_at();

drop trigger if exists coffee_beans_set_updated_at on coffee_beans;
create trigger coffee_beans_set_updated_at before update on coffee_beans for each row execute function set_updated_at();

drop trigger if exists matcha_products_set_updated_at on matcha_products;
create trigger matcha_products_set_updated_at before update on matcha_products for each row execute function set_updated_at();

drop trigger if exists craft_cocoa_products_set_updated_at on craft_cocoa_products;
create trigger craft_cocoa_products_set_updated_at before update on craft_cocoa_products for each row execute function set_updated_at();

drop trigger if exists menu_categories_set_updated_at on menu_categories;
create trigger menu_categories_set_updated_at before update on menu_categories for each row execute function set_updated_at();

drop trigger if exists menu_items_set_updated_at on menu_items;
create trigger menu_items_set_updated_at before update on menu_items for each row execute function set_updated_at();

drop trigger if exists menu_item_products_set_updated_at on menu_item_products;
create trigger menu_item_products_set_updated_at before update on menu_item_products for each row execute function set_updated_at();

drop trigger if exists specials_set_updated_at on specials;
create trigger specials_set_updated_at before update on specials for each row execute function set_updated_at();

drop trigger if exists taste_profiles_set_updated_at on taste_profiles;
create trigger taste_profiles_set_updated_at before update on taste_profiles for each row execute function set_updated_at();

drop trigger if exists customer_profiles_set_updated_at on customer_profiles;
create trigger customer_profiles_set_updated_at before update on customer_profiles for each row execute function set_updated_at();

drop trigger if exists feeling_tags_set_updated_at on feeling_tags;
create trigger feeling_tags_set_updated_at before update on feeling_tags for each row execute function set_updated_at();

drop trigger if exists tasting_history_set_updated_at on tasting_history;
create trigger tasting_history_set_updated_at before update on tasting_history for each row execute function set_updated_at();
