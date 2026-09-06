import { getCollection } from "astro:content";
import fallbackImage from "../assets/og-1200x630.jpg";

const sortByDateDesc = (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf();

export async function getAuthorMap() {
  const authors = await getCollection("authors");

  return new Map(
    authors.map((author) => [
      author.id,
      {
        id: author.id,
        name: author.data.publicName,
        slug: author.id,
        image: author.data.avatarImage?.src || author.data.avatarUrl,
        imageAlt: author.data.avatarImage?.alt || author.data.avatarAlt || author.data.publicName,
      },
    ]),
  );
}

export async function getCategoryMap(lang) {
  const categories = await getCollection("categories");

  return new Map(
    categories
      .filter((category) => (category.data.lang || "es") === lang)
      .map((category) => [
        category.id,
        {
          id: category.id,
          title: category.data.title,
          slug: category.id,
          description: category.data.description,
        },
      ]),
  );
}

export async function getCategories(lang) {
  const categories = await getCollection("categories");

  return categories
    .filter((category) => (category.data.lang || "es") === lang)
    .map((category) => ({
      id: category.id,
      title: category.data.title,
      slug: category.id,
      description: category.data.description,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getBlogPosts(lang, options = {}) {
  const [posts, authorMap, categoryMap] = await Promise.all([
    getCollection("blog"),
    getAuthorMap(),
    getCategoryMap(lang),
  ]);

  return posts
    .filter((post) => (post.data.lang || "es") === lang)
    .filter((post) => (options.includeDrafts ? true : post.data.status === "published"))
    .map((post) => normalizePost(post, authorMap, categoryMap))
    .sort(sortByDateDesc);
}

export function normalizePost(post, authorMap, categoryMap) {
  const author = post.data.author ? authorMap.get(post.data.author) : undefined;
  const category = post.data.category ? categoryMap.get(post.data.category) : undefined;
  const image = post.data.thumbnailUrl || post.data.heroImageUrl || post.data.ogImageUrl || fallbackImage;

  return {
    entry: post,
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    excerpt: post.data.excerpt || post.data.description,
    duration: post.data.readingMinutes || estimateReadingMinutes(post.body || ""),
    date: post.data.pubDate,
    _createdAt: post.data.pubDate,
    updatedDate: post.data.updatedDate,
    slug: post.id,
    image,
    imageAlt: post.data.thumbnailAlt || post.data.heroImageAlt || post.data.title,
    author,
    categories: category,
    category,
    tags: post.data.tags || [],
    featured: post.data.featured,
    canonicalUrl: post.data.canonicalUrl,
    ogTitle: post.data.ogTitle,
    ogDescription: post.data.ogDescription,
    ogImageUrl: post.data.ogImageUrl,
    faqs: post.data.faqs || [],
  };
}

export function estimateReadingMinutes(text) {
  const wordCount = String(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getHeadingsFromMarkdown(markdown) {
  return String(markdown)
    .split("\n")
    .map((line) => line.match(/^(#{2,6})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const text = match[2].replace(/[#*_`]/g, "").trim();

      return {
        id: slugifyHeading(text),
        text,
        level: match[1].length,
      };
    });
}

export function slugifyHeading(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
