import type { SiteLocale } from '../../i18n/locales';
import type { BlogPostFull } from './types';
import { enBlogArticles } from './posts/en-articles';

function sortBlogPosts(posts: BlogPostFull[]): BlogPostFull[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPostsForLocale(_locale: SiteLocale = 'en'): BlogPostFull[] {
  return sortBlogPosts(enBlogArticles);
}

export function getBlogPost(slug: string, locale: SiteLocale = 'en'): BlogPostFull | undefined {
  return getBlogPostsForLocale(locale).find((p) => p.slug === slug);
}
