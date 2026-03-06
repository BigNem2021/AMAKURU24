'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/translations';
import { Header, NewsCard, Footer } from '@/app/components';

export default function CategoryPage({ params: paramsPromise }: { params: Promise<{ category: string }> }) {
  const params = React.use(paramsPromise);
  const { language } = useAppStore();
  const t = getTranslation(language);
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryTitles: Record<string, string> = {
    amakuru: 'Amakuru',
    politiki: 'Politiki',
    ubuzima: 'Ubuzima',
    uburezi: 'Uburezi',
    ubukungu: 'Ubukungu',
    ikoranabuhanga: 'Ikoranabuhanga',
    imyidagaduro: 'Imyidagaduro',
    ubutabera: 'Ubutabera',
    ibidukikije: 'Ibidukikije',
    iyobokamana: 'Siporo',
    imyemerere: 'Imyemerere',
  };

  const categoryDescription: Record<string, string> = {
    amakuru: 'Amakuru agezweho buri gihe na buri munsi',
    politiki: 'Inkuru n\'ibiganiro kuri politiki z\'ibihugu n\'imicungire yabyo',
    ubuzima: 'Inkuru, ibiganiro n\'ubushakashatsi ku muntu n\'imibereho ye',
    uburezi: 'Inkuru zivuga ku burezi, uko amasomo atangwa n\'ireme ryayo mu kuzahura ubukungu',
    ubukungu: 'Inkuru z\'ibikorwa bitandukanye biteza imbere ubukungu n\'imicungire yabwo',
    ikoranabuhanga: 'Inkuru n\'ibiganiro by\'ikoranabuhanga n\'uruhare rwaryo mu iterambere',
    imyidagaduro: 'Ibiganiro n\'inkuru, Imyidagaduro, Imyambarire n\'ibindi bireba ibyishimo by\'abantu',
    ubutabera: 'Amakuru n\'ibiganiro birebana n\'uburenganzira bwa muntu n\'amategeko',
    ibidukikije: 'Inkuru n\'ibiganiro birebana n\'ibidukikije, isi n\'Ibiyikorerwaho birimo Ubuhinzi n\'Ubworozi',
    iyobokamana: 'Inkuru zivuga ku Imikino itandukanye',
    imyemerere: 'Inkuru n\'ibiganiro birebana n\'imanudi n\'imyemerere y\'ikiristo',
  };

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles?category=${params.category}`);
        const data = await response.json();
        setArticles(data.data || []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [params.category]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Category Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl md:text-2xl font-bold mb-0.5">
              {categoryTitles[params.category] || 'Category'}
            </h1>
            <p className="text-xs text-primary-100">
              {categoryDescription[params.category] || 'Latest stories in this category.'}
            </p>
          </div>
        </section>

        {/* Filters & Sorting */}
        <section className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Showing {articles.length} articles
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Kurikiranya uhereye:</label>
                <select className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm">
                  <option>Iziheruka</option>
                  <option>Izasomwe cyane</option>
                  <option>Izavuzweho cyane</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">Inkuru ziri gufunguka...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <NewsCard key={article.id} {...article} sources={[]} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Nta nkuru zibonetse muri iki gice.
                </p>
              </div>
            )}

            {/* Pagination */}
            {articles.length > 0 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  ← {t.common.previous}
                </button>
                <div className="flex gap-1">
                  {[1, 2, 3, '...', 10].map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-2 rounded transition-colors ${
                        page === 1
                          ? 'bg-primary-600 text-white'
                          : 'border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  {t.common.next} →
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
