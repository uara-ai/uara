import { requireAuth } from "@/lib/auth";
import type { ArtifactKind } from "@/components/ai/artifact";
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is missing"
    ).toResponse();
  }

  try {
    const user = await requireAuth();
    const documents = await getDocumentsById({ id });

    const [document] = documents;

    if (!document) {
      return new ChatSDKError("not_found:document").toResponse();
    }

    if (document.userId !== user.id) {
      return new ChatSDKError("forbidden:document").toResponse();
    }

    return Response.json(documents, { status: 200 });
  } catch (error) {
    console.error("Get document error:", error);
    return new ChatSDKError("unauthorized:document").toResponse();
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  try {
    const user = await requireAuth();

    const {
      content,
      title,
      kind,
    }: { content: string; title: string; kind: ArtifactKind } =
      await request.json();

    const documents = await getDocumentsById({ id });

    if (documents.length > 0) {
      const [document] = documents;

      if (document.userId !== user.id) {
        return new ChatSDKError("forbidden:document").toResponse();
      }
    }

    const document = await saveDocument({
      id,
      content,
      title,
      kind,
      userId: user.id,
    });

    return Response.json(document, { status: 200 });
  } catch (error) {
    console.error("Save document error:", error);
    return new ChatSDKError("unauthorized:document").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const timestamp = searchParams.get("timestamp");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter id is required."
    ).toResponse();
  }

  if (!timestamp) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter timestamp is required."
    ).toResponse();
  }

  try {
    const user = await requireAuth();
    const documents = await getDocumentsById({ id });

    const [document] = documents;

    if (document.userId !== user.id) {
      return new ChatSDKError("forbidden:document").toResponse();
    }

    const documentsDeleted = await deleteDocumentsByIdAfterTimestamp({
      id,
      timestamp: new Date(timestamp),
    });

    return Response.json(documentsDeleted, { status: 200 });
  } catch (error) {
    console.error("Delete document error:", error);
    return new ChatSDKError("unauthorized:document").toResponse();
  }
}
