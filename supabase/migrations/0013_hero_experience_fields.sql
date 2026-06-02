alter table hero_content
  add column if not exists tasting_note text not null default '',
  add column if not exists cta_label text not null default 'Find Your Cup',
  add column if not exists cta_href text not null default '/find-your-cup';

update hero_content
set
  tasting_note = coalesce(nullif(tasting_note, ''), 'Seasonal pours, precise texture, and quiet signatures for the cup your mood is asking for.'),
  cta_label = coalesce(nullif(cta_label, ''), 'Find Your Cup'),
  cta_href = coalesce(nullif(cta_href, ''), '/find-your-cup')
where id = 'home';

notify pgrst, 'reload schema';
