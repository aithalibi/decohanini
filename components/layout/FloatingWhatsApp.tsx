import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({ phone }: { phone: string }) {
  const whatsappNumber = phone.replace(/\D/g, '') || '212777422673';

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Déco Hanini sur WhatsApp"
      className="fixed bottom-4 right-4 z-30 grid h-14 w-14 place-items-center rounded-full border-[3px] border-brand-cream bg-[#1cab62] text-white shadow-[0_10px_30px_rgba(35,30,25,0.28)] transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <MessageCircle size={27} strokeWidth={2} />
    </a>
  );
}
