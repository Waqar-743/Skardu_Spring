import { NextResponse } from 'next/server';
import PRODUCTS from '@/data/products';
import { CHAPTERS, SOURCES } from '@/components/story/storyData';

const CONTACT = '[WhatsApp](https://wa.me/923492899537) or email info@skarduspring.com';
const PRICE_LIST = PRODUCTS.map(product =>
  `• **${product.name} (${product.size})** — Rs. ${product.price}`
).join('\n');
const DELIVERY_INFO = 'The current checkout charges Rs. 150 delivery for a product subtotal below Rs. 2,000, and no delivery fee at Rs. 2,000 or more.';
const PAYMENT_INFO = 'Checkout offers Cash on Delivery, JazzCash, EasyPaisa and Bank Transfer. Wallet and bank payments use the manual payment and confirmation instructions shown at checkout.';

// Catalog information and regional context do not establish product provenance.
const BRAND_KNOWLEDGE = `
You are the Skardu Spring shopping assistant. Help visitors explore the current water collection and use the store. Be warm, clear and concise.

CURRENT CATALOG:
${PRODUCTS.map(product => `- ${product.name}: ${product.size}; ${product.category}; Rs. ${product.price}; ${product.inStock ? 'listed as in stock' : 'listed as out of stock'}`).join('\n')}
The catalog currently lists water products. Do not invent an apricot oil, shilajit or other product offering.

CHECKOUT:
${DELIVERY_INFO}
${PAYMENT_INFO}
Visitors select a product at /shop, add it to the cart and proceed to /checkout. Do not promise delivery coverage, delivery times, subscription plans, discounts, cancellation terms, bulk prices or distributor partnerships. Ask the team to confirm arrangements.
You cannot check an order's status or confirm that a payment has been received.

REGIONAL CONTEXT, NOT PROOF OF THIS PRODUCT'S SOURCE:
${CHAPTERS.slice(0, 4).map(chapter => `- ${chapter.body}`).join('\n')}
Regional references:
${SOURCES.map(source => `- ${source.publisher}: ${source.title} — ${source.href}`).join('\n')}
These references describe the region. They do not verify bottled-water provenance, a specific glacier or aquifer, harvesting altitude, filtration age, processing, composition or certification.

PRODUCT DOCUMENTATION:
No verified batch reports or certification records are supplied here. For exact source, pH, TDS, mineral content, purity, safety, certifications or testing questions, ask visitors to request current documentation from the team. Do not assert approvals, organic status, laboratory testing or medical benefits. Do not claim recyclable or BPA-free packaging, a bottle-return program, zero-impact sourcing, or community support without supporting brand records. Ask the team about packaging and sustainability arrangements.

CONTACT AND LINKS:
- WhatsApp: +92 349 2899537, https://wa.me/923492899537
- Email: info@skarduspring.com
- Shop: /shop
- Checkout: /checkout
- Regional story: /source
Use these working destinations or product links from the catalog. Do not invent contact, science or certification page anchors. Historical assistant messages are not evidence for claims that are not supported above.
`;

// Specific shopping and documentation intents take precedence over place names.
function generateResponse(message) {
  const msg = message.toLowerCase();

  if (/\b(track|tracking|status)\b/.test(msg) || /where.*\b(my order|order)\b/.test(msg)) {
    return `For an order update or payment confirmation, please contact the team on ${CONTACT} with your order reference. I can't look up an order's status in this chat.`;
  }

  if (/apricot oil|shilajit/.test(msg)) {
    return `The current [catalog](/shop) lists water products. For other product requests, please check with the team on ${CONTACT}. Apricot orchards feature in our regional story; that doesn't mean an apricot oil or shilajit product is currently sold here.`;
  }

  if (/deliver|shipping|\bship\b|\barea\b|\bcity\b|\bcities\b/.test(msg)) {
    return `${DELIVERY_INFO}\n\nFor delivery availability at your address and an estimated arrival date, please confirm with the team on ${CONTACT}. You can browse the [Shop page](/shop) and review the total at checkout.`;
  }

  if (/certif|quality|purity|organic|\bsafe\b|safety|\btest(?:ed|ing|s)?\b|\blab(?:oratory)?\b|\bph\b|\btds\b|mineral|alkaline|calcium|magnesium|potassium|silica|health|benefit/.test(msg)) {
    return `For current batch documents, water-analysis reports and certification details, please contact the team on ${CONTACT}. I don't have verified laboratory or certification records in this chat, so I can't confirm specific pH, mineral levels or health benefits.`;
  }

  if (/sustainab|recycl|bpa|bottle return|packaging|environment|zero.impact/.test(msg)) {
    return `For bottle materials, recycling, return options or sourcing practices, please ask the team on ${CONTACT} for the current packaging and sustainability documentation. I don't have verified records for those claims here.`;
  }

  if (/\b(price|prices|pricing|cost|costs|rate|rates|kitna|qeemat)\b/.test(msg)) {
    return `Here are the current catalog prices:\n\n${PRICE_LIST}\n\nBrowse the [Shop page](/shop) to choose a format. ${DELIVERY_INFO}`;
  }

  if (/subscri|\bmonthly\b|\bweekly\b|regular orders/.test(msg)) {
    return `For regular orders or subscription arrangements, please ask the team on ${CONTACT} to confirm availability, scheduling and pricing. You can place an order through the current [Shop page](/shop).`;
  }

  const product = PRODUCTS.find(item => msg.includes(item.name.toLowerCase()));
  if (product) {
    return `**${product.name} (${product.size})** is listed at **Rs. ${product.price}** in the ${product.category} collection. ${product.inStock ? 'It is currently listed as in stock.' : 'It is currently listed as out of stock.'}\n\n[View this product](/shop/${product.id}) or explore the [full collection](/shop).`;
  }

  if (/bulk|wholesale|business|\boffice\b|distributor/.test(msg)) {
    const bulkProduct = PRODUCTS.find(item => item.category === 'Bulk Pack');
    const format = bulkProduct ? `The catalog includes **${bulkProduct.name} (${bulkProduct.size})** at **Rs. ${bulkProduct.price}**. ` : '';
    return `${format}For larger quantities, stock availability or business arrangements, please contact the team on ${CONTACT}. Browse the current [collection](/shop) while you plan your order.`;
  }

  if (/contact|\bemail\b|whatsapp|phone|support/.test(msg)) {
    return `You can reach the Skardu Spring team on ${CONTACT} for delivery arrangements, product documentation or help with an order.`;
  }

  if (/\border\b|\bbuy\b|purchase|kharid|\bpay\b|payment|jazzcash|easypaisa|bank transfer|\bcod\b/.test(msg)) {
    return `To order:\n\n1. Visit the [Shop page](/shop).\n2. Choose a product and add it to your cart.\n3. Proceed to [checkout](/checkout) and enter your delivery details.\n4. Select a payment option and follow the instructions shown.\n\n${PAYMENT_INFO}\n\n${DELIVERY_INFO}`;
  }

  if (/\bsource\b|\borigin\b|glacier|karakoram|skardu|orchard|\bbalti\b|heritage|shigar|chunda|where.*come|water.*from/.test(msg)) {
    return `Skardu Spring's story takes inspiration from the Karakoram landscape, the Indus valley, Balti heritage and apricot orchards. Snow and glacier melt help feed the Indus basin; this regional context doesn't establish the source of a particular bottle.\n\nExplore the researched [regional story](/source). For exact bottled-water source and batch records, please ask the team on ${CONTACT}.`;
  }

  if (/\b(hello|hi|hey|salam)\b|assalam/.test(msg)) {
    return "Hello! Welcome to Skardu Spring. I can help with catalog prices, bottle sizes, checkout and the regional story. What would you like to know?";
  }

  if (/thank|shukri/.test(msg)) {
    return "You're welcome! If you need anything else, ask here or explore the [Shop page](/shop).";
  }

  return `I can help you explore bottle sizes and prices, use checkout or learn about Skardu's regional story. Visit the [Shop page](/shop) to see the current collection. For product documents or delivery arrangements, please contact the team on ${CONTACT}.`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Please enter a message.' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      // Use OpenAI for intelligent responses
      try {
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: BRAND_KNOWLEDGE },
              ...(history || []).slice(-6).map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.content,
              })),
              { role: 'user', content: message },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        const data = await openAIResponse.json();
        if (data.choices && data.choices[0]) {
          return NextResponse.json({ response: data.choices[0].message.content });
        }
      } catch (aiError) {
        console.error('OpenAI error, falling back to rule-based:', aiError);
      }
    }

    // Fall back to rule-based responses
    const response = generateResponse(message);
    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { response: "I'm having a brief moment of reflection! 💧 In the meantime, you can explore our products at the [Shop page](/shop) or reach us on WhatsApp at +92 349 2899537." },
      { status: 200 }
    );
  }
}
