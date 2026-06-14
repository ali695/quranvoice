/**
 * JSON-LD schema builders (server/client safe). Produces plain objects to be
 * rendered via the <JsonLd> component. Keep text factual — no invented
 * religious claims.
 */

import { APP_BASE_URL } from '@/lib/i18n/hreflang';

const ORG_NAME = 'QuranVoice';
const LOGO = `${APP_BASE_URL}/favicon.svg`;

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: APP_BASE_URL,
    description:
      'Read, listen to, and study the Noble Quran online — verified Arabic text, translations in many languages, tafsir, word-by-word, Tajweed and recitations.',
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: ORG_NAME, url: APP_BASE_URL },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${APP_BASE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: APP_BASE_URL,
    logo: LOGO,
    description:
      'A modern Quran platform for recitation, translation, tafsir, memorization and reflection, built on verified sources.',
  };
}

export function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: ORG_NAME,
    url: APP_BASE_URL,
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Read and listen to the Quran online with translations, tafsir, word-by-word, Tajweed, Mushaf layouts and memorization tools.',
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${APP_BASE_URL}${c.path}`,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

export function collectionPageSchema(params: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: `${APP_BASE_URL}${params.path}`,
    isPartOf: { '@type': 'WebSite', name: ORG_NAME, url: APP_BASE_URL },
  };
}

export function learningResourceSchema(params: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: params.name,
    description: params.description,
    url: `${APP_BASE_URL}${params.path}`,
    learningResourceType: 'Reference',
    isPartOf: { '@type': 'WebSite', name: ORG_NAME, url: APP_BASE_URL },
  };
}
