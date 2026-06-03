insert into taste_profiles (id, slug, name, description, sort_order, is_active) values
  ('floral', 'floral', 'Floral', 'Aromatic, blossom-like notes with an elegant finish.', 1, true),
  ('fruity', 'fruity', 'Fruity', 'Ripe fruit sweetness and expressive natural aromatics.', 2, true),
  ('tea-like', 'tea-like', 'Tea-like', 'Light body, clarity, and a delicate brewed-tea texture.', 3, true),
  ('juicy', 'juicy', 'Juicy', 'Lively acidity with a mouthwatering, saturated finish.', 4, true),
  ('chocolate', 'chocolate', 'Chocolate', 'Cacao, brownie, malt, or dark chocolate impressions.', 5, true),
  ('nutty', 'nutty', 'Nutty', 'Almond, hazelnut, cashew, or roasted nut comfort.', 6, true),
  ('sweet', 'sweet', 'Sweet', 'Caramelized, honeyed, or brown-sugar sweetness.', 7, true),
  ('creamy', 'creamy', 'Creamy', 'Soft texture, milk harmony, and rounded body.', 8, true),
  ('refreshing', 'refreshing', 'Refreshing', 'Clean, bright, chilled, or sparkling drinking experience.', 9, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into products (
  id, slug, name, product_type, status, price, description, flavor_notes,
  image_placeholder, available_for, origin, region, producer, process,
  roast_level, is_seasonal, available_from, available_until,
  is_house_blend, house_blend_order, house_blend_label
) values
  ('product-house-classic', 'house-classic', 'House Classic Blend', 'coffee_bean', 'active', 95, 'A balanced espresso blend built for the daily Pinoc cup, with depth and approachable sweetness.', array['Dark chocolate','Hazelnut','Brown sugar'], 'Warm coffee beans with chocolate-toned shadows', 'Americano, Latte, Cappuccino', 'Brazil, Colombia', null, null, 'Washed and natural blend', 'Medium', false, '2026-06-01', null, true, 1, 'House Blend No.1'),
  ('product-house-cacao', 'house-cacao', 'House Cacao Blend', 'coffee_bean', 'active', 95, 'A deeper house option for guests who prefer a long cocoa finish and low acidity.', array['Cacao nib','Toasted almond','Molasses'], 'Espresso crema over dark cacao tones', 'Americano, Latte, Cappuccino', 'Brazil, Thailand', null, null, 'Natural and honey blend', 'Medium-Dark', false, '2026-06-01', null, true, 2, 'House Blend No.2'),
  ('product-house-citrus', 'house-citrus', 'House Citrus Blend', 'coffee_bean', 'active', 105, 'A brighter house profile for clean black coffee with honeyed citrus lift.', array['Orange zest','Honey','Milk chocolate'], 'Coffee cup with pale citrus highlights', 'Americano', 'Colombia, Ethiopia', null, null, 'Washed blend', 'Medium-Light', false, '2026-06-01', null, true, 3, 'House Blend No.3'),
  ('product-house-velvet', 'house-velvet', 'House Velvet Blend', 'coffee_bean', 'active', 110, 'A soft, rounded espresso blend selected for creamy milk coffee and gentle Americanos.', array['Caramel','Cream','Pecan'], 'Silky latte art in a warm ceramic cup', 'Americano, Latte', 'Guatemala, Brazil', null, null, 'Washed and pulped natural blend', 'Medium', false, '2026-06-01', null, true, 4, 'House Velvet'),
  ('product-ethiopia-guji-natural', 'ethiopia-guji-natural', 'Ethiopia Guji Natural', 'coffee_bean', 'active', 180, 'A fruit-driven seasonal filter coffee with fragrance, layered sweetness, and tea-like body.', array['Strawberry','Jasmine','Ripe peach'], 'Light roast beans with floral linen backdrop', 'Filter Coffee', 'Ethiopia', 'Guji', null, 'Natural', 'Light', true, '2026-06-01', '2026-06-30', false, null, null),
  ('product-colombia-pink-bourbon', 'colombia-pink-bourbon', 'Colombia Pink Bourbon', 'coffee_bean', 'active', 190, 'A refined Colombian lot with sparkling acidity, elegant sweetness, and a polished floral finish.', array['Red apple','Orange blossom','Honey'], 'Clear filter brew with red fruit accents', 'Filter Coffee', 'Colombia', 'Huila', null, 'Washed', 'Light', true, '2026-06-01', '2026-06-30', false, null, null),
  ('product-thailand-mae-suai', 'thailand-mae-suai', 'Thailand Mae Suai', 'coffee_bean', 'active', 160, 'A local highland coffee with balanced structure, comforting sweetness, and a clean nutty finish.', array['Macadamia','Palm sugar','Mandarin'], 'Thai highland coffee beside warm wood', 'Filter Coffee', 'Thailand', 'Chiang Rai', 'Mae Suai community lot', 'Honey', 'Medium-Light', true, '2026-06-01', '2026-06-30', false, null, null),
  ('product-uji-ceremonial-matcha', 'uji-ceremonial-matcha', 'Uji Ceremonial Matcha', 'matcha', 'active', 150, 'Stone-milled ceremonial matcha with vivid color, soft umami, and a calm sweet finish.', array['Umami','Young grass','Sweet cream'], 'Fine green matcha powder with bamboo whisk', 'Ceremonial Matcha, Matcha Latte', 'Uji, Kyoto', null, null, 'Stone-milled tencha', null, false, null, null, false, null, null),
  ('product-yame-latte-matcha', 'yame-latte-matcha', 'Yame Latte Matcha', 'matcha', 'active', 155, 'A richer latte-grade matcha selected for milk drinks, creamy body, and low bitterness.', array['White chocolate','Fresh cream','Green tea'], 'Layered matcha latte in clear glass', 'Matcha Latte, Iced Matcha Latte', 'Yame, Fukuoka', null, null, 'Stone-milled tencha', null, false, null, null, false, null, null),
  ('product-ghana-cocoa', 'single-origin-ghana-cocoa', 'Single Origin Ghana Cocoa', 'craft_cocoa', 'active', 145, 'A deep single-origin cocoa with polished bitterness, soft fruit tones, and a velvet finish.', array['Cacao','Dried cherry','Molasses'], 'Dark cocoa powder and warm ceramic cup', 'Single Origin Cocoa, Cocoa Latte', 'Ghana', null, null, 'Stone-ground cocoa', null, false, null, null, false, null, null),
  ('product-madagascar-vanilla-cocoa', 'madagascar-vanilla-cocoa', 'Madagascar Vanilla Cocoa', 'craft_cocoa', 'active', 155, 'A round cocoa blend with natural vanilla aromatics and a creamy dessert-like profile.', array['Vanilla','Brownie','Toasted malt'], 'Cocoa latte surface with cream-toned highlights', 'Cocoa Latte, Iced Cocoa', 'Madagascar', null, null, 'Blended craft cocoa', null, false, null, null, false, null, null)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  product_type = excluded.product_type,
  status = excluded.status,
  price = excluded.price,
  description = excluded.description,
  flavor_notes = excluded.flavor_notes,
  image_placeholder = excluded.image_placeholder,
  available_for = excluded.available_for,
  origin = excluded.origin,
  region = excluded.region,
  producer = excluded.producer,
  process = excluded.process,
  roast_level = excluded.roast_level,
  is_seasonal = excluded.is_seasonal,
  available_from = excluded.available_from,
  available_until = excluded.available_until,
  is_house_blend = excluded.is_house_blend,
  house_blend_order = excluded.house_blend_order,
  house_blend_label = excluded.house_blend_label;

update products set
  region = case id
    when 'product-house-classic' then 'Cerrado Mineiro, Huila'
    when 'product-house-cacao' then 'Minas Gerais, Chiang Rai'
    when 'product-house-citrus' then 'Huila, Yirgacheffe'
    when 'product-house-velvet' then 'Antigua, Cerrado Mineiro'
    when 'product-ethiopia-guji-natural' then 'Guji'
    when 'product-colombia-pink-bourbon' then 'Huila'
    when 'product-thailand-mae-suai' then 'Chiang Rai'
    when 'product-uji-ceremonial-matcha' then 'Kyoto'
    when 'product-yame-latte-matcha' then 'Fukuoka'
    when 'product-ghana-cocoa' then 'Ashanti'
    when 'product-madagascar-vanilla-cocoa' then 'Sambirano Valley'
    else region
  end,
  producer = case id
    when 'product-house-classic' then 'Pinoc house blend program'
    when 'product-house-cacao' then 'Pinoc house blend program'
    when 'product-house-citrus' then 'Pinoc house blend program'
    when 'product-house-velvet' then 'Pinoc house blend program'
    when 'product-ethiopia-guji-natural' then 'Guji smallholder community lot'
    when 'product-colombia-pink-bourbon' then 'Huila Pink Bourbon producers'
    when 'product-thailand-mae-suai' then 'Mae Suai community lot'
    when 'product-uji-ceremonial-matcha' then 'Uji tea growers'
    when 'product-yame-latte-matcha' then 'Yame tea growers'
    when 'product-ghana-cocoa' then 'Single-origin Ghana cocoa cooperative'
    when 'product-madagascar-vanilla-cocoa' then 'Madagascar cocoa and vanilla blend'
    else producer
  end,
  altitude = case id
    when 'product-house-classic' then '1,100-1,800 masl'
    when 'product-house-cacao' then '1,000-1,450 masl'
    when 'product-house-citrus' then '1,650-2,000 masl'
    when 'product-house-velvet' then '1,200-1,700 masl'
    when 'product-ethiopia-guji-natural' then '1,950-2,150 masl'
    when 'product-colombia-pink-bourbon' then '1,750-1,950 masl'
    when 'product-thailand-mae-suai' then '1,250-1,450 masl'
    else altitude
  end,
  variety = case id
    when 'product-house-classic' then 'Catuai, Castillo'
    when 'product-house-cacao' then 'Catuai, Typica'
    when 'product-house-citrus' then 'Pink Bourbon, Heirloom'
    when 'product-house-velvet' then 'Bourbon, Catuai'
    when 'product-ethiopia-guji-natural' then 'Ethiopian heirloom'
    when 'product-colombia-pink-bourbon' then 'Pink Bourbon'
    when 'product-thailand-mae-suai' then 'Typica, Catuai'
    when 'product-uji-ceremonial-matcha' then 'Tencha blend'
    when 'product-yame-latte-matcha' then 'Latte-grade tencha blend'
    when 'product-ghana-cocoa' then 'Forastero cocoa'
    when 'product-madagascar-vanilla-cocoa' then 'Trinitario cocoa'
    else variety
  end,
  brew_recommendation = case id
    when 'product-house-classic' then 'Best for balanced espresso, Americano, and milk drinks with a chocolate-nut finish.'
    when 'product-house-cacao' then 'Best when pulled as espresso for a deeper cocoa body and low-acidity Americano.'
    when 'product-house-citrus' then 'Best as a black coffee option for guests who want honeyed citrus and clarity.'
    when 'product-house-velvet' then 'Best for latte and soft Americano profiles where creamy texture is the goal.'
    when 'product-ethiopia-guji-natural' then 'Best as hand-brewed filter with a gentle pour and slightly lower agitation.'
    when 'product-colombia-pink-bourbon' then 'Best as filter coffee for floral aromatics, sparkling acidity, and honey sweetness.'
    when 'product-thailand-mae-suai' then 'Best as filter coffee for a rounded local-origin cup with palm sugar sweetness.'
    when 'product-uji-ceremonial-matcha' then 'Best whisked with water for a pure ceremonial cup or lightly sweetened over ice.'
    when 'product-yame-latte-matcha' then 'Best with milk where creamy body and soft green tea sweetness are desired.'
    when 'product-ghana-cocoa' then 'Best as single-origin cocoa with minimal sweetness to show cacao depth.'
    when 'product-madagascar-vanilla-cocoa' then 'Best as a cocoa latte or iced cocoa for creamy dessert-like sweetness.'
    else brew_recommendation
  end
where id in (
  'product-house-classic',
  'product-house-cacao',
  'product-house-citrus',
  'product-house-velvet',
  'product-ethiopia-guji-natural',
  'product-colombia-pink-bourbon',
  'product-thailand-mae-suai',
  'product-uji-ceremonial-matcha',
  'product-yame-latte-matcha',
  'product-ghana-cocoa',
  'product-madagascar-vanilla-cocoa'
);

insert into coffee_beans (product_id, origin, region, producer, process, roast_level, is_house_blend, is_filter_option) values
  ('product-house-classic', 'Brazil, Colombia', null, null, 'Washed and natural blend', 'Medium', true, false),
  ('product-house-cacao', 'Brazil, Thailand', null, null, 'Natural and honey blend', 'Medium-Dark', true, false),
  ('product-house-citrus', 'Colombia, Ethiopia', null, null, 'Washed blend', 'Medium-Light', true, false),
  ('product-house-velvet', 'Guatemala, Brazil', null, null, 'Washed and pulped natural blend', 'Medium', true, false),
  ('product-ethiopia-guji-natural', 'Ethiopia', 'Guji', null, 'Natural', 'Light', false, true),
  ('product-colombia-pink-bourbon', 'Colombia', 'Huila', null, 'Washed', 'Light', false, true),
  ('product-thailand-mae-suai', 'Thailand', 'Chiang Rai', 'Mae Suai community lot', 'Honey', 'Medium-Light', false, true)
on conflict (product_id) do update set
  origin = excluded.origin,
  region = excluded.region,
  producer = excluded.producer,
  process = excluded.process,
  roast_level = excluded.roast_level,
  is_house_blend = excluded.is_house_blend,
  is_filter_option = excluded.is_filter_option;

update coffee_beans set
  altitude = products.altitude,
  variety = products.variety,
  brew_recommendation = products.brew_recommendation
from products
where coffee_beans.product_id = products.id;

insert into matcha_products (product_id, grade, origin_region, preparation_notes) values
  ('product-uji-ceremonial-matcha', 'ceremonial', 'Uji, Kyoto', 'Whisk with water for a pure expression.'),
  ('product-yame-latte-matcha', 'latte', 'Yame, Fukuoka', 'Built for milk texture and low bitterness.')
on conflict (product_id) do update set
  grade = excluded.grade,
  origin_region = excluded.origin_region,
  preparation_notes = excluded.preparation_notes;

update matcha_products set
  brew_recommendation = products.brew_recommendation
from products
where matcha_products.product_id = products.id;

insert into craft_cocoa_products (product_id, cocoa_origin, cocoa_percentage, preparation_notes) values
  ('product-ghana-cocoa', 'Ghana', 70, 'Prepared to highlight origin depth and polished bitterness.'),
  ('product-madagascar-vanilla-cocoa', 'Madagascar', 62, 'Designed for cocoa latte and iced cocoa.')
on conflict (product_id) do update set
  cocoa_origin = excluded.cocoa_origin,
  cocoa_percentage = excluded.cocoa_percentage,
  preparation_notes = excluded.preparation_notes;

update craft_cocoa_products set
  brew_recommendation = products.brew_recommendation
from products
where craft_cocoa_products.product_id = products.id;

insert into menu_categories (id, slug, name, description, sort_order, is_active) values
  ('classic-coffee', 'classic-coffee', 'Classic Coffee', 'Espresso-based signatures built around balance, texture, and a refined specialty finish.', 1, true),
  ('filter-coffee', 'filter-coffee', 'Filter Coffee', 'Rotating seasonal beans brewed for clarity, aroma, and origin character.', 2, true),
  ('matcha', 'matcha', 'Matcha', 'Ceremonial green tea prepared for calm sweetness, umami, and a creamy finish.', 3, true),
  ('craft-cocoa', 'craft-cocoa', 'Craft Cocoa', 'Premium cocoa drinks with origin depth, velvet body, and polished sweetness.', 4, true),
  ('cold-brew-japan-traditional', 'cold-brew-japan-traditional', 'Cold Brew [Japan Traditional]', 'Slow, patient cold brew inspired by Japanese extraction rituals and quiet clarity.', 5, true),
  ('special', 'special', 'Special', 'Seasonal signatures across coffee, non-coffee, and cold brew expressions.', 6, true)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into menu_items (
  id, slug, name, category_id, price, description, flavor_notes,
  recommended_for, image_placeholder, is_active, status, is_seasonal,
  available_from, available_until, classic_group, sort_order
) values
  ('item-americano', 'americano', 'Americano', 'classic-coffee', 95, 'A clean espresso-forward cup lengthened with hot water, available with rotating house bean options.', array['Cocoa','Roasted nuts','Brown sugar'], 'Guests choosing between several House Blend expressions.', 'Clear black coffee in a warm ceramic cup', true, 'active', false, null, null, 'black_coffee', 1),
  ('item-latte', 'latte', 'Latte', 'classic-coffee', 120, 'Silky steamed milk folded into a balanced espresso base for a soft, rounded cup.', array['Milk chocolate','Caramel','Roasted almond'], 'A smooth everyday cup with gentle sweetness and texture.', 'Latte art with a cream-toned ceramic cup', true, 'active', false, null, null, 'milk_coffee', 2),
  ('item-cappuccino', 'cappuccino', 'Cappuccino', 'classic-coffee', 115, 'A tighter espresso and milk expression with plush microfoam and aromatic intensity.', array['Cacao nib','Hazelnut','Cream'], 'A richer milk coffee with a clear espresso presence.', 'Small cappuccino cup with dense microfoam', true, 'active', false, null, null, 'milk_coffee', 3),
  ('item-ethiopia-guji-natural', 'ethiopia-guji-natural', 'Ethiopia Guji Natural', 'filter-coffee', 180, 'A fruit-driven natural process coffee brewed for fragrance, layered sweetness, and tea-like body.', array['Strawberry','Jasmine','Ripe peach'], 'Guests looking for a vibrant, aromatic filter coffee.', 'Light filter coffee with floral accents', true, 'active', true, '2026-06-01', '2026-06-30', 'none', 1),
  ('item-colombia-pink-bourbon', 'colombia-pink-bourbon', 'Colombia Pink Bourbon', 'filter-coffee', 190, 'A refined Colombian lot with sparkling acidity, elegant sweetness, and a polished floral finish.', array['Red apple','Orange blossom','Honey'], 'A bright and graceful cup with delicate complexity.', 'Filter brew with red fruit and honey tones', true, 'active', true, '2026-06-01', '2026-06-30', 'none', 2),
  ('item-thailand-mae-suai', 'thailand-mae-suai', 'Thailand Mae Suai', 'filter-coffee', 160, 'A highland Thai coffee with comforting sweetness, balanced structure, and a clean nutty finish.', array['Macadamia','Palm sugar','Mandarin'], 'A balanced local origin with quiet elegance.', 'Thai filter coffee with warm wood texture', true, 'active', true, '2026-06-01', '2026-06-30', 'none', 3),
  ('item-ceremonial-matcha', 'ceremonial-matcha', 'Ceremonial Matcha', 'matcha', 150, 'Stone-milled ceremonial matcha whisked with water for a pure, velvety expression.', array['Umami','Young grass','Sweet cream'], 'A calm, focused matcha experience without milk.', 'Ceremonial matcha bowl and bamboo whisk', true, 'active', false, null, null, 'none', 1),
  ('item-matcha-latte', 'matcha-latte', 'Matcha Latte', 'matcha', 155, 'Ceremonial matcha blended with steamed milk for a creamy cup with soft sweetness.', array['White chocolate','Fresh cream','Green tea'], 'Guests who enjoy matcha with a smoother, milk-led profile.', 'Layered green matcha latte in glass', true, 'active', false, null, null, 'none', 2),
  ('item-single-origin-cocoa', 'single-origin-cocoa', 'Single Origin Cocoa', 'craft-cocoa', 145, 'Single-origin cocoa prepared to highlight deep cacao character and natural fruit tones.', array['Cacao','Dried cherry','Molasses'], 'A rich cocoa cup with origin character and minimal sweetness.', 'Dark cocoa in a small ceramic cup', true, 'active', false, null, null, 'none', 1),
  ('item-cocoa-latte', 'cocoa-latte', 'Cocoa Latte', 'craft-cocoa', 150, 'Craft cocoa and textured milk composed into a plush, dessert-like cup.', array['Dark chocolate','Vanilla','Toasted malt'], 'Guests looking for a comforting, premium non-coffee option.', 'Cocoa latte with a soft cream surface', true, 'active', false, null, null, 'none', 2),
  ('item-orange-espresso-tonic', 'orange-espresso-tonic', 'Orange Espresso Tonic', 'special', 165, 'Sparkling tonic layered with espresso and orange aromatics for a bright seasonal signature.', array['Orange zest','Cacao','Sparkling citrus'], 'Guests who want a bright coffee special served cold.', 'Iced espresso tonic with orange peel', true, 'active', false, null, null, 'none', 1),
  ('item-matcha-cocoa-cloud', 'matcha-cocoa-cloud', 'Matcha Cocoa Cloud', 'special', 175, 'Layered matcha, craft cocoa, and soft cream for a luxurious non-coffee signature.', array['Matcha cream','Dark cocoa','Vanilla'], 'Guests looking for a rich non-coffee special.', 'Layered matcha cocoa drink with cream cap', true, 'active', false, null, null, 'none', 2),
  ('item-cacao-cold-brew', 'cacao-cold-brew', 'Cacao Cold Brew', 'special', 170, 'Cold brew coffee finished with cacao aromatics for a deep chilled profile.', array['Cacao','Raisin','Brown sugar'], 'Guests who enjoy cold brew with a chocolate-toned finish.', 'Cold brew over ice with cacao tones', true, 'active', false, null, null, 'none', 3)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  flavor_notes = excluded.flavor_notes,
  recommended_for = excluded.recommended_for,
  image_placeholder = excluded.image_placeholder,
  is_active = excluded.is_active,
  status = excluded.status,
  is_seasonal = excluded.is_seasonal,
  available_from = excluded.available_from,
  available_until = excluded.available_until,
  classic_group = excluded.classic_group,
  sort_order = excluded.sort_order;

insert into menu_item_products (id, menu_item_id, product_id, role, is_default, is_active, sort_order, available_from, available_until) values
  ('mip-americano-house-classic', 'item-americano', 'product-house-classic', 'default', true, true, 1, null, null),
  ('mip-americano-house-cacao', 'item-americano', 'product-house-cacao', 'option', false, true, 2, null, null),
  ('mip-americano-house-citrus', 'item-americano', 'product-house-citrus', 'option', false, true, 3, null, null),
  ('mip-americano-house-velvet', 'item-americano', 'product-house-velvet', 'option', false, true, 4, null, null),
  ('mip-latte-house-velvet', 'item-latte', 'product-house-velvet', 'default', true, true, 1, null, null),
  ('mip-cappuccino-house-classic', 'item-cappuccino', 'product-house-classic', 'default', true, true, 1, null, null),
  ('mip-filter-guji', 'item-ethiopia-guji-natural', 'product-ethiopia-guji-natural', 'seasonal_option', true, true, 1, '2026-06-01', '2026-06-30'),
  ('mip-filter-pink-bourbon', 'item-colombia-pink-bourbon', 'product-colombia-pink-bourbon', 'seasonal_option', true, true, 1, '2026-06-01', '2026-06-30'),
  ('mip-filter-mae-suai', 'item-thailand-mae-suai', 'product-thailand-mae-suai', 'seasonal_option', true, true, 1, '2026-06-01', '2026-06-30'),
  ('mip-ceremonial-matcha-uji', 'item-ceremonial-matcha', 'product-uji-ceremonial-matcha', 'base', true, true, 1, null, null),
  ('mip-matcha-latte-yame', 'item-matcha-latte', 'product-yame-latte-matcha', 'base', true, true, 1, null, null),
  ('mip-cocoa-single-ghana', 'item-single-origin-cocoa', 'product-ghana-cocoa', 'base', true, true, 1, null, null),
  ('mip-cocoa-latte-madagascar', 'item-cocoa-latte', 'product-madagascar-vanilla-cocoa', 'base', true, true, 1, null, null)
on conflict (id) do update set
  menu_item_id = excluded.menu_item_id,
  product_id = excluded.product_id,
  role = excluded.role,
  is_default = excluded.is_default,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  available_from = excluded.available_from,
  available_until = excluded.available_until;

insert into specials (id, menu_item_id, special_category, is_featured, sort_order) values
  ('smi-orange-tonic', 'item-orange-espresso-tonic', 'coffee', true, 1),
  ('smi-matcha-cocoa-cloud', 'item-matcha-cocoa-cloud', 'non_coffee', true, 1),
  ('smi-cacao-cold-brew', 'item-cacao-cold-brew', 'cold_brew', true, 1)
on conflict (id) do update set
  menu_item_id = excluded.menu_item_id,
  special_category = excluded.special_category,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order;

update specials set
  visibility = 'visible',
  menu_label = case id
    when 'smi-orange-tonic' then 'seasonal'
    when 'smi-matcha-cocoa-cloud' then 'new'
    when 'smi-cacao-cold-brew' then 'limited'
    else menu_label
  end,
  available_from = coalesce(available_from, '2026-06-01'),
  available_until = coalesce(available_until, '2026-06-30')
where id in (
  'smi-orange-tonic',
  'smi-matcha-cocoa-cloud',
  'smi-cacao-cold-brew'
);

insert into customer_profiles (id, display_name, avatar_placeholder, preferred_login_method, member_since) values
  ('customer-pinoc-demo', 'Pinoc Member', 'Warm profile circle with coffee cream tones', 'mock', '2026-05-18')
on conflict (id) do update set
  display_name = excluded.display_name,
  avatar_placeholder = excluded.avatar_placeholder,
  preferred_login_method = excluded.preferred_login_method,
  member_since = excluded.member_since;

insert into feeling_tags (id, slug, name, sentiment, description, sort_order, is_active) values
  ('liked', 'liked', 'Liked', 'positive', 'A cup the member enjoyed and may want again.', 1, true),
  ('too-sweet', 'too-sweet', 'Too Sweet', 'negative', 'Sweeter than the member prefers.', 2, true),
  ('too-acidic', 'too-acidic', 'Too Acidic', 'negative', 'Acidity felt sharper than expected.', 3, true),
  ('refreshing', 'refreshing', 'Refreshing', 'positive', 'Clean, bright, cooling, or sparkling.', 4, true),
  ('creamy', 'creamy', 'Creamy', 'positive', 'Soft texture and rounded body.', 5, true),
  ('want-again', 'want-again', 'Want Again', 'positive', 'Strong repeat signal for recommendations.', 6, true)
on conflict (id) do update set
  name = excluded.name,
  sentiment = excluded.sentiment,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into tasting_history (id, customer_id, menu_item_id, product_id, tasted_at, rating, note) values
  ('tasting-americano-001', 'customer-pinoc-demo', 'item-americano', null, '2026-05-24T09:30:00.000Z', 4, 'Loved the cacao finish with the House Classic profile.'),
  ('tasting-guji-001', 'customer-pinoc-demo', 'item-ethiopia-guji-natural', 'product-ethiopia-guji-natural', '2026-05-28T11:15:00.000Z', 5, 'Very aromatic and juicy, especially as it cooled.'),
  ('tasting-matcha-latte-001', 'customer-pinoc-demo', 'item-matcha-latte', null, '2026-05-30T14:45:00.000Z', 4, 'Smooth, not too bitter.')
on conflict (id) do update set
  customer_id = excluded.customer_id,
  menu_item_id = excluded.menu_item_id,
  product_id = excluded.product_id,
  tasted_at = excluded.tasted_at,
  rating = excluded.rating,
  note = excluded.note;

insert into tasting_history_feeling_tags (tasting_id, feeling_tag_id) values
  ('tasting-americano-001', 'liked'),
  ('tasting-americano-001', 'want-again'),
  ('tasting-guji-001', 'liked'),
  ('tasting-guji-001', 'refreshing'),
  ('tasting-guji-001', 'want-again'),
  ('tasting-matcha-latte-001', 'creamy'),
  ('tasting-matcha-latte-001', 'liked')
on conflict do nothing;

insert into favorites (id, customer_id, menu_item_id, product_id, created_at) values
  ('favorite-americano', 'customer-pinoc-demo', 'item-americano', null, '2026-05-24T09:35:00.000Z'),
  ('favorite-guji', 'customer-pinoc-demo', 'item-ethiopia-guji-natural', 'product-ethiopia-guji-natural', '2026-05-28T11:18:00.000Z')
on conflict (id) do update set
  customer_id = excluded.customer_id,
  menu_item_id = excluded.menu_item_id,
  product_id = excluded.product_id,
  created_at = excluded.created_at;

insert into customer_taste_profile_scores (id, customer_id, taste_profile_id, score, sample_count, last_updated_at) values
  ('score-chocolate', 'customer-pinoc-demo', 'chocolate', 82, 4, '2026-05-30T15:00:00.000Z'),
  ('score-refreshing', 'customer-pinoc-demo', 'refreshing', 76, 3, '2026-05-30T15:00:00.000Z'),
  ('score-creamy', 'customer-pinoc-demo', 'creamy', 71, 3, '2026-05-30T15:00:00.000Z'),
  ('score-floral', 'customer-pinoc-demo', 'floral', 64, 2, '2026-05-30T15:00:00.000Z')
on conflict (id) do update set
  customer_id = excluded.customer_id,
  taste_profile_id = excluded.taste_profile_id,
  score = excluded.score,
  sample_count = excluded.sample_count,
  last_updated_at = excluded.last_updated_at;
