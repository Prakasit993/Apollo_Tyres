-- Add hero image URL setting to site settings
-- This allows admin to change the homepage hero background image

INSERT INTO public.tyres_site_settings (key, value, description)
VALUES (
    'hero_image_url',
    'images/shop-gallery/111.jpg',
    'Path or URL for the homepage hero background image. Can be a relative path (images/...) or full URL.'
)
ON CONFLICT (key) DO NOTHING;
