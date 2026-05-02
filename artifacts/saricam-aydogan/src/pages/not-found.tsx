import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6 pt-32 pb-24">
      <div className="max-w-2xl text-center">
        <span className="eyebrow justify-center">Hata 404</span>
        <h1 className="editorial-heading text-5xl md:text-7xl mb-8">
          Yolumuzu.
          <br />
          <em className="italic font-light text-secondary">Kaybettik.</em>
        </h1>
        <p className="text-foreground/60 text-base md:text-lg leading-relaxed font-light max-w-md mx-auto mb-12">
          Aradığınız sayfayı bulamadık. Belki bir dağ patikasında saptınız —
          ana sayfaya dönüş çok yakında.
        </p>
        <Link href="/">
          <span className="link-hairline cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Ana Sayfaya Dön
          </span>
        </Link>
      </div>
    </div>
  );
}
