'use client';

import { Trash2 } from 'lucide-react';

interface Props {
  listingId: number;
  title: string;
}

export default function DeleteListingButton({ listingId, title }: Props) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
        if (res.ok) window.location.reload();
        else alert('Failed to delete listing.');
      }}
    >
      <button
        type="submit"
        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
        title="Delete listing"
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
