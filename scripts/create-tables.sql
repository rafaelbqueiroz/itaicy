-- Criação das tabelas do CMS no Supabase
-- Executar no SQL Editor do Supabase

-- Páginas publicáveis
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  template text not null default 'default',
  priority int not null default 0,
  created_at timestamptz default now()
);

-- Blocos flexíveis (draft / published)
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  type text not null,
  position int not null,
  payload jsonb not null,
  published jsonb,
  updated_at timestamptz default now(),
  constraint blocks_unique unique(page_id, position)
);

-- Mídia (metadados)
create table if not exists media_library (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  alt text,
  created_at timestamptz default now()
);

-- Suítes (inventário específico)
create table if not exists suites (
  id uuid primary key default gen_random_uuid(),
  name text,
  capacity int,
  area_m2 int,
  price numeric(10,2),
  description text,
  images uuid[]
);

-- Testemunhos
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author text,
  city text,
  rating int check (rating between 1 and 5),
  quote text,
  is_featured boolean default false
);

-- RLS (Row Level Security) policies
alter table pages enable row level security;
alter table blocks enable row level security;
alter table media_library enable row level security;
alter table suites enable row level security;
alter table testimonials enable row level security;

-- Políticas para admin (assumindo que role = 'admin' ou authenticated)
create policy "Admin can manage pages" on pages
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage blocks" on blocks
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage media" on media_library
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage suites" on suites
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage testimonials" on testimonials
  for all using (auth.role() = 'authenticated');

-- Políticas públicas para leitura (apenas published content)
create policy "Public can read published pages" on pages
  for select using (true);

create policy "Public can read published blocks" on blocks
  for select using (published is not null);

-- Criar bucket para mídia (se não existir)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Política para bucket de mídia
create policy "Public can view media" on storage.objects
  for select using (bucket_id = 'media');

create policy "Admin can manage media files" on storage.objects
  for all using (auth.role() = 'authenticated' and bucket_id = 'media');