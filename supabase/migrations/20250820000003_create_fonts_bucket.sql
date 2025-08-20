/* Create a public storage bucket for font files */

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fonts', 'fonts', true, 52428800, null)
on conflict (id) do update set 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = null;

