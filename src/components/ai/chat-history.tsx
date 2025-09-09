"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-dialog";
import { PlusIcon, MessageSquare, Trash2, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getChatHistoryAction,
  deleteChatAction,
} from "@/actions/chat-history-action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface ChatHistoryProps extends DialogProps {
  onChatSelect?: () => void;
}

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export function ChatHistory({ onChatSelect, ...props }: ChatHistoryProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [chats, setChats] = React.useState<Chat[]>([]);

  const { execute: getChatHistory, isExecuting: isLoading } = useAction(
    getChatHistoryAction,
    {
      onSuccess: (result) => {
        if (result.data) {
          console.log("Setting chats data:", result.data);
          // Ensure unique chats by ID to prevent duplicates
          const uniqueChats = result.data.filter(
            (chat, index, self) =>
              index === self.findIndex((c) => c.id === chat.id)
          );
          console.log("Unique chats:", uniqueChats);
          setChats(uniqueChats);
        }
      },
      onError: (error) => {
        console.error("Failed to fetch chat history:", error);
        toast.error("Failed to load chat history");
      },
    }
  );

  const { execute: deleteChat } = useAction(deleteChatAction, {
    onSuccess: () => {
      toast.success("Chat deleted successfully");
      // Refresh chat list
      getChatHistory({});
    },
    onError: (error) => {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat");
    },
  });

  // Filter chats based on search query
  const filteredChats = React.useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  // Load chats when dialog opens
  React.useEffect(() => {
    if (open) {
      console.log("Dialog opened, fetching chat history");
      getChatHistory({});
    }
  }, [open, getChatHistory]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "h" && (e.metaKey || e.ctrlKey)) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat({ chatId });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative h-8 w-8 rounded-md bg-muted/50 hover:bg-muted border border-border"
            )}
            onClick={() => setOpen(true)}
            {...props}
          >
            <MessageSquare className="size-4" />
            <span className="sr-only">Chat History</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl border-none bg-clip-padding p-2 pb-4 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
          <DialogHeader className="sr-only">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              <span>Chat History</span>
            </DialogTitle>
            <DialogDescription>
              Browse your previous conversations
            </DialogDescription>
          </DialogHeader>
          <Command className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border rounded-none bg-transparent">
            <CommandInput
              placeholder="Search chat history..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
              <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
                No chats found.
              </CommandEmpty>

              {/* New Chat Button */}
              <CommandGroup
                heading="Actions"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                <CommandItem
                  className="data-[selected=true]:border-input data-[selected=true]:bg-primary/10 h-9 rounded-md border border-transparent !px-3 font-medium"
                  onSelect={() => {
                    runCommand(() => router.push("/"));
                  }}
                >
                  <PlusIcon className="size-4" />
                  Start new chat
                </CommandItem>
              </CommandGroup>

              {/* Chat History List */}
              <CommandGroup
                heading="Recent Chats"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-5 w-12" />
                      </div>
                    ))}
                  </>
                ) : (
                  filteredChats.map((chat) => (
                    <CommandItem
                      key={chat.id}
                      value={chat.title}
                      className="data-[selected=true]:border-input data-[selected=true]:bg-input/50 min-h-12 rounded-md border border-transparent !px-3 font-medium group"
                      onSelect={() => {
                        runCommand(() => {
                          router.push(`/chat/${chat.id}`);
                          onChatSelect?.();
                        });
                      }}
                    >
                      <MessageSquare className="size-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">
                            {chat.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {chat.messageCount} messages
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(new Date(chat.updatedAt))}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Cursor rules applied correctly.
