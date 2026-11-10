import type { SiteLocale } from '../../i18n/locales';
import type { ForumPost } from './types';
import { forumCategories as forumCategoriesEn } from '../forum';
import { enForumPosts } from './en-posts';

export function getForumCategories(_locale: SiteLocale = 'en') {
  return forumCategoriesEn;
}

export function getForumPosts(_locale: SiteLocale = 'en'): ForumPost[] {
  return enForumPosts;
}

export function getForumPost(slug: string, locale: SiteLocale = 'en'): ForumPost | undefined {
  return getForumPosts(locale).find((p) => p.slug === slug);
}

export function getForumPostsBySlugs(slugs: string[], locale: SiteLocale = 'en'): ForumPost[] {
  return slugs
    .map((slug) => getForumPost(slug, locale))
    .filter((p): p is ForumPost => Boolean(p));
}
