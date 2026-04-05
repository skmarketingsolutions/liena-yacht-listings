'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import type { Listing, Admin } from '@/lib/db';
import type { JwtPayload } from '@/lib/auth';

interface Props {
  mode: 'new' | 'edit';
  listing?: Listing;
  auth: JwtPayload;
  admins: Admin[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ListingForm({ mode, listing, auth, admins }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: listing?.title || '',
    vessel_name: listing?.vessel_name || '',
    year: listing?.year?.toString() || new Date().getFullYear().toString(),
    make: listing?.make || '',
    model: listing?.model || '',
    length_ft: listing?.length_ft?.toString() || '',
    price: listing?.price?.toString() || '',
    location: listing?.location || 'Miami, Florida',
    description: listing?.description || '',
    video_url: listing?.video_url || '',
    featured: listing?.featured ? '1' : '0',
    status: listing?.status || 'active',
    salesman_id: listing?.salesman_id?.toString() || auth.adminId.toString(),
    seo_title: listing?.seo_title || '',
    seo_description: listing?.seo_description || '',
    seo_keywords: listing?.seo_keywords || '',
  });

  const [photos, setPhotos] = useState<string[]>(listing?.photos || []);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const [specs, setSpecs] = useState<[string, string][]>(
    Object.entries(listing?.specs || {}) as [string, string][]
  );

  const [features, setFeatures] = useState<[string, string[]][]>(
    Object.entries(listing?.features || {}) as [string, string[]][]
  );

  // ── Handlers ─────────────────────────────────────────────────────────
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const addPhotoUrl = () => {
    const url = newPhotoUrl.trim();
    if (url) { setPhotos((p) => [...p, url]); setNewPhotoUrl(''); }
  };

  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const { url } = await res.json();
          setPhotos((p) => [...p, url]);
        }
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addSpec = () => setSpecs((p) => [...p, ['', '']]);
  const removeSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));
  const setSpec = (i: number, k: 0 | 1, v: string) =>
    setSpecs((p) => p.map((s, idx) => (idx === i ? (k === 0 ? [v, s[1]] : [s[0], v]) : s)));

  const addFeatureSection = () => setFeatures((p) => [...p, ['New Section', ['']]]);
  const removeFeatureSection = (i: number) => setFeatures((p) => p.filter((_, idx) => idx !== i));
  const setFeatureSectionName = (i: number, v: string) =>
    setFeatures((p) => p.map((f, idx) => (idx === i ? [v, f[1]] : f)));
  const addFeatureItem = (si: number) =>
    setFeatures((p) => p.map((f, idx) => (idx === si ? [f[0], [...f[1], '']] : f)));
  const removeFeatureItem = (si: number, ii: number) =>
    setFeatures((p) => p.map((f, idx) => (idx === si ? [f[0], f[1].filter((_, i2) => i2 !== ii)] : f)));
  const setFeatureItem = (si: number, ii: number, v: string) =>
    setFeatures((p) => p.map((f, idx) => (idx === si ? [f[0], f[1].map((item, i2) => (i2 === ii ? v : item))] : f)));

  // ── Auto-generate slug from title ─────────────────────────────────
  const autoSlug = slugify(form.title || '');

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    const payload = {
      ...form,
      slug: autoSlug,
      year: parseInt(form.year),
      length_ft: parseFloat(form.length_ft),
      price: parseFloat(form.price),
      salesman_id: parseInt(form.salesman_id),
      featured: form.featured === '1',
      photos,
      specs: Object.fromEntries(specs.filter(([k]) => k)),
      features: Object.fromEntries(features.filter(([k]) => k).map(([k, v]) => [k, v.filter(Boolean)])),
    };

    try {
      const url = mode === 'new' ? '/api/listings' : `/api/listings/${listing!.id}`;
      const method = mode === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save listing');
      }

      setStatus('success');
      setTimeout(() => router.push('/admin/dashboard'), 1000);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  const inputCls = 'admin-input';
  const labelCls = 'block font-label text-[10px] tracking-[2px] uppercase text-gray-500 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* ── Basic Info ── */}
      <section className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
        <h2 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Listing Title *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} required className={inputCls} placeholder="2019 Azimut Fly 50 — La Paloma" />
            <p className="text-gray-600 text-xs mt-1">Slug: /listings/{autoSlug || '...'}</p>
          </div>
          <div>
            <label className={labelCls}>Vessel Name</label>
            <input type="text" value={form.vessel_name} onChange={(e) => set('vessel_name', e.target.value)} className={inputCls} placeholder="La Paloma" />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Year *</label>
            <input type="number" value={form.year} onChange={(e) => set('year', e.target.value)} required min="1900" max="2030" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Make *</label>
            <input type="text" value={form.make} onChange={(e) => set('make', e.target.value)} required className={inputCls} placeholder="Azimut" />
          </div>
          <div>
            <label className={labelCls}>Model *</label>
            <input type="text" value={form.model} onChange={(e) => set('model', e.target.value)} required className={inputCls} placeholder="Fly 50" />
          </div>
          <div>
            <label className={labelCls}>Length (ft) *</label>
            <input type="number" value={form.length_ft} onChange={(e) => set('length_ft', e.target.value)} required step="0.1" className={inputCls} placeholder="50" />
          </div>
          <div>
            <label className={labelCls}>Price (USD) *</label>
            <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required step="1000" className={inputCls} placeholder="980000" />
          </div>
          <div>
            <label className={labelCls}>Location *</label>
            <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} required className={inputCls} placeholder="Miami, Florida" />
          </div>
          <div>
            <label className={labelCls}>Featured</label>
            <select value={form.featured} onChange={(e) => set('featured', e.target.value)} className={inputCls}>
              <option value="1">Yes — Show on Homepage</option>
              <option value="0">No</option>
            </select>
          </div>
          {auth.role === 'broker' && admins.length > 0 && (
            <div>
              <label className={labelCls}>Assigned Salesman</label>
              <select value={form.salesman_id} onChange={(e) => set('salesman_id', e.target.value)} className={inputCls}>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>{a.name || a.username} ({a.role})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* ── Description ── */}
      <section className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
        <h2 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-5">Description</h2>
        <div>
          <label className={labelCls}>Full Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
            rows={8}
            className={`${inputCls} resize-y`}
            placeholder="Detailed description of the yacht..."
          />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Video URL (YouTube or MP4)</label>
          <input type="url" value={form.video_url} onChange={(e) => set('video_url', e.target.value)} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
        </div>
      </section>

      {/* ── Photos ── */}
      <section className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
        <h2 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-5">Photos</h2>

        {/* Thumbnails */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {photos.map((src, i) => (
              <div key={i} className="relative w-24 h-16 rounded overflow-hidden group border border-[#1e3050]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-gold-500 text-navy-950 text-[8px] text-center font-label tracking-wider py-0.5">Cover</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add by URL */}
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhotoUrl())}
            className={`${inputCls} flex-1`}
            placeholder="https://example.com/photo.jpg"
          />
          <button
            type="button"
            onClick={addPhotoUrl}
            className="flex items-center gap-1.5 px-4 py-2 bg-navy-600 hover:bg-navy-500 border border-[#1e3050] text-white rounded text-sm transition-colors whitespace-nowrap"
          >
            <Plus size={14} /> Add URL
          </button>
        </div>

        {/* File upload */}
        <label className="flex items-center gap-2 cursor-pointer w-fit border border-[#1e3050] hover:border-gold-500/40 rounded px-4 py-2 text-gray-400 hover:text-gold-400 transition-colors text-sm">
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
        <p className="text-gray-600 text-xs mt-2">First photo is used as the cover image. Drag to reorder coming soon.</p>
      </section>

      {/* ── Specs ── */}
      <section className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500">Specifications</h2>
          <button type="button" onClick={addSpec} className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm transition-colors">
            <Plus size={14} /> Add Row
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {specs.map(([k, v], i) => (
            <div key={i} className="flex gap-2">
              <input value={k} onChange={(e) => setSpec(i, 0, e.target.value)} className={`${inputCls} flex-1`} placeholder="Specification (e.g. Beam)" />
              <input value={v} onChange={(e) => setSpec(i, 1, e.target.value)} className={`${inputCls} flex-1`} placeholder="Value (e.g. 15 ft 3 in)" />
              <button type="button" onClick={() => removeSpec(i)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                <X size={16} />
              </button>
            </div>
          ))}
          {specs.length === 0 && <p className="text-gray-600 text-sm">No specs added yet. Click "Add Row" to start.</p>}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500">Features & Equipment</h2>
          <button type="button" onClick={addFeatureSection} className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm transition-colors">
            <Plus size={14} /> Add Section
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {features.map(([sectionName, items], si) => (
            <div key={si} className="border border-[#1e3050] rounded-lg p-4">
              <div className="flex gap-2 mb-3">
                <input
                  value={sectionName}
                  onChange={(e) => setFeatureSectionName(si, e.target.value)}
                  className={`${inputCls} flex-1 font-medium`}
                  placeholder="Section name (e.g. Electronics)"
                />
                <button type="button" onClick={() => removeFeatureSection(si)} className="text-gray-600 hover:text-red-400 p-1 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {items.map((item, ii) => (
                  <div key={ii} className="flex gap-2">
                    <input value={item} onChange={(e) => setFeatureItem(si, ii, e.target.value)} className={`${inputCls} flex-1 text-sm`} placeholder="Feature item" />
                    <button type="button" onClick={() => removeFeatureItem(si, ii)} className="text-gray-600 hover:text-red-400 p-1 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addFeatureItem(si)} className="flex items-center gap-1 text-gray-500 hover:text-gold-400 text-xs transition-colors mt-1">
                  <Plus size={12} /> Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO ── */}
      <section className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
        <h2 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-5">SEO Settings</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>SEO Title Tag</label>
            <input type="text" value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} className={inputCls} placeholder="2019 Azimut Fly 50 Flybridge For Sale Miami | Liena Q Perez" maxLength={70} />
            <p className="text-gray-600 text-xs mt-1">{form.seo_title.length}/70 characters (aim for 50–60)</p>
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="2019 Azimut Fly 50 for sale in Miami, FL. 50ft flybridge yacht with twin Volvo Penta diesels..." maxLength={160} />
            <p className="text-gray-600 text-xs mt-1">{form.seo_description.length}/160 characters (aim for 120–155)</p>
          </div>
          <div>
            <label className={labelCls}>Keywords (comma-separated)</label>
            <input type="text" value={form.seo_keywords} onChange={(e) => set('seo_keywords', e.target.value)} className={inputCls} placeholder="2019 Azimut Fly 50 for sale, Azimut flybridge Miami, used yacht Florida" />
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-4 py-3">
          <AlertCircle size={15} /> {errorMsg}
        </div>
      )}
      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 border border-green-800/40 rounded px-4 py-3">
          <CheckCircle size={15} /> Listing saved! Redirecting...
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="px-6 py-3 border border-[#1e3050] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === 'saving' || status === 'success'}
          className="flex items-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/40 text-navy-950 px-7 py-3 rounded-lg transition-all font-semibold shadow-gold"
        >
          {status === 'saving' ? (
            <><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save size={14} /> {mode === 'new' ? 'Create Listing' : 'Save Changes'}</>
          )}
        </button>
      </div>
    </form>
  );
}
