# Books Admin Guide

This guide explains how to use the Books Admin functionality to manage learning resources in TrustedLogos.

## 🔐 Access Requirements

1. **Admin Login**: Go to `/console-setup` and sign in with admin credentials
2. **Navigate**: Click "Manage Books" in the Admin sidebar section

## 📚 Books Management Features

### 📊 Dashboard Overview
- **Statistics**: View total books, published books, featured books, and drafts
- **Search**: Find books by title, author, or description
- **Filter**: Filter books by category (Logo Books, Brand Identity Books, etc.)

### ➕ Adding New Books

Click **"Add New Book"** button to open the form:

#### Required Fields:
- **Title**: Book title
- **Author**: Author name(s)

#### Optional Fields:
- **Description**: Book description/summary
- **Category**: Select from 5 predefined categories
- **Rating**: 0-5 star rating (decimal allowed)
- **Amazon URL**: Direct purchase link
- **Cover Image URL**: Book cover image
- **Publisher**: Publishing company
- **Publication Year**: Year published
- **Page Count**: Number of pages
- **ISBN**: ISBN number
- **Goodreads URL**: Goodreads link

#### Status Options:
- **Published**: Book visible on public Learn page
- **Featured**: Book highlighted in category

### ✏️ Editing Books

1. Click the **Edit** button (pencil icon) next to any book
2. Modify any field in the form
3. Click **"Update Book"** to save changes

### 🗑️ Deleting Books

1. Click the **Delete** button (trash icon) next to any book
2. Confirm deletion in the popup modal
3. Book will be permanently removed

### ⭐ Quick Actions

- **Star Icon**: Toggle featured status
- **Eye/Eye-Off Icon**: Toggle published status
- **External Link Icon**: Open Amazon page (if URL exists)

## 📋 Book Categories

The system includes 5 predefined categories:

1. **Logo Books** - Logo design principles and techniques
2. **Brand Identity Books** - Comprehensive brand identity guides  
3. **Typography Books** - Typography and type design resources
4. **Business Books** - Strategic business and marketing books
5. **Other Graphic Design Books** - General design principles

## 🔍 Search & Filter

- **Search Bar**: Search across titles, authors, and descriptions
- **Category Filter**: Filter by specific book category
- **Real-time Results**: Results update as you type

## 📈 Book Status Management

### Published vs Draft
- **Published**: Books appear on the public `/learn` page
- **Draft**: Books hidden from public view (admin only)

### Featured Books
- **Featured books** are highlighted in their category
- Typically the best/most recommended books
- Show with yellow star badge

## 🛠️ Database Integration

The Books Admin connects to your Supabase database:
- **Real-time updates**: Changes reflect immediately
- **Secure access**: Only authenticated admins can modify
- **Data validation**: Form validates inputs before saving

## 🚨 Error Handling

- **Connection Issues**: Red error banner appears if database unavailable
- **Validation Errors**: Form highlights required fields
- **Success Feedback**: Books list updates automatically after actions

## 📱 Responsive Design

The Books Admin works on:
- **Desktop**: Full table view with all columns
- **Tablet**: Responsive layout with scrolling
- **Mobile**: Optimized forms and touch-friendly buttons

## 🔄 Next Steps

After setting up the Supabase database (see `BOOKS_SETUP.md`):

1. **Login as admin** at `/console-setup`
2. **Navigate to** `/admin/books` 
3. **Add your first book** using the form
4. **Test the public page** at `/learn` to see your books
5. **Organize books** by category and featured status

---

**🎯 Quick Access**: http://localhost:5173/admin/books (after admin login)