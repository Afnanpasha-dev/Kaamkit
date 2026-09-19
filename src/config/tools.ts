import { ToolCategory, ToolDefinition, CategoryInfo } from "@/types/tools";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress, and convert PDF documents seamlessly.",
    iconName: "FileText",
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Compress, resize, and convert images for government forms and jobs.",
    iconName: "Image",
  },
  {
    id: "text",
    name: "Text & Writing",
    description: "Count words, format text, simplify sentences, and check readability.",
    iconName: "FileEdit",
  },
  {
    id: "resume",
    name: "Resume Helper",
    description: "Analyze and improve your resume for modern hiring standards.",
    iconName: "Briefcase",
  },
  {
    id: "study",
    name: "Study Tools",
    description: "Generate practice questions, summarize notes, and create flashcards.",
    iconName: "GraduationCap",
  },
];

export const TOOLS: ToolDefinition[] = [
  // Image Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    description:
      "Shrink JPG, PNG, and WebP file sizes down to exact KB requirements for application portals.",
    category: "image",
    categoryLabel: "Image Tools",
    iconName: "ImageDown",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    popularOrder: 1,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "compress image",
      "reduce photo size",
      "shrink jpg",
      "png compress",
      "webp",
      "50 kb",
      "100 kb",
      "photo size reducer",
      "exam photo",
    ],
    relatedToolSlugs: ["image-resizer", "pdf-to-images"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    slug: "image-resizer",
    description:
      "Adjust photo and signature dimensions in pixels for government forms, passports, and exams.",
    category: "image",
    categoryLabel: "Image Tools",
    iconName: "Crop",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    popularOrder: 3,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "resize photo",
      "resize image",
      "passport photo",
      "signature resize",
      "upsc photo",
      "ssc photo",
      "aspect ratio",
      "pixel dimensions",
      "photo crop",
    ],
    relatedToolSlugs: ["image-compressor", "pdf-to-images"],
  },
  {
    id: "convert-image",
    name: "Convert Image Format",
    slug: "convert-image",
    description:
      "Quickly convert between PNG, JPG, and WebP formats without quality loss.",
    category: "image",
    categoryLabel: "Image Tools",
    iconName: "FileImage",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },

  // PDF Tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    slug: "merge-pdf",
    description:
      "Combine multiple PDF documents into a single organized file in seconds.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "Layers",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    popularOrder: 2,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "merge pdf",
      "combine pdf",
      "join pdf",
      "combine documents",
      "attach pdf",
      "unite pdf files",
    ],
    relatedToolSlugs: ["split-pdf", "compress-pdf", "pdf-to-images"],
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    slug: "split-pdf",
    description:
      "Extract specific pages or page ranges from a PDF into a clean standalone file.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "Scissors",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    popularOrder: 5,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "split pdf",
      "extract pages",
      "cut pdf",
      "separate pdf",
      "remove pages from pdf",
      "page range",
    ],
    relatedToolSlugs: ["merge-pdf", "compress-pdf", "pdf-to-images"],
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    slug: "compress-pdf",
    description:
      "Optimize PDF object streams and structure directly in your browser for portal uploads.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "Minimize2",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "compress pdf",
      "reduce pdf size",
      "shrink pdf",
      "pdf size reducer",
      "optimize pdf",
      "compact pdf",
    ],
    relatedToolSlugs: ["merge-pdf", "split-pdf", "pdf-to-images"],
  },
  {
    id: "pdf-to-images",
    name: "PDF to Images",
    slug: "pdf-to-images",
    description:
      "Convert and extract PDF document pages into high-resolution JPG or PNG images.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "FileImage",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    popularOrder: 6,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "convert pdf to images",
      "pdf to jpg",
      "pdf to png",
      "extract images from pdf",
      "save pdf as photo",
      "pdf page image",
    ],
    relatedToolSlugs: ["merge-pdf", "compress-pdf", "image-compressor"],
  },
  {
    id: "convert-pdf",
    name: "Convert to PDF",
    slug: "convert-pdf",
    description:
      "Convert documents and images into clean, standardized PDF files.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "RefreshCw",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },

  // Text Tools
  {
    id: "word-character-counter",
    name: "Word & Character Counter",
    slug: "word-character-counter",
    description:
      "Instant word count, character count, reading time estimate, and text case transformation.",
    category: "text",
    categoryLabel: "Text & Writing",
    iconName: "FileSpreadsheet",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    popularOrder: 4,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "word count",
      "character count",
      "letter count",
      "reading time",
      "sentence count",
      "paragraph count",
      "essay words",
      "case converter",
      "text counter",
    ],
    relatedToolSlugs: ["image-compressor", "image-resizer"],
  },
  {
    id: "text-summarizer",
    name: "Text Summarizer",
    slug: "text-summarizer",
    description:
      "Condense long articles, paragraphs, or notes into concise, digestible bullet points.",
    category: "text",
    categoryLabel: "Text & Writing",
    iconName: "AlignLeft",
    status: "in-development",
    statusLabel: "In Development",
    popular: false,
    estimatedTime: "30s",
  },
  {
    id: "text-simplifier",
    name: "Simplify Text",
    slug: "text-simplifier",
    description:
      "Rewrite complex, bureaucratic, or academic English into plain, clear language.",
    category: "text",
    categoryLabel: "Text & Writing",
    iconName: "Sparkles",
    status: "coming-soon",
    statusLabel: "Coming Soon",
    popular: false,
  },
  {
    id: "grammar-helper",
    name: "Grammar & Style Improver",
    slug: "grammar-helper",
    description:
      "Identify common grammatical slips, spelling mistakes, and awkward phrasing.",
    category: "text",
    categoryLabel: "Text & Writing",
    iconName: "CheckCheck",
    status: "coming-soon",
    statusLabel: "Coming Soon",
    popular: false,
  },

  // Resume Tools (Future)
  {
    id: "resume-improver",
    name: "Resume Format Improver",
    slug: "resume-improver",
    description:
      "Action-oriented bullet point feedback to make your job applications stand out.",
    category: "resume",
    categoryLabel: "Resume Helper",
    iconName: "FileCheck",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },
  {
    id: "resume-analyzer",
    name: "Resume Keyword Analyzer",
    slug: "resume-analyzer",
    description:
      "Check your resume against target job descriptions for ATS keyword matching.",
    category: "resume",
    categoryLabel: "Resume Helper",
    iconName: "Search",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },

  // Study Tools (Future)
  {
    id: "practice-questions",
    name: "Practice Question Generator",
    slug: "practice-questions",
    description:
      "Turn your textbook chapters and notes into multiple-choice and revision questions.",
    category: "study",
    categoryLabel: "Study Tools",
    iconName: "HelpCircle",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },
  {
    id: "study-summarizer",
    name: "Study Material Summarizer",
    slug: "study-summarizer",
    description:
      "Condense lengthy lecture notes and study material into high-yield revision summaries.",
    category: "study",
    categoryLabel: "Study Tools",
    iconName: "BookOpen",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },
  {
    id: "flashcard-creator",
    name: "Quick Flashcard Creator",
    slug: "flashcard-creator",
    description:
      "Create high-yield active recall flashcard sets from your study syllabus.",
    category: "study",
    categoryLabel: "Study Tools",
    iconName: "BookMarked",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },
];

/**
 * Returns only tools that are currently functional and active.
 */
export function getActiveTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.status === "active");
}

/**
 * Returns only categories that contain active tools.
 */
export function getActiveCategories(): CategoryInfo[] {
  const activeCategoryIds = new Set(getActiveTools().map((t) => t.category));
  return CATEGORIES.filter((c) => activeCategoryIds.has(c.id));
}

/**
 * Returns active tools ordered by their homepage presentation order.
 */
export function getPopularTools(): ToolDefinition[] {
  return getActiveTools()
    .filter((t) => t.popularOrder !== undefined)
    .sort((a, b) => (a.popularOrder ?? 99) - (b.popularOrder ?? 99));
}

/**
 * Finds a tool definition by its unique slug.
 */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/**
 * Returns related active tools for a given tool slug.
 */
export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool || !tool.relatedToolSlugs || tool.relatedToolSlugs.length === 0) {
    // Fallback to other active tools in the same category, or any active tools
    return getActiveTools()
      .filter((t) => t.slug !== slug)
      .slice(0, 3);
  }

  const related = tool.relatedToolSlugs
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolDefinition => t !== undefined && t.status === "active");

  return related.slice(0, 3);
}
