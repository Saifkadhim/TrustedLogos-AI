# Books System Setup Guide

This guide will help you set up the books functionality in your Supabase database for the TrustedLogos learning platform.

## 📋 Overview

The books system consists of:
- **Book Categories**: Logo Books, Brand Identity Books, Typography Books, Business Books, Other Graphic Design Books
- **Books Database**: Complete book information with ratings, links, and metadata
- **Security**: Row Level Security (RLS) policies for public read and admin write access

## 🚀 Step-by-Step Setup

### Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Navigate to your project: `amgzjhmaggmzvzcuhckq`
4. Go to **SQL Editor** in the left sidebar

### Step 2: Run the Migration Files

You have two migration files to run in order:

#### 2.1 Create Tables and Structure
Copy and paste the entire content of `/supabase/migrations/20250821000000_create_books_tables.sql` into the SQL Editor and click **Run**.

This will create:
- `book_categories` table with 5 predefined categories
- `books` table with all necessary fields
- Indexes for performance optimization
- Row Level Security policies
- Default book categories

#### 2.2 Populate with Sample Data
Copy and paste the entire content of `/supabase/migrations/20250821000001_seed_books_data.sql` into the SQL Editor and click **Run**.

This will populate the database with:
- 15+ curated book recommendations
- Real Amazon links and ratings
- Featured books for each category
- Complete metadata (publisher, year, pages, etc.)

### Step 3: Verify the Setup

#### 3.1 Check Tables
In the Supabase dashboard, go to **Table Editor** and verify you see:
- `book_categories` table with 5 categories
- `books` table with 15+ books

#### 3.2 Test Data
Run this query in the SQL Editor to verify everything is working:

```sql
-- Check book categories
SELECT * FROM book_categories ORDER BY sort_order;

-- Check books with categories
SELECT 
  b.title,
  b.author,
  b.rating,
  bc.name as category,
  b.is_featured
FROM books b
JOIN book_categories bc ON b.category_id = bc.id
ORDER BY bc.sort_order, b.rating DESC;

-- Check featured books
SELECT 
  b.title,
  b.author,
  bc.name as category
FROM books b
JOIN book_categories bc ON b.category_id = bc.id
WHERE b.is_featured = true
ORDER BY bc.sort_order;
```

### Step 4: Update Your Application (Optional)

If you want to connect the Learn page to real Supabase data instead of the hardcoded books, you'll need to:

1. Create a `useBooks` hook to fetch data from Supabase
2. Update the LearnPage component to use real data
3. Add admin functionality to manage books

## 📊 Database Schema

### book_categories Table
```sql
- id (uuid, primary key)
- name (text, unique) - "Logo Books", "Brand Identity Books", etc.
- description (text) - Category description
- icon (text) - Icon name for UI
- sort_order (integer) - Display order
- created_at, updated_at (timestamps)
```

### books Table
```sql
- id (uuid, primary key)
- title (text) - Book title
- author (text) - Author name(s)
- description (text) - Book description
- isbn (text) - ISBN number
- rating (decimal 0-5) - Average rating
- cover_image_url (text) - Book cover URL
- amazon_url (text) - Amazon purchase link
- goodreads_url (text) - Goodreads link
- publisher (text) - Publisher name
- publication_year (integer) - Year published
- page_count (integer) - Number of pages
- category_id (uuid) - References book_categories
- is_featured (boolean) - Featured book flag
- is_published (boolean) - Published status
- views, likes (integer) - Engagement metrics
- created_by (uuid) - Admin who added
- created_at, updated_at (timestamps)
```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on both tables
- **Public Read Access**: Anyone can view published books
- **Admin Write Access**: Only authenticated users can add/edit books
- **Performance Indexes**: Optimized for fast queries and search

## 📚 Sample Data Included

### Logo Books (3 books)
- Logo Design Love - David Airey ⭐ Featured
- Marks of Excellence - Per Mollerup  
- Symbol - Angus Hyland & Steven Bateman

### Brand Identity Books (3 books)
- Designing Brand Identity - Alina Wheeler ⭐ Featured
- Brand Identity Essentials - Kevin Budelmann, Yang Kim & Curt Wozniak
- The Brand Gap - Marty Neumeier

### Typography Books (3 books)
- Thinking with Type - Ellen Lupton ⭐ Featured
- The Elements of Typographic Style - Robert Bringhurst
- Typography Sketchbooks - Steven Heller & Lita Talarico

### Business Books (3 books)
- Building a StoryBrand - Donald Miller ⭐ Featured
- Purple Cow - Seth Godin
- Made to Stick - Chip Heath & Dan Heath

### Other Graphic Design Books (3 books)
- The Design of Everyday Things - Don Norman ⭐ Featured
- Grid Systems in Graphic Design - Josef Müller-Brockmann
- Graphic Design: The New Basics - Ellen Lupton & Jennifer Cole Phillips

## 🛠️ Next Steps

After setting up the database, you can:

1. **View the data** in Supabase Table Editor
2. **Test queries** in SQL Editor
3. **Connect your app** to use real data (optional)
4. **Add more books** through the admin interface
5. **Customize categories** as needed

## 🆘 Troubleshooting

**Issue**: Migration fails with permission errors
**Solution**: Make sure you're running the SQL as the project owner in Supabase dashboard

**Issue**: No data appears after running migrations
**Solution**: Check that both migration files were run in order

**Issue**: Books don't appear in categories
**Solution**: Verify the foreign key relationships with the test queries above

---

**🎉 That's it!** Your books system is now ready to use. The Learn page will work with this data structure.