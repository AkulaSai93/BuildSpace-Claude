-- Run after reorganize-images.sh has moved thumbnails into
-- public/images/projects/<slug>/thumbnail.<ext>. Updates each project's
-- stored thumbnail path in Supabase to match the new structure.

update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/ecommerce-platform/thumbnail.jpeg"') where slug = 'ecommerce-platform';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/realtime-chat/thumbnail.png"') where slug = 'realtime-chat';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/ai-resume-builder/thumbnail.png"') where slug = 'ai-resume-builder';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/netflix-clone/thumbnail.png"') where slug = 'netflix-clone';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/microservices-architecture/thumbnail.png"') where slug = 'microservices-architecture';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/social-media-dashboard/thumbnail.png"') where slug = 'social-media-dashboard';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/task-management-api/thumbnail.png"') where slug = 'task-management-api';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/fitness-tracker-mobile/thumbnail.png"') where slug = 'fitness-tracker-mobile';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/nft-marketplace/thumbnail.png"') where slug = 'nft-marketplace';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/vulnerability-scanner/thumbnail.png"') where slug = 'vulnerability-scanner';
update public.projects set data = jsonb_set(data, '{thumbnail}', '"/images/projects/smart-home-hub/thumbnail.png"') where slug = 'smart-home-hub';
