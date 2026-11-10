import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const ALLOWED_BLOG_SLUGS = [
  "turning-30-reproductive-health",
  "uti-prevention-and-care",
  "pregnancy-cramps-vs-labour",
  "understanding-pcos-hormonal-balance"
] as const;

export type AllowedBlogSlug = (typeof ALLOWED_BLOG_SLUGS)[number];

export interface BlogPostFrontmatter {
  slug: AllowedBlogSlug;
  title: string;
  titleUr: string;
  excerpt: string;
  excerptUr: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  lastReviewed: string;
  readingTimeMinutes: number;
  category: string;
  categoryUr: string;
  serviceSlug: string;
  approvalStatus: string;
}

export function isAllowedBlogSlug(slug: string): slug is AllowedBlogSlug {
  return (ALLOWED_BLOG_SLUGS as readonly string[]).includes(slug);
}

export function loadAllBlogPostsMeta(): BlogPostFrontmatter[] {
  const blogDir = path.join(process.cwd(), "content", "blog");

  return ALLOWED_BLOG_SLUGS.map((slug) => {
    const fullPath = path.join(blogDir, `${slug}.mdx`);
    const rawFile = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(rawFile);

    return {
      slug,
      title: String(data.title ?? ""),
      titleUr: String(data.titleUr ?? data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      excerptUr: String(data.excerptUr ?? data.excerpt ?? ""),
      author: String(data.author ?? "Dr. Tooba Iqbal, MBBS, MCPS"),
      authorRole: String(
        data.authorRole ?? "Consultant Gynecologist & Obstetrician"
      ),
      publishedAt: String(data.publishedAt ?? "2026-10-15"),
      lastReviewed: String(data.lastReviewed ?? "2026-11-06"),
      readingTimeMinutes: Number(data.readingTimeMinutes ?? 5),
      category: String(data.category ?? "Women's Health"),
      categoryUr: String(data.categoryUr ?? "خواتین کی صحت"),
      serviceSlug: String(data.serviceSlug ?? "general-gynecology"),
      approvalStatus: String(
        data.approvalStatus ?? "[DRAFT — REQUIRES CLIENT MEDICAL APPROVAL]"
      )
    };
  });
}
