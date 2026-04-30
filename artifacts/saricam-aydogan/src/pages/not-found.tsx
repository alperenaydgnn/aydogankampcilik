import { Link } from "wouter";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-background px-4">
      <Compass className="w-24 h-24 text-secondary mb-8 opacity-50" />
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-center">
        Yolumuzu Kaybettik
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        Aradığınız sayfayı bulamadık. Ormanda kaybolmuş olabilirsiniz, ama anasayfaya dönmek çok kolay.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full gap-2 text-lg px-8 py-6">
          <ArrowLeft className="w-5 h-5" />
          Anasayfaya Dön
        </Button>
      </Link>
    </div>
  );
}
