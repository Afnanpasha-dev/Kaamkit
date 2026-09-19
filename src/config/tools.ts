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
  // Text Tools
  {
    id: "word-counter",
    name: "Word & Character Counter",
    slug: "word-counter",
    description:
      "Instant word count, character count, reading time estimate, and text case transformation.",
    category: "text",
    categoryLabel: "Text & Writing",
    iconName: "FileSpreadsheet",
    status: "active",
    statusLabel: "Ready to Use",
    popular: true,
    estimatedTime: "Instant",
    clientSideOnly: true,
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
    status: "in-development",
    statusLabel: "In Development",
    popular: true,
    estimatedTime: "10s",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    slug: "split-pdf",
    description:
      "Extract specific pages or break a large PDF into smaller standalone files.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "Scissors",
    status: "coming-soon",
    statusLabel: "Coming Soon",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    slug: "compress-pdf",
    description:
      "Reduce PDF file size for portal uploads (UPSC, SSC, State exams) while preserving text clarity.",
    category: "pdf",
    categoryLabel: "PDF Tools",
    iconName: "Minimize2",
    status: "in-development",
    statusLabel: "In Development",
    popular: true,
    estimatedTime: "15s",
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

  // Image Tools
  {
    id: "compress-image",
    name: "Compress Image",
    slug: "compress-image",
    description:
      "Shrink JPG, PNG, and WebP file sizes down to exact KB requirements for application portals.",
    category: "image",
    categoryLabel: "Image Tools",
    iconName: "ImageDown",
    status: "in-development",
    statusLabel: "In Development",
    popular: true,
    estimatedTime: "5s",
  },
  {
    id: "resize-image",
    name: "Resize Photo & Signature",
    slug: "resize-image",
    description:
      "Adjust photo dimensions in pixels or cm for government forms, passports, and exams.",
    category: "image",
    categoryLabel: "Image Tools",
    iconName: "Crop",
    status: "in-development",
    statusLabel: "In Development",
    popular: true,
    estimatedTime: "5s",
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

  // Resume Tools
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

  // Study Tools
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
