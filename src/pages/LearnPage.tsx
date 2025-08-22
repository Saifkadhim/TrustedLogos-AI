import React, { useState } from 'react';
import { BookOpen, Star, ExternalLink, Search } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  rating: number;
  coverUrl: string;
  amazonUrl?: string;
  category: string;
}

const LearnPage = () => {
  const [activeCategory, setActiveCategory] = useState('Logo Books');
  const [searchTerm, setSearchTerm] = useState('');

  const bookCategories = [
    'Logo Books',
    'Brand Identity Books', 
    'Typography Books',
    'Business Books',
    'Other Graphic Design Books'
  ];

  // Sample books data - you can expand this with real book data
  const books: Book[] = [
    // Logo Books
    {
      id: '1',
      title: 'Logo Design Love',
      author: 'David Airey',
      description: 'A guide to creating iconic brand identities with practical advice and real-world examples.',
      rating: 4.8,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Logo Books'
    },
    {
      id: '2',
      title: 'Marks of Excellence',
      author: 'Per Mollerup',
      description: 'The history and taxonomy of trademarks, exploring what makes a logo truly memorable.',
      rating: 4.6,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Logo Books'
    },
    {
      id: '3',
      title: 'Symbol',
      author: 'Angus Hyland',
      description: 'A comprehensive look at the art of logo design and corporate identity.',
      rating: 4.7,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Logo Books'
    },
    
    // Brand Identity Books
    {
      id: '4',
      title: 'Designing Brand Identity',
      author: 'Alina Wheeler',
      description: 'An essential handbook for the entire branding team with proven methodologies.',
      rating: 4.9,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Brand Identity Books'
    },
    {
      id: '5',
      title: 'Brand Identity Essentials',
      author: 'Kevin Budelmann',
      description: '100 principles for designing logos and building brands.',
      rating: 4.5,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Brand Identity Books'
    },
    
    // Typography Books
    {
      id: '6',
      title: 'Thinking with Type',
      author: 'Ellen Lupton',
      description: 'A critical guide for designers, writers, editors, and students.',
      rating: 4.7,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Typography Books'
    },
    {
      id: '7',
      title: 'The Elements of Typographic Style',
      author: 'Robert Bringhurst',
      description: 'The definitive guide to typography and type design.',
      rating: 4.8,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Typography Books'
    },
    
    // Business Books
    {
      id: '8',
      title: 'Building a StoryBrand',
      author: 'Donald Miller',
      description: 'Clarify your message so customers will listen and buy.',
      rating: 4.6,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Business Books'
    },
    {
      id: '9',
      title: 'The Brand Gap',
      author: 'Marty Neumeier',
      description: 'How to bridge the distance between business strategy and design.',
      rating: 4.5,
      coverUrl: '/api/placeholder/200/300',
      amazonUrl: '#',
      category: 'Business Books'
    },
    
         // Typography Books (additional)
     {
       id: '12',
       title: 'Typography Sketchbooks',
       author: 'Steven Heller',
       description: 'Behind-the-scenes look at how type designers work and think.',
       rating: 4.4,
       coverUrl: '/api/placeholder/200/300',
       amazonUrl: '#',
       category: 'Typography Books'
     },
     
     // Business Books (additional)
     {
       id: '13',
       title: 'Purple Cow',
       author: 'Seth Godin',
       description: 'Transform your business by being remarkable.',
       rating: 4.3,
       coverUrl: '/api/placeholder/200/300',
       amazonUrl: '#',
       category: 'Business Books'
     },
     {
       id: '14',
       title: 'Made to Stick',
       author: 'Chip Heath & Dan Heath',
       description: 'Why some ideas survive and others die.',
       rating: 4.5,
       coverUrl: '/api/placeholder/200/300',
       amazonUrl: '#',
       category: 'Business Books'
     },
     
     // Other Graphic Design Books
     {
       id: '10',
       title: 'The Design of Everyday Things',
       author: 'Don Norman',
       description: 'Fundamental principles of good design and user experience.',
       rating: 4.7,
       coverUrl: '/api/placeholder/200/300',
       amazonUrl: '#',
       category: 'Other Graphic Design Books'
     },
     {
       id: '11',
       title: 'Grid Systems in Graphic Design',
       author: 'Josef Müller-Brockmann',
       description: 'A visual communication manual for graphic designers.',
       rating: 4.8,
       coverUrl: '/api/placeholder/200/300',
       amazonUrl: '#',
       category: 'Other Graphic Design Books'
     },
     {
       id: '15',
       title: 'Graphic Design: The New Basics',
       author: 'Ellen Lupton',
       description: 'Updated fundamentals for the digital age.',
       rating: 4.6,
       coverUrl: '/api/placeholder/200/300',
       amazonUrl: '#',
       category: 'Other Graphic Design Books'
     }
  ];

  const filteredBooks = books.filter(book => 
    book.category === activeCategory &&
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {bookCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {activeCategory}
          </h2>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No books found matching your search.' : 'No books available in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {/* Book Cover */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-blue-400 opacity-50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-blue-600 font-medium mb-3">
                      by {book.author}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {book.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="mb-4">
                      {renderStars(book.rating)}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Book
                      </button>
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