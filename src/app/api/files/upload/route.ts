import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/auth";

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    // Update the file type based on the kind of files you want to accept
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "text/plain",
          "application/pdf",
          "text/csv",
        ].includes(file.type),
      {
        message: "File type should be JPEG, PNG, TXT, PDF, or CSV",
      }
    ),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get("file") as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      // Process file content without storing it
      let summary = "";
      let content = "";

      if (file.type.startsWith("text/") || file.type === "text/csv") {
        // For text files, read content directly
        content = new TextDecoder().decode(fileBuffer);
        summary = `Text file "${filename}" processed. Content length: ${content.length} characters.`;
      } else if (file.type.startsWith("image/")) {
        // For images, just provide metadata
        summary = `Image file "${filename}" processed. Size: ${(
          file.size / 1024
        ).toFixed(2)} KB, Type: ${file.type}`;
        content = `Image file: ${filename}`;
      } else if (file.type === "application/pdf") {
        // For PDFs, provide metadata (would need pdf parsing library for content)
        summary = `PDF file "${filename}" processed. Size: ${(
          file.size / 1024
        ).toFixed(2)} KB`;
        content = `PDF file: ${filename}`;
      }

      return NextResponse.json({
        success: true,
        filename,
        fileType: file.type,
        fileSize: file.size,
        summary,
        content:
          content.length > 10000
            ? content.substring(0, 10000) + "..."
            : content,
      });
    } catch (error) {
      console.error("File processing failed:", error);
      return NextResponse.json(
        { error: "File processing failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
