import React, { useState, useEffect } from 'react';
import { BookOpen, Star, ExternalLink, Search, AlertCircle } from 'lucide-react';
import { useBooks, Book, BookCategory } from '../hooks/useBooks';
import SEO from '../components/SEO';

const LearnPage = () => {
  const { books, categories, loading, error } = useBooks();
  const [activeCategory, setActiveCategory] = useState('Logo Books');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  // Update active category when categories load
  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.name === activeCategory)) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory]);

  // Filter books based on active category and search term
  useEffect(() => {
    const filtered = books.filter(book => {
      const matchesCategory = book.category?.name === activeCategory;
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch && book.is_published;
    });
    
    setFilteredBooks(filtered);
  }, [books, activeCategory, searchTerm]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating}</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
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
      <SEO 
        title="Learn Logo Design | Branding Books & Design Resources"
        description="Discover the best books and resources for learning logo design and branding. Curated collection of design books, tutorials, and educational content for designers at all levels."
        keywords={['learn logo design', 'books for designers', 'logo design books', 'branding books', 'design education', 'logo design resources', 'design learning', 'graphic design books', 'brand identity books', 'design tutorials']}
        canonical="https://trustedlogos.netlify.app/learn"
        ogTitle="Learn Logo Design | Branding Books & Design Resources"
        ogDescription="Discover the best books and resources for learning logo design and branding. Curated collection for designers at all levels."
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Learn Design & Branding
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the best books to master logo design, brand identity, typography, and business strategy. 
              Curated recommendations from industry experts.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">Unable to load books</p>
              <p className="text-red-600 text-sm mt-1">
                {error} - Please make sure the database is set up correctly.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category.name
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {activeCategory}
          </h2>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No books found matching your search.' : 
                 categories.length === 0 ? 'Database not set up yet. Please run the Supabase migrations.' :
                 'No books available in this category yet.'}
              </p>
              {categories.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  See BOOKS_SETUP.md for database setup instructions.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {/* Book Cover */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {book.cover_image_url ? (
                      <img 
                        src={book.cover_image_url} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${book.cover_image_url ? 'hidden' : ''}`}>
                      <BookOpen className="h-16 w-16 text-blue-400 opacity-50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {book.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-blue-600 font-medium mb-3">
                      by {book.author}
                    </p>
                    {book.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {book.description}
                      </p>
                    )}
                    
                    {/* Additional Info */}
                    {(book.publisher || book.publication_year) && (
                      <p className="text-xs text-gray-500 mb-3">
                        {book.publisher && book.publication_year 
                          ? `${book.publisher} • ${book.publication_year}`
                          : book.publisher || book.publication_year}
                        {book.page_count && ` • ${book.page_count} pages`}
                      </p>
                    )}
                    
                    {/* Rating */}
                    <div className="mb-4">
                      {renderStars(book.rating)}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {book.amazon_url ? (
                        <a
                          href={book.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Book
                        </a>
                      ) : (
                        <button className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          No Link
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Star className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Expand Your Design Knowledge
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Reading is one of the best investments in your design career. These carefully selected books 
            will help you master the fundamentals and advanced concepts of design and branding.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
              Suggest a Book
            </button>
            <button className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
              View Reading List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;