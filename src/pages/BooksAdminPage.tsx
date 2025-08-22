import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff,
  Filter,
  Save,
  X,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useBooks, Book, BookCategory, CreateBookData, UpdateBookData } from '../hooks/useBooks';

interface BookFormData {
  title: string;
  author: string;
  description: string;
  isbn: string;
  rating: string;
  cover_image_url: string;
  amazon_url: string;
  goodreads_url: string;
  publisher: string;
  publication_year: string;
  page_count: string;
  category_id: string;
  is_featured: boolean;
  is_published: boolean;
}

const BooksAdminPage = () => {
  const {
    books,
    categories,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    toggleFeatured,
    togglePublished,
    setError
  } = useBooks();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    isbn: '',
    rating: '0',
    cover_image_url: '',
    amazon_url: '',
    goodreads_url: '',
    publisher: '',
    publication_year: '',
    page_count: '',
    category_id: '',
    is_featured: false,
    is_published: true
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      isbn: '',
      rating: '0',
      cover_image_url: '',
      amazon_url: '',
      goodreads_url: '',
      publisher: '',
      publication_year: '',
      page_count: '',
      category_id: '',
      is_featured: false,
      is_published: true
    });
    setEditingBook(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      isbn: book.isbn || '',
      rating: book.rating.toString(),
      cover_image_url: book.cover_image_url || '',
      amazon_url: book.amazon_url || '',
      goodreads_url: book.goodreads_url || '',
      publisher: book.publisher || '',
      publication_year: book.publication_year?.toString() || '',
      page_count: book.page_count?.toString() || '',
      category_id: book.category_id || '',
      is_featured: book.is_featured,
      is_published: book.is_published
    });
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const bookData: CreateBookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim() || undefined,
      isbn: formData.isbn.trim() || undefined,
      rating: parseFloat(formData.rating) || 0,
      cover_image_url: formData.cover_image_url.trim() || undefined,
      amazon_url: formData.amazon_url.trim() || undefined,
      goodreads_url: formData.goodreads_url.trim() || undefined,
      publisher: formData.publisher.trim() || undefined,
      publication_year: formData.publication_year ? parseInt(formData.publication_year) : undefined,
      page_count: formData.page_count ? parseInt(formData.page_count) : undefined,
      category_id: formData.category_id || undefined,
      is_featured: formData.is_featured,
      is_published: formData.is_published
    };

    if (editingBook) {
      const result = await updateBook({ id: editingBook.id, ...bookData });
      if (result) {
        resetForm();
      }
    } else {
      const result = await createBook(bookData);
      if (result) {
        resetForm();
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const success = await deleteBook(id);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || book.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const stats = {
    total: books.length,
    published: books.filter(b => b.is_published).length,
    featured: books.filter(b => b.is_featured).length,
    drafts: books.filter(b => !b.is_published).length
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
              <p className="text-gray-600 mt-1">Add, edit, and organize learning resources</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Book
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Books</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-green-700">Published</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
              <div className="text-sm text-yellow-700">Featured</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
              <div className="text-sm text-gray-700">Drafts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Book</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        {book.publisher && book.publication_year && (
                          <p className="text-xs text-gray-500 mt-1">
                            {book.publisher} • {book.publication_year}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {book.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublished(book.id, !book.is_published)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            book.is_published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {book.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {book.is_published ? 'Published' : 'Draft'}
                        </button>
                        {book.is_featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(book.id, !book.is_featured)}
                          className={`p-2 rounded-lg transition-colors ${
                            book.is_featured
                              ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                              : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                          }`}
                          title={book.is_featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <Star className={`h-4 w-4 ${book.is_featured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit book"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {book.amazon_url && (
                          <a
                            href={book.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View on Amazon"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No books found matching your criteria.' 
                    : 'No books available. Add your first book!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Book Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title & Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category & Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amazon URL
                  </label>
                  <input
                    type="url"
                    value={formData.amazon_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, amazon_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Publisher & Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.publication_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, publication_year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.page_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_count: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Book</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksAdminPage;