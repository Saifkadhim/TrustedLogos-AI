/* Seed some example fonts */

INSERT INTO fonts (name, designer, category, style, tags, license, formats, weights, featured, is_public, downloads, likes, rating)
VALUES
('Modern Sans Pro', 'Type Foundry', 'Sans Serif', 'Modern', '["sans-serif","modern","clean","professional"]', 'Commercial License', '["TTF","OTF","WOFF","WOFF2"]', '["Light","Regular","Medium","Bold","Black"]', true, true, 25430, 1234, 4.9),
('Vintage Serif', 'Classic Types', 'Serif', 'Vintage', '["serif","vintage","classic","elegant"]', 'Personal Use Free', '["TTF","OTF"]', '["Regular","Bold"]', false, true, 11200, 678, 4.7),
('Tech Mono', 'Code Fonts', 'Monospace', 'Technical', '["monospace","code","technical","programming"]', 'Open Source', '["TTF","OTF","WOFF"]', '["Light","Regular","Bold"]', true, true, 18900, 945, 4.8);

