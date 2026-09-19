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
    description: "Compress, resize, extract text, and convert images for government forms and jobs.",
    iconName: "Image",
  },
  {
    id: "text",
    name: "Text & Writing",
    description: "Count words, format text, simplify sentences, and check readability.",
    iconName: "FileEdit",
  },
  {
    id: "utility",
    name: "Utilities",
    description: "Everyday generators, calculators, and quick digital helpers.",
    iconName: "Wrench",
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
    relatedToolSlugs: ["image-resizer", "image-to-text", "pdf-to-images"],
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
    relatedToolSlugs: ["image-compressor", "image-to-text", "pdf-to-images"],
  },
  {
    id: "image-to-text",
    name: "Image to Text (OCR)",
    slug: "image-to-text",
    description:
      "Extract editable text from scanned documents, notes, and photos using client-side OCR.",
    category: "image",
    categoryLabel: "Image Tools",
    iconName: "ScanText",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "3s",
    clientSideOnly: true,
    keywords: [
      "image text",
      "ocr",
      "extract text",
      "photo text",
      "image ocr",
      "photo to text",
      "scanned text extractor",
    ],
    relatedToolSlugs: ["image-compressor", "image-resizer", "pdf-to-word"],
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
    id: "images-to-pdf",
    name: "Images to PDF",
    slug: "images-to-pdf",
    description:
      "Combine multiple JPG, PNG, or WebP images into a single PDF document with page sizing and layout controls.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "Images",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "images to pdf",
      "jpg to pdf",
      "png to pdf",
      "photo to pdf",
      "pictures to pdf",
      "convert images to pdf",
      "image compiler",
    ],
    relatedToolSlugs: ["image-compressor", "merge-pdf", "compress-pdf"],
  },
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
    relatedToolSlugs: ["split-pdf", "compress-pdf", "pdf-to-word"],
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
    relatedToolSlugs: ["merge-pdf", "compress-pdf", "pdf-to-word"],
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
    relatedToolSlugs: ["merge-pdf", "split-pdf", "pdf-to-word"],
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
    relatedToolSlugs: ["images-to-pdf", "pdf-to-word", "image-compressor"],
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    slug: "pdf-to-word",
    description:
      "Convert text-based PDF documents into editable Word (.docx) files directly in your browser.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "FileType",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "pdf word",
      "pdf to docx",
      "pdf converter",
      "convert pdf",
      "pdf document",
      "pdf to word online",
    ],
    relatedToolSlugs: ["merge-pdf", "split-pdf", "image-to-text"],
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
    relatedToolSlugs: ["age-calculator", "image-to-text"],
  },

  // Utilities
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description:
      "Create customizable, high-resolution QR codes for websites, text, phone numbers, and email addresses.",
    category: "utility",
    categoryLabel: "Utilities",
    iconName: "QrCode",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "qr",
      "qr code",
      "qr generator",
      "barcode",
      "url qr",
      "link qr",
      "text qr",
      "scan qr",
      "generate qr code",
    ],
    relatedToolSlugs: ["image-compressor", "image-resizer", "age-calculator"],
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    slug: "age-calculator",
    description:
      "Calculate your exact age in years, months, days, total days lived, and countdown to your next birthday.",
    category: "utility",
    categoryLabel: "Utilities",
    iconName: "Calendar",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "Instant",
    clientSideOnly: true,
    keywords: [
      "age",
      "age calculator",
      "calculate age",
      "birthday calculator",
      "exact age",
      "dob calculator",
      "how old am i",
    ],
    relatedToolSlugs: ["word-character-counter", "qr-code-generator"],
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
