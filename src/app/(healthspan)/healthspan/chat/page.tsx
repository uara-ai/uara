import Chat from "@/components/ai/chat";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-var(--header-height)-50px)] overflow-hidden">
      <Chat />
    </div>
  );
}
