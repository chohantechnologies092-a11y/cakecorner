import Hero from '@/components/sections/Hero';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import CategoryProductRow from '@/components/sections/CategoryProductRow';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import MagicProcessing from '@/components/sections/MagicProcessing';
import { prisma } from '@/lib/db';

export default async function Home() {
  const rowCategories = await prisma.category.findMany({
    where: { showAsProductRow: true, isVisible: true },
    orderBy: { productRowOrder: "asc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Cake Corner",
    "image": "http://localhost:3000/logo.webp",
    "@id": "http://localhost:3000",
    "url": "http://localhost:3000",
    "telephone": "+44 123 456 7890",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "145 Ladypool Road",
      "addressLocality": "Birmingham",
      "postalCode": "B12 8LH",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.4632,
      "longitude": -1.8764
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "priceRange": "££"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FeaturedCategories />
      {rowCategories.map((cat, index) => (
        <CategoryProductRow key={cat.id} title={cat.name} categorySlug={cat.slug} isAlternate={index % 2 === 0} />
      ))}
      <TestimonialsSection />
      <BlogSection />
      <MagicProcessing />
    </main>
  );
}
