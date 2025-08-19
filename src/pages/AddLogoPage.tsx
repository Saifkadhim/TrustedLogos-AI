import React, { useMemo, useState } from 'react';
import { Search, Grid, List, Upload, Save, Trash2, Edit3, Loader } from 'lucide-react';
import { useLogos } from '../hooks/useLogos-safe';

const LOGO_TYPES = ['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'];
const SHAPES = ['rectangle', 'circle', 'triangle'];

const AddLogoPage: React.FC = () => {
  const { logos, addLogo, loading: hookLoading, error: hookError } = useLogos();

  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState(LOGO_TYPES[0]);
  const [industry, setIndustry] = useState('Technology');
  const [subcategory, setSubcategory] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [shape, setShape] = useState(SHAPES[0]);
  const [information, setInformation] = useState('');
  const [website, setWebsite] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredLogos = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return logos;
    return logos.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q) ||
      l.industry.toLowerCase().includes(q)
    );
  }, [logos, searchTerm]);

  const resetForm = () => {
    setName('');
    setType(LOGO_TYPES[0]);
    setIndustry('Technology');
    setSubcategory('');
    setPrimaryColor('#000000');
    setSecondaryColor('');
    setShape(SHAPES[0]);
    setInformation('');
    setWebsite('');
    setImageFile(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    try {
      await addLogo({
        name,
        type,
        industry,
        subcategory: subcategory || undefined,
        primaryColor,
        secondaryColor: secondaryColor || undefined,
        shape,
        information: information || undefined,
        designerUrl: website || undefined,
        imageFile: imageFile || undefined,
        isPublic: true,
      });
      setMessage({ type: 'success', text: 'Logo added successfully' });
      resetForm();
      setActiveTab('manage');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add logo' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Logo</h1>
            <p className="text-gray-600 mt-1">Create a new logo entry and manage existing ones</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded-md ${activeTab === 'add' ? 'bg-gray-900 text-white' : 'bg-white border'}`}
              onClick={() => setActiveTab('add')}
            >
              Add
            </button>
            <button
              className={`px-3 py-2 rounded-md ${activeTab === 'manage' ? 'bg-gray-900 text-white' : 'bg-white border'}`}
              onClick={() => setActiveTab('manage')}
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'add' ? (
          <div className="max-w-3xl">
            <form onSubmit={onSubmit} className="bg-white rounded-lg border p-6 space-y-6">
              {/* Basic */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
                    {LOGO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input className="w-full border rounded px-3 py-2" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory (optional)</label>
                  <input className="w-full border rounded px-3 py-2" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
                </div>
              </div>

              {/* Colors & Shape */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="h-10 w-12 border rounded" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                    <input className="flex-1 border rounded px-3 py-2" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color (optional)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="h-10 w-12 border rounded" value={secondaryColor || '#ffffff'} onChange={(e) => setSecondaryColor(e.target.value)} />
                    <input className="flex-1 border rounded px-3 py-2" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="#ffffff" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                  <select className="w-full border rounded px-3 py-2" value={shape} onChange={(e) => setShape(e.target.value)}>
                    {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2" rows={4} value={information} onChange={(e) => setInformation(e.target.value)} placeholder="Describe the logo (history, meaning, etc.)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input className="w-full border rounded px-3 py-2" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://company-website.com" />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image (optional)</label>
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  <span>{imageFile ? imageFile.name : 'Select image'}</span>
                  <input className="hidden" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              {message && (
                <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>
              )}
              {hookError && (
                <div className="p-3 rounded text-sm bg-red-50 text-red-700">{hookError}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || hookLoading || !name.trim()}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${isSubmitting || hookLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isSubmitting || hookLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSubmitting || hookLoading ? 'Saving...' : 'Save Logo'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logos..."
                    className="pl-9 pr-3 py-2 border rounded-md w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className={`px-3 py-2 rounded-md border ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white'}`} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></button>
                  <button className={`px-3 py-2 rounded-md border ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white'}`} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
              {filteredLogos.map((logo) => (
                <div key={logo.id} className={`bg-white rounded-lg border ${viewMode === 'list' ? 'p-3 flex items-start gap-3' : 'overflow-hidden'}`}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {logo.imageUrl ? (
                          <img src={logo.imageUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: logo.primaryColor }}>
                            {logo.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{logo.name}</h3>
                            <p className="text-sm text-gray-600">{logo.type} • {logo.industry}</p>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <button className="p-1 hover:text-blue-600" title="Edit"><Edit3 className="h-4 w-4" /></button>
                            <button className="p-1 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                        {logo.information && <p className="text-sm text-gray-700 line-clamp-2">{logo.information}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-gray-50 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                        {logo.imageUrl ? (
                          <img src={logo.imageUrl} alt={logo.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: logo.primaryColor }}>
                            {logo.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">{logo.name}</h3>
                            <p className="text-xs text-gray-500">{logo.type} • {logo.industry}</p>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                            <button className="p-1 hover:text-blue-600" title="Edit"><Edit3 className="h-4 w-4" /></button>
                            <button className="p-1 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                        {logo.information && <p className="text-sm text-gray-700 mt-1 line-clamp-2">{logo.information}</p>}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddLogoPage;

