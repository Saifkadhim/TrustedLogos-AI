/*
  # Seed books data

  This migration populates the books table with curated book recommendations
  for each category in the learning platform.
*/

-- Insert sample books for each category
-- Note: We'll use the category names to find the IDs dynamically

-- Logo Books
INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id, is_featured) 
SELECT 
  'Logo Design Love',
  'David Airey',
  'A guide to creating iconic brand identities with practical advice and real-world examples from one of the world''s most respected logo designers.',
  4.8,
  'https://amazon.com/Logo-Design-Love-Creating-Identities/dp/0321985206',
  'New Riders',
  2009,
  204,
  bc.id,
  true
FROM book_categories bc WHERE bc.name = 'Logo Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Marks of Excellence',
  'Per Mollerup',
  'The history and taxonomy of trademarks, exploring what makes a logo truly memorable and effective in the marketplace.',
  4.6,
  'https://amazon.com/Marks-Excellence-History-Taxonomy-Trademarks/dp/0714838047',
  'Phaidon Press',
  1997,
  240,
  bc.id
FROM book_categories bc WHERE bc.name = 'Logo Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Symbol',
  'Angus Hyland & Steven Bateman',
  'A comprehensive look at the art of logo design and corporate identity, featuring hundreds of examples from around the world.',
  4.7,
  'https://amazon.com/Symbol-Angus-Hyland/dp/1856697142',
  'Laurence King Publishing',
  2011,
  256,
  bc.id
FROM book_categories bc WHERE bc.name = 'Logo Books';

-- Brand Identity Books
INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id, is_featured) 
SELECT 
  'Designing Brand Identity',
  'Alina Wheeler',
  'An essential handbook for the entire branding team with proven methodologies, practical insights, and case studies.',
  4.9,
  'https://amazon.com/Designing-Brand-Identity-Essential-Branding/dp/1118980824',
  'Wiley',
  2017,
  320,
  bc.id,
  true
FROM book_categories bc WHERE bc.name = 'Brand Identity Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Brand Identity Essentials',
  'Kevin Budelmann, Yang Kim & Curt Wozniak',
  '100 principles for designing logos and building brands that create lasting connections with customers.',
  4.5,
  'https://amazon.com/Brand-Identity-Essentials-Principles-Building/dp/1592537421',
  'Rockport Publishers',
  2010,
  208,
  bc.id
FROM book_categories bc WHERE bc.name = 'Brand Identity Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'The Brand Gap',
  'Marty Neumeier',
  'How to bridge the distance between business strategy and design to create powerful, unified brand experiences.',
  4.5,
  'https://amazon.com/Brand-Gap-Distance-Business-Strategy/dp/0321348109',
  'New Riders',
  2005,
  208,
  bc.id
FROM book_categories bc WHERE bc.name = 'Brand Identity Books';

-- Typography Books
INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id, is_featured) 
SELECT 
  'Thinking with Type',
  'Ellen Lupton',
  'A critical guide for designers, writers, editors, and students covering the fundamentals of typography.',
  4.7,
  'https://amazon.com/Thinking-Type-2nd-revised-expanded/dp/1568989695',
  'Princeton Architectural Press',
  2010,
  224,
  bc.id,
  true
FROM book_categories bc WHERE bc.name = 'Typography Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'The Elements of Typographic Style',
  'Robert Bringhurst',
  'The definitive guide to typography and type design, considered the bible of typography by designers worldwide.',
  4.8,
  'https://amazon.com/Elements-Typographic-Style-Version-Anniversary/dp/0881792128',
  'Hartley & Marks',
  2012,
  398,
  bc.id
FROM book_categories bc WHERE bc.name = 'Typography Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Typography Sketchbooks',
  'Steven Heller & Lita Talarico',
  'Behind-the-scenes look at how type designers work and think, featuring sketches and insights from leading typographers.',
  4.4,
  'https://amazon.com/Typography-Sketchbooks-Steven-Heller/dp/0500241422',
  'Thames & Hudson',
  2011,
  320,
  bc.id
FROM book_categories bc WHERE bc.name = 'Typography Books';

-- Business Books
INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id, is_featured) 
SELECT 
  'Building a StoryBrand',
  'Donald Miller',
  'Clarify your message so customers will listen and buy. A proven framework for clear communication.',
  4.6,
  'https://amazon.com/Building-StoryBrand-Clarify-Message-Customers/dp/0718033329',
  'HarperCollins Leadership',
  2017,
  240,
  bc.id,
  true
FROM book_categories bc WHERE bc.name = 'Business Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Purple Cow',
  'Seth Godin',
  'Transform your business by being remarkable. A manifesto for marketers who want to make a difference.',
  4.3,
  'https://amazon.com/Purple-Cow-New-Transform-Remarkable/dp/1591843170',
  'Portfolio',
  2009,
  160,
  bc.id
FROM book_categories bc WHERE bc.name = 'Business Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Made to Stick',
  'Chip Heath & Dan Heath',
  'Why some ideas survive and others die. Discover the anatomy of ideas that stick and how to make your own stick.',
  4.5,
  'https://amazon.com/Made-Stick-Ideas-Survive-Others/dp/1400064287',
  'Random House',
  2007,
  304,
  bc.id
FROM book_categories bc WHERE bc.name = 'Business Books';

-- Other Graphic Design Books
INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id, is_featured) 
SELECT 
  'The Design of Everyday Things',
  'Don Norman',
  'Fundamental principles of good design and user experience. A classic that every designer should read.',
  4.7,
  'https://amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654',
  'Basic Books',
  2013,
  368,
  bc.id,
  true
FROM book_categories bc WHERE bc.name = 'Other Graphic Design Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Grid Systems in Graphic Design',
  'Josef Müller-Brockmann',
  'A visual communication manual for graphic designers, typographers and three dimensional designers.',
  4.8,
  'https://amazon.com/Grid-Systems-Graphic-Design-Communication/dp/3721201450',
  'Niggli',
  1996,
  176,
  bc.id
FROM book_categories bc WHERE bc.name = 'Other Graphic Design Books';

INSERT INTO books (title, author, description, rating, amazon_url, publisher, publication_year, page_count, category_id) 
SELECT 
  'Graphic Design: The New Basics',
  'Ellen Lupton & Jennifer Cole Phillips',
  'Updated fundamentals for the digital age, covering layout, typography, color, and more.',
  4.6,
  'https://amazon.com/Graphic-Design-New-Basics-2nd/dp/1616893327',
  'Princeton Architectural Press',
  2015,
  256,
  bc.id
FROM book_categories bc WHERE bc.name = 'Other Graphic Design Books';