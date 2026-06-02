alter table products
  add column if not exists is_house_blend boolean not null default false,
  add column if not exists house_blend_order integer,
  add column if not exists house_blend_label text;

create index if not exists products_house_blend_idx
  on products(product_type, status, is_house_blend, house_blend_order, name);

notify pgrst, 'reload schema';
