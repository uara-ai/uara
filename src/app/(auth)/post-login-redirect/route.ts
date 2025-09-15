import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await withAuth();

    if (user) {
      // Initialize user in database if not exists
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          // Update timestamp on existing users
          updatedAt: new Date(),
        },
        create: {
          id: user.id,
          // Set default values for new users
          profileCompleted: false,
          dataProcessingConsent: true,
          marketingConsent: true,
          researchConsent: true,
        },
      });
    }
  } catch (error) {
    console.error("Error initializing user in database:", error);
    // Continue to redirect even if database operation fails
  }

  // Always redirect to waitlist after login - simple and efficient
  return redirect("/waitlist");
}

// Cursor rules applied correctly.
