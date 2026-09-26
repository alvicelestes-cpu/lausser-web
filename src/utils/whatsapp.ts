import type { CartItem, CustomerOrderInfo } from '../types';
import { formatCurrency, getBrandNameDisplay } from './formatters';

export interface WhatsAppOrderPayload {
  items: CartItem[];
  customer: CustomerOrderInfo;
  whatsappNumber: string;
  campaignNumber: string;
}

export const generateWhatsAppLink = ({
  items,
  customer,
  whatsappNumber,
  campaignNumber,
}: WhatsAppOrderPayload): string => {
  const stockItems = items.filter((item) => item.type === 'stock');
  const campaignItems = items.filter((item) => item.type === 'campaign');

  const stockSubtotal = stockItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const campaignSubtotal = campaignItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = stockSubtotal + campaignSubtotal;

  let message = `✨ *NUEVO PEDIDO LAUSSER* ✨\n`;
  message += `¡Hola! Quiero confirmar mi pedido desde la tienda online Lausser.\n\n`;

  // 1. Entrega inmediata
  if (stockItems.length > 0) {
    message += `⚡ *ENTREGA INMEDIATA (EN STOCK)*:\n`;
    stockItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* [${getBrandNameDisplay(item.brand)}]\n`;
      message += `   • Cantidad: ${item.quantity} x ${formatCurrency(item.price)}\n`;
      message += `   • Subtotal: ${formatCurrency(item.price * item.quantity)}\n`;
      if (item.notes) {
        message += `   • Nota: ${item.notes}\n`;
      }
    });
    message += `   *Subtotal Stock Inmediato:* ${formatCurrency(stockSubtotal)}\n\n`;
  }

  // 2. Pedido de campaña
  if (campaignItems.length > 0) {
    message += `📖 *PEDIDO POR REVISTA / CAMPAÑA ${campaignNumber}*:\n`;
    campaignItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* [${getBrandNameDisplay(item.brand)}]\n`;
      if (item.magazineCode) {
        message += `   • Código: ${item.magazineCode}`;
      }
      if (item.magazinePage) {
        message += ` | Pág: ${item.magazinePage}`;
      }
      message += `\n`;
      message += `   • Cantidad: ${item.quantity} x ${formatCurrency(item.price)}\n`;
      message += `   • Subtotal: ${formatCurrency(item.price * item.quantity)}\n`;
      if (item.notes) {
        message += `   • Nota / Tono: ${item.notes}\n`;
      }
    });
    message += `   *Subtotal Pedido Campaña:* ${formatCurrency(campaignSubtotal)}\n\n`;
  }

  // 3. Resumen financiero
  message += `💰 *TOTAL A PAGAR: ${formatCurrency(total)}*\n\n`;

  // 4. Datos del cliente
  message += `👤 *DATOS PARA LA ENTREGA:*\n`;
  message += `• *Nombre:* ${customer.fullName}\n`;
  message += `• *Teléfono:* ${customer.phone}\n`;
  message += `• *Dirección:* ${customer.address}\n`;
  message += `• *Ciudad / Barrio:* ${customer.city}\n`;
  if (customer.notes && customer.notes.trim() !== '') {
    message += `• *Indicaciones:* ${customer.notes}\n`;
  }
  if (customer.paymentMethod) {
    const paymentMap: Record<string, string> = {
      contra_entrega: 'Pago contra entrega',
      transferencia: 'Transferencia (Nequi / Daviplata / Bancolombia)',
      efectivo: 'Efectivo',
    };
    message += `• *Método de pago preferido:* ${paymentMap[customer.paymentMethod] || customer.paymentMethod}\n`;
  }

  message += `\n🌸 *Gracias por elegir Lausser Belleza*. Quedo pendiente de tu confirmación.`;

  // Clean phone number (remove +, spaces, hyphens)
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
