import { withAuth } from "@workos-inc/authkit-nextjs";

interface GreetingHeaderProps {
  className?: string;
}

export async function GreetingHeader({ className }: GreetingHeaderProps) {
  const { user } = await withAuth();

  // Get current time-based greeting
  const now = new Date();
  const hour = now.getHours();

  let timeOfDay = "";
  if (hour >= 5 && hour < 12) {
    timeOfDay = "Morning";
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = "Afternoon";
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = "Evening";
  } else {
    timeOfDay = "Night";
  }

  // Extract user name from WorkOS user object
  let userName = "User";
  if (user) {
    // Use first name if available, otherwise fall back to "User"
    userName = user.firstName || "User";
  }

  const greeting = `Good ${timeOfDay}, ${userName}`;

  // Split greeting to apply gradient to user name only
  const greetingParts = greeting.split(", ");
  const timeGreeting = greetingParts[0];
  const userNamePart = greetingParts[1];

  return (
    <div className={className || ""}>
      <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100">
        {timeGreeting}
        {userNamePart && (
          <>
            ,{" "}
            <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
              {userNamePart}
            </span>
          </>
        )}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        here is a quick look at how things are going.
      </p>
    </div>
  );
}

// Cursor rules applied correctly.
