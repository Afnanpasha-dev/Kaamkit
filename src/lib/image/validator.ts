import { SupportedImageMimeType, ValidationResult } from "./types";
import { getImageDimensions } from "./utils";

export const MAX_IMAGE_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const SUPPORTED_MIME_TYPES: SupportedImageMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function validateImageFile(file: File): Promise<ValidationResult> {
  if (!file) {
    return {
      isValid: false,
      error: "No file was selected. Please choose an image to proceed.",
    };
  }

  // 1. File Size Validation
  if (file.size === 0) {
    return {
      isValid: false,
      error: "The selected file is empty (0 bytes). Please choose a valid image file.",
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "This image is larger than the 25 MB limit. Please select a smaller image.",
    };
  }

  // 2. MIME Type / Extension Validation
  let mimeType = file.type as SupportedImageMimeType;
  const fileName = file.name.toLowerCase();

  const hasValidExtension =
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".png") ||
    fileName.endsWith(".webp");

  if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
    if (hasValidExtension) {
      // Fallback if browser didn't populate mimeType correctly
      if (fileName.endsWith(".png")) mimeType = "image/png";
      else if (fileName.endsWith(".webp")) mimeType = "image/webp";
      else mimeType = "image/jpeg";
    } else {
      return {
        isValid: false,
        error: "Unsupported file format. Please upload a JPG, PNG, or WebP image.",
      };
    }
  }

  // 3. Corrupt Image Validation (test decoding natural dimensions)
  try {
    const dimensions = await getImageDimensions(file);
    if (dimensions.width === 0 || dimensions.height === 0) {
      return {
        isValid: false,
        error: "That image couldn't be processed. The file appears to be corrupted or unreadable.",
      };
    }

    // Guard against unreasonably extreme dimensions that could crash browser canvas memory
    if (dimensions.width > 12000 || dimensions.height > 12000) {
      return {
        isValid: false,
        error: "Image dimensions exceed 12,000 pixels. Please use a smaller photo.",
      };
    }

    return {
      isValid: true,
      file,
      dimensions,
    };
  } catch {
    return {
      isValid: false,
      error: "That image couldn't be processed. Try another image or a smaller file.",
    };
  }
}
