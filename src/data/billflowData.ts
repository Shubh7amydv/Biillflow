import { SiteConfig, ProductFeature, Testimonial, FaqItem } from '../types';

export const billflowConfig: SiteConfig = {
  brandName: 'BillFlow',
  brandTagline: 'Professional invoicing crafted for freelancers & independent studios',
  heroHeadline: 'Invoicing crafted for independent studios.',
  heroSubheadline:
    'The single source of truth for your client billing. BillFlow keeps your invoices, clients, payments, and cash flow in one unified system. Get paid faster and stay organized effortlessly.',
  primaryCtaText: 'Start invoicing now',
  secondaryCtaText: 'Explore live demo',
  currencySymbol: '$',
  supportEmail: 'support@billflow.app',
  supportPhone: '+1 (800) 555-0199',
  companyAddress: 'San Francisco, CA',
  announcementText: '✨ Introducing BillFlow 2.0: Instant PDF downloads, live line items, and client pay portal now live.',
  showAnnouncement: true,
  pricing: {
    starterMonthly: 0,
    starterAnnual: 0,
    proMonthly: 15,
    proAnnual: 12,
    payrollMonthlyBase: 0,
    payrollPerEmployee: 0,
    cardProcessingRate: 'Instant demo checkout',
    achProcessingRate: 'Simulated payment',
  },
  stats: {
    usersCount: '2,400+',
    moneyManaged: '$1.8M+',
    averageRating: '4.9 / 5',
    invoicesSent: '15,000+',
  },
};

export const billflowFeatures: ProductFeature[] = [
  {
    id: 'invoicing',
    title: 'Invoicing',
    tagline: 'Create custom invoices that get you paid 3x faster',
    description:
      'Design sleek, professional invoices in seconds with your custom logo and terms. Send invoices with public payment links or print and download PDFs.',
    bulletPoints: [
      'Unlimited professional invoices and line items',
      'Instant online client portal with simulated pay flow',
      'Automatic status tracking (Draft, Sent, Paid, Overdue)',
      'Calculated tax and discount subtotals in real-time',
      'Browser print and download PDF support',
    ],
    badge: 'Core Feature',
    statsText: 'Average invoice paid in under 48 hours with digital payment links',
    ctaText: 'Start invoicing for free',
    accentColor: 'blue',
  },
  {
    id: 'clients',
    title: 'Client Management',
    tagline: 'All your client relationships organized in one place',
    description:
      'Manage client contacts, billing addresses, and invoice histories seamlessly. Quickly issue new invoices to existing clients with autofill.',
    bulletPoints: [
      'Searchable client directory with phone, email, and address',
      'Client-specific invoice histories and lifetime values',
      'One-click client creation directly from invoice editor',
      'Safe deletion guards for clients with active invoices',
      'Seamless multi-client switching and overview',
    ],
    badge: 'CRM Built-In',
    statsText: 'Over 90% of freelancers save 4+ hours per month on client tracking',
    ctaText: 'Organize your clients',
    accentColor: 'teal',
  },
  {
    id: 'payments',
    title: 'Instant Payments',
    tagline: 'Get paid directly through public client links without friction',
    description:
      'Enable seamless digital payments on every invoice. Clients receive a non-guessable private link where they can view, print, download, and pay in one click.',
    bulletPoints: [
      'Clean unauthenticated public invoice portal for clients',
      'Simulated instant payment flow with card/mock options',
      'Immediate status update to Paid with timestamped confirmation',
      'Works seamlessly on mobile and desktop devices',
      'No hidden platform fees or transaction markups',
    ],
    badge: 'Fast Checkout',
    statsText: 'Zero payment processing lock-in — instant confirmation built-in',
    ctaText: 'Accept client payments',
    accentColor: 'indigo',
  },
  {
    id: 'reporting',
    title: 'Financial Dashboard',
    tagline: 'Clear metrics on earnings, outstanding balance, and overdue revenue',
    description:
      'Visual analytics that provide instant clarity on your business health. Track monthly income trends, outstanding receivables, and recent activity.',
    bulletPoints: [
      'Real-time revenue cards: Total Earned, Outstanding, and Overdue',
      'Interactive monthly income chart powered by Recharts',
      'Recent invoices table with instant status indicators',
      'Computed overdue alerts for invoices past their due dates',
      'Automated sequence numbering (e.g. INV-2026-0001)',
    ],
    badge: 'Analytics',
    statsText: 'Stay in complete control of your cash flow with real-time analytics',
    ctaText: 'View your dashboard',
    accentColor: 'emerald',
  },
];

export const billflowTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Maya Lin',
    role: 'Creative Director & Founder',
    company: 'Studio Form & Light',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    quote:
      'BillFlow completely transformed how I run my design studio. Invoices get paid in 48 hours instead of 30 days, and tracking outstanding accounts is effortless.',
    rating: 5,
    highlight: 'Paid in 48 hours instead of 30 days',
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'Independent Brand Designer',
    company: 'Vance Design Co.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    quote:
      'Being busy with client deadlines means I do not want complicated software. BillFlow lets me create an invoice in 30 seconds and send a clean link to my client.',
    rating: 5,
    highlight: 'Clean, fast invoicing in 30 seconds',
  },
  {
    id: 'test-3',
    name: 'Sofia Ramirez',
    role: 'Brand Consultant',
    company: 'Aura Strategy Group',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    quote:
      'The client portal and clean PDF export look incredibly professional. My clients always comment on how sleek and easy it is to pay their invoices.',
    rating: 5,
    highlight: 'Clients love the sleek payment experience',
  },
];

export const billflowFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is BillFlow free to use?',
    answer:
      'Yes! BillFlow is completely free for freelancers and studios. You can send unlimited invoices, manage unlimited clients, download PDFs, and share public payment links with zero hidden fees.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'How do public client invoice links work?',
    answer:
      'Each invoice generates a unique, non-guessable secure public token. You can copy and share this link directly with your client via email or Slack. They can view the invoice document, download a PDF, print it, or pay directly through the portal without needing to create an account.',
    category: 'Invoicing',
  },
  {
    id: 'faq-3',
    question: 'How are overdue invoices handled?',
    answer:
      'BillFlow automatically computes overdue status whenever an invoice is Sent and its due date has passed. Overdue invoices are highlighted with an alert badge and tracked in your dashboard overdue balance.',
    category: 'Billing',
  },
  {
    id: 'faq-4',
    question: 'Can I customize my studio branding and invoice prefix?',
    answer:
      'Yes. In your Studio Settings, you can configure your business name, upload your studio logo, set your preferred currency symbol (USD, EUR, GBP, CAD, etc.), and customize your invoice numbering prefix.',
    category: 'Settings',
  },
  {
    id: 'faq-5',
    question: 'How secure is my invoice and client data?',
    answer:
      'BillFlow uses industry-standard bcrypt encryption for password hashing and secure JWT session handling. All database queries are strictly scoped to your authenticated account.',
    category: 'Security',
  },
];
