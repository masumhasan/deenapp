import AssistantClient from "@/components/assistant-client";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">
          AI Fiqh Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Get answers to your questions about Islamic jurisprudence.
        </p>
      </div>
      <AssistantClient />
    </div>
  );
}
