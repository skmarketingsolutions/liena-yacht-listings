import { Phone, Mail } from 'lucide-react';
import LeadForm from './LeadForm';

interface Props {
  listingId?: number;
  listingTitle?: string;
  listingSlug?: string;
  heading?: string;
  subtext?: string;
}

export default function ContactCTA({
  listingId,
  listingTitle,
  listingSlug,
  heading = 'Speak with Liena',
  subtext = 'Liena Q Perez responds to all qualified inquiries within hours. Showings are available by appointment.',
}: Props) {
  return (
    <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6 md:p-8">
      {/* Above-fold call button */}
      <a
        href="tel:+17868389911"
        className="flex items-center justify-center gap-3 w-full bg-gold-500 hover:bg-gold-400 text-navy-950 py-4 rounded-xl font-semibold font-label text-sm tracking-wider transition-colors shadow-gold mb-6"
      >
        <Phone size={16} />
        Call Liena — 786-838-9911
      </a>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#1e3050]" />
        <span className="text-gray-600 text-xs font-label tracking-wider uppercase">or send a message</span>
        <div className="flex-1 h-px bg-[#1e3050]" />
      </div>

      <h2 className="font-display text-xl font-semibold text-white mb-1">{heading}</h2>
      <p className="text-gray-500 text-sm mb-6">{subtext}</p>

      <LeadForm
        listingId={listingId}
        listingTitle={listingTitle}
        listingSlug={listingSlug}
        compact
      />

      <a
        href="mailto:liena@italiaboats.com"
        className="flex items-center justify-center gap-2 mt-4 text-gray-500 hover:text-gold-400 text-xs transition-colors"
      >
        <Mail size={13} />
        liena@italiaboats.com
      </a>
    </div>
  );
}
