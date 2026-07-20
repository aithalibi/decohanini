import { CartItem } from '../types/cart';

export function getWhatsAppCheckoutUrl(items: CartItem[]): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212714516493';
  
  // Format the message
  let message = 'Bonjour Déco Hanini,\n\n';
  message += 'Je souhaite commander :\n\n';
  
  let total = 0;
  items.forEach((item) => {
    const itemTotal = (item.variant?.price ?? item.product.price) * item.quantity;
    total += itemTotal;
    message += `- ${item.product.name}${item.variant ? ` (${item.variant.name})` : ''} × ${item.quantity} : ${itemTotal} DH\n`;
  });
  
  message += `\nTotal : ${total} DH\n\n`;
  message += 'Nom :\nTéléphone :\nAdresse :\nVille :';
  
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function getDirectWhatsAppContactUrl(): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212714516493';
  const message = 'Bonjour Déco Hanini, je souhaiterais avoir des informations concernant vos produits.';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
