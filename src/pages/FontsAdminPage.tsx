import React, { useMemo, useState } from 'react';
import { Plus, Save, Trash2, Edit3, Grid, List, Filter, Search, Type, Tag, Download, Heart } from 'lucide-react';
import { useFonts } from '../hooks/useFonts';

const FontsAdminPage: React.FC = () => {
  const { fonts, addFont, updateFont, deleteFont, uploadFontFiles } = useFonts();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [editingFont, setEditingFont] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: '',
    designer: '',
    category: 'Display',
    style: 'Regular',
    tags: '',
    license: 'Personal Use Free',
    formats: ['TTF'],
    weights: ['Regular'],
    featured: false,
    files: [] as File[],
  });

  const categories = ['Display', 'Script', 'Sans Serif', 'Serif', 'Monospace', 'Handwritten', 'Decorative', 'Other'];

  const filteredFonts = useMemo(() => {
    let result = fonts.filter((f) => {
      const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'oldest':
        return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'popular':
        return result.sort((a, b) => b.likes - a.likes);
      case 'downloads':
        return result.sort((a, b) => b.downloads - a.downloads);
      case 'alphabetical':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [fonts, filterCategory, searchTerm, sortBy]);

  const resetForm = () => {
    setFormData({
      name: '',
      designer: '',
      category: 'Display',
      style: 'Regular',
      tags: '',
      license: 'Personal Use Free',
      formats: ['TTF'],
      weights: ['Regular'],
      featured: false,
      files: [] as File[],
    });
  };

  const handleCreate = async () => {
    try {
      const created = await addFont({
        name: formData.name,
        designer: formData.designer,
        category: formData.category,
        style: formData.style,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
        license: formData.license,
        formats: formData.formats,
        weights: formData.weights,
        featured: formData.featured,
        isPublic: true,
      });
      console.log('Font created:', created.id);
      if (formData.files && formData.files.length > 0) {
        console.log('Uploading', formData.files.length, 'files...');
        const urls = await uploadFontFiles(created.id, formData.files);
        console.log('Upload result:', urls);
        alert(`Font created! Uploaded ${urls.length} files.`);
      } else {
        alert('Font created (no files selected)');
      }
      setShowCreate(false);
      resetForm();
    } catch (error) {
      console.error('Create failed:', error);
      alert(`Failed: ${error.message || error}`);
    }
  };

  const handleUpdate = async () => {
    if (!editingFont) return;
    try {
      await updateFont({
        id: editingFont.id,
        name: formData.name,
        designer: formData.designer,
        category: formData.category,
        style: formData.style,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
        license: formData.license,
        formats: formData.formats,
        weights: formData.weights,
        featured: formData.featured,
      });
      console.log('Font updated:', editingFont.id);
      if (formData.files && formData.files.length > 0) {
        console.log('Uploading', formData.files.length, 'files...');
        const urls = await uploadFontFiles(editingFont.id, formData.files);
        console.log('Upload result:', urls);
        alert(`Font updated! Uploaded ${urls.length} files.`);
      } else {
        alert('Font updated (no new files)');
      }
      setEditingFont(null);
      resetForm();
    } catch (error) {
      console.error('Update failed:', error);
      alert(`Failed: ${error.message || error}`);
    }
  };

  const handleEditClick = (font: any) => {
    setEditingFont(font);
    setFormData({
      name: font.name,
      designer: font.designer,
      category: font.category,
      style: font.style,
      tags: font.tags.join(', '),
      license: font.license,
      formats: font.formats,
      weights: font.weights,
      featured: font.featured,
      files: [] as File[],
    });
  };

  const handleDelete = async (fontId: string) => {
    await deleteFont(fontId);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fonts Admin</h1>
            <p className="text-gray-600 mt-1">Add, edit, and manage fonts</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Font
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded-md border ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              className={`px-3 py-2 rounded-md border ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fonts..."
              className="pl-9 pr-3 py-2 border rounded-md w-64"
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="downloads">Most Downloads</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFonts.map((font) => (
            <div key={font.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{font.name}</div>
                    <div className="text-xs text-gray-500">by {font.designer}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-sm border rounded" onClick={() => handleEditClick(font)}>
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => handleDelete(font.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1 border px-2 py-1 rounded"><Type className="h-3 w-3" /> {font.category}</span>
                  <span className="inline-flex items-center gap-1 border px-2 py-1 rounded"><Tag className="h-3 w-3" /> {font.style}</span>
                  <span className="inline-flex items-center gap-1 border px-2 py-1 rounded"><Download className="h-3 w-3" /> {font.downloads}</span>
                  <span className="inline-flex items-center gap-1 border px-2 py-1 rounded"><Heart className="h-3 w-3" /> {font.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {filteredFonts.map((font) => (
            <div key={font.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{font.name}</div>
                <div className="text-xs text-gray-500">{font.designer} • {font.category} • {font.style}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-sm border rounded" onClick={() => handleEditClick(font)}>
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => handleDelete(font.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreate || editingFont) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="text-lg font-semibold">{editingFont ? 'Edit Font' : 'Add Font'}</div>
              <button className="text-gray-500" onClick={() => { setShowCreate(false); setEditingFont(null); }}>
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Font Name</label>
                  <input className="w-full border rounded p-2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Designer</label>
                  <input className="w-full border rounded p-2" value={formData.designer} onChange={(e) => setFormData({ ...formData, designer: e.target.value })} />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Category</label>
                  <select className="w-full border rounded p-2" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Style</label>
                  <input className="w-full border rounded p-2" value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tags (comma separated)</label>
                  <input className="w-full border rounded p-2" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">License</label>
                  <input className="w-full border rounded p-2" value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} />
                </div>
                <div>
                  <label className="block text sm text-gray-700 mb-1">Formats</label>
                  <input className="w-full border rounded p-2" value={formData.formats.join(', ')} onChange={(e) => setFormData({ ...formData, formats: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Weights</label>
                  <input className="w-full border rounded p-2" value={formData.weights.join(', ')} onChange={(e) => setFormData({ ...formData, weights: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Font Files (TTF/OTF/WOFF)</label>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2,.zip"
                  multiple
                  onChange={(e) => setFormData({ ...formData, files: Array.from(e.target.files || []) })}
                  className="w-full border rounded p-2"
                />
                <p className="text-xs text-gray-500 mt-1">Selected: {formData.files.length} file(s)</p>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                  Featured
                </label>

                <div className="flex items-center gap-2">
                  {editingFont ? (
                    <button className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={handleUpdate}>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" /> Create Font
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontsAdminPage;