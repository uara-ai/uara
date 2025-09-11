import { requireAuth } from "@/lib/auth";
import { getSuggestionsByDocumentId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter documentId is required."
    ).toResponse();
  }

  try {
    const user = await requireAuth();

    const suggestions = await getSuggestionsByDocumentId({
      documentId,
    });

    const [suggestion] = suggestions;

    if (!suggestion) {
      return Response.json([], { status: 200 });
    }

    if (suggestion.userId !== user.id) {
      return new ChatSDKError("forbidden:api").toResponse();
    }

    return Response.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("Get suggestions error:", error);
    return new ChatSDKError("unauthorized:suggestions").toResponse();
  }
}
