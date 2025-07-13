import TasbihClient from "@/components/tasbih-client";

export default function TasbihPage() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 text-center">
        Tasbih Counter
      </h1>
      <div className="flex-grow">
        <TasbihClient />
      </div>
    </div>
  );
}
