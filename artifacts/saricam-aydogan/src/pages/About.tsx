import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Shield, Users, Compass } from "lucide-react";
import { SEO } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";

export default function About() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Hakkımızda" 
        description="Sarıçam Aydoğan Kamp ve Balık. Karadeniz'in doğasından ilham alan tecrübemizle yanınızdayız." 
      />

      {/* Hero */}
      <section className="relative py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img 
            src={`${baseUrl}/mock/hero.jpg`} 
            alt="Orman dokusu" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mb-6">
              Doğaya Duyulan Saygı,<br />Yılların Tecrübesi
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto font-light">
              1995'ten beri Karadeniz'in hırçın doğasında denediğimiz, güvendiğimiz ekipmanları sizlerle buluşturuyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container px-4 max-w-4xl">
          <div className="prose prose-lg prose-p:text-muted-foreground prose-headings:font-serif mx-auto">
            <p className="text-xl leading-relaxed text-foreground font-medium mb-8">
              Her şey babamızın hafta sonu balık tutkusuyla başladı. O zamanlar kaliteli malzeme bulmak zordu, iyi bir olta veya rüzgara dayanan bir çadır için aylarca beklediğimiz olurdu.
            </p>
            <p>
              Sarıçam Aydoğan olarak hikayemiz, bu eksikliği kendi tecrübemizle doldurma kararı almamızla şekillendi. Küçük bir dükkanda başladığımız bu serüven, bugün doğa tutkunlarının buluşma noktası haline geldi. Bizim için burası sadece bir mağaza değil; av anılarının anlatıldığı, kamp rotalarının paylaşıldığı bir dost meclisi.
            </p>
            <p>
              Raflarımıza koyduğumuz her ürünü önce biz test ederiz. Yağmurda su alıyor mu? Soğukta sıcak tutuyor mu? Rüzgarda savruluyor mu? Çünkü biliyoruz ki doğada şakaya yer yoktur ve doğru ekipman hayat kurtarır.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <SectionHeading title="Değerlerimiz" align="center" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Shield,
                title: "Dürüstlük",
                desc: "İhtiyacınız olmayan veya işinize yaramayacak hiçbir ürünü size tavsiye etmeyiz. Güven, her şeyden önemlidir."
              },
              {
                icon: Users,
                title: "Aile Ortamı",
                desc: "Kapımızdan giren herkes bir müşteri değil, doğayı bizim kadar seven bir dosttur."
              },
              {
                icon: Compass,
                title: "Yerel Tecrübe",
                desc: "Karadeniz'in sert lodosunu da, yayla ayazını da iyi biliriz. Tavsiyelerimiz yaşanmışlıklardan gelir."
              }
            ].map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{val.title}</h3>
                <p className="text-muted-foreground">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24">
        <div className="container px-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none">
              <Compass className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8">Bize Ulaşın</h2>
              <p className="text-lg text-primary-foreground/80 mb-12">
                Mağazamıza uğrayıp çayımızı içebilir veya sorularınız için bize telefon ve WhatsApp üzerinden ulaşabilirsiniz.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Adres</h4>
                      <p className="text-primary-foreground/70">Atatürk Cad. No:123<br />Merkez / Trabzon</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Çalışma Saatleri</h4>
                      <p className="text-primary-foreground/70">Pazartesi - Cumartesi<br />09:00 - 19:30</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Telefon & WhatsApp</h4>
                      <p className="text-primary-foreground/70">+90 555 111 22 33</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">E-posta</h4>
                      <p className="text-primary-foreground/70">bilgi@saricamaydogan.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
