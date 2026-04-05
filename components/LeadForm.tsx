'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  listingId?: number;
  listingTitle?: string;
  listingSlug?: string;
  compact?: boolean;
}

const inputCls =
  'w-full bg-[#0b1829] border border-[#1e3050] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold-500/60 transition-colors';

const labelCls = 'block font-label text-[10px] tracking-[2px] uppercase text-gray-500 mb-1.5';

export default function LeadForm({ listingId, listingTitle, listingSlug, compact }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setErrorMsg('Please fill in all required fields.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listingId, listingTitle, listingSlug }),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please call 786-838-9911.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <CheckCircle size={48} className="text-gold-500" />
        <h3 className="font-display text-2xl font-semibold text-white">Message Received!</h3>
        <p className="text-gray-400 max-w-sm">
          Thank you, {form.name || 'valued client'}. Liena will reach out within 24 hours. For immediate assistance, call{' '}
          <a href="tel:+17868389911" className="text-gold-400 hover:underline">786-838-9911</a>.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="font-label text-xs tracking-wider uppercase text-gold-400 hover:text-gold-300 transition-colors mt-2"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
      {!compact && listingTitle && (
        <div className="mb-2 p-3 bg-gold-500/10 border border-gold-500/30 rounded text-gold-400 text-sm font-label tracking-wide">
          Inquiry about: <strong>{listingTitle}</strong>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="name" className={labelCls}>
          Full Name <span className="text-gold-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="contact_name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Smith"
          autoComplete="nope"
          className={inputCls}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelCls}>
          Email Address <span className="text-gold-500">*</span>
        </label>
        <input
          id="email"
          type="text"
          inputMode="email"
          name="contact_email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          autoComplete="nope"
          className={inputCls}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelCls}>
          Phone Number <span className="text-gold-500">*</span>
        </label>
        <input
          id="phone"
          type="text"
          inputMode="tel"
          name="contact_phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="(786) 000-0000"
          autoComplete="nope"
          className={inputCls}
        />
      </div>

      {/* Message */}
      {!compact && (
        <div>
          <label htmlFor="message" className={labelCls}>
            Message <span className="text-gray-600">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about yourself and what you're looking for..."
            className={`${inputCls} resize-none`}
          />
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-4 py-3">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center justify-center gap-2 font-label text-xs tracking-[3px] uppercase bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 px-6 py-4 rounded transition-all font-semibold shadow-gold hover:shadow-gold-lg"
      >
        {status === 'loading' ? (
          <>
            <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={13} />
            {listingTitle ? 'Speak with Liena' : 'Send Message'}
          </>
        )}
      </button>

      <p className="text-gray-600 text-xs text-center">
        By submitting, you agree to be contacted by Liena Q Perez. We never share your information.
      </p>
    </form>
  );
}
