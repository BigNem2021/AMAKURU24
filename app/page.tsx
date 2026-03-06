'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/translations';
import { Header, NewsCard, Footer, BreakingNewsCarousel } from './components';

export default function Home() {
  const router = useRouter();
  const { language } = useAppStore();
  const t = getTranslation(language);
  const [articles, setArticles] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [mostViewed, setMostViewed] = useState<any[]>([]);
  const [adverts, setAdverts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles?limit=12');
        const data = await response.json();
        const allArticles = data.data || [];
        
        // Find featured article
        const featuredArticle = allArticles.find((a: any) => a.featured) || allArticles[0];
        setFeatured(featuredArticle);
        setArticles(allArticles);
        
        // Set most viewed (featured articles + random mix)
        const mostViewedArticles = allArticles.filter((a: any) => a.featured).slice(0, 3);
        if (mostViewedArticles.length < 3) {
          mostViewedArticles.push(...allArticles.slice(0, 3 - mostViewedArticles.length));
        }
        setMostViewed(mostViewedArticles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdverts = async () => {
      try {
        const response = await fetch('/api/admin/adverts');
        const data = await response.json();
        setAdverts(data.data || []);
      } catch (error) {
        console.error('Failed to fetch adverts:', error);
      }
    };

    fetchArticles();
    fetchAdverts();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Breaking News Carousel - Hidden on mobile, shown on md and above */}
        <div className="hidden md:block">
          <BreakingNewsCarousel articles={articles.slice(0, 5)} />
        </div>

        {/* Featured Investigation */}
        {/* Featured Three-Column Grid Layout */}
        <section className="py-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">Loading featured articles...</p>
              </div>
            ) : featured && articles.length > 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Featured Article - Left Column */}
                <div className="md:col-span-2">
                  <article className="flex flex-col h-full">
                    {featured.image && (
                      <Link href={`/article/${featured.slug}`}>
                        <div className="mb-4 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 h-96 cursor-pointer hover:opacity-90 transition-opacity">
                          <img
                            src={featured.image}
                            alt={featured.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="flex-grow">
                      <div className="text-red-700 text-xs font-semibold tracking-widest mb-2">
                        INKURU ZIGEZWEHO
                      </div>
                      <h3 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-2 leading-tight">
                        <Link href={`/article/${featured.slug}`} className="text-neutral-900 dark:text-white hover:text-red-700 transition-colors">
                          {featured.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <span>{featured.author}</span>
                        <span>•</span>
                        <span>{featured.publishedAt}</span>
                      </div>
                    </div>
                  </article>
                </div>

                {/* Secondary Articles - Middle Column */}
                <div className="md:col-span-1 flex flex-col gap-6">
                  {articles.slice(1, 3).map((article) => (
                    <article key={article.id} className="pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                      {article.image && (
                        <Link href={`/article/${article.slug}`}>
                          <div className="mb-3 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 h-32 cursor-pointer hover:opacity-90 transition-opacity">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                      )}
                      <h4 className="text-base font-serif font-bold text-neutral-900 dark:text-white mb-1 leading-tight text-justify line-clamp-3">
                        <Link href={`/article/${article.slug}`} className="text-neutral-900 dark:text-white hover:text-red-700 transition-colors">
                          {article.title}
                        </Link>
                      </h4>
                    </article>
                  ))}
                </div>

                {/* More Articles Grid - Right Column */}
                <div className="md:col-span-1 flex flex-col gap-4">
                  {articles.slice(3, 5).map((article) => (
                    <article key={article.id} className="pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                      {article.image && (
                        <Link href={`/article/${article.slug}`}>
                          <div className="mb-3 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 h-32 cursor-pointer hover:opacity-90 transition-opacity">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                      )}
                      <h4 className="text-base font-serif font-bold text-neutral-900 dark:text-white mb-1 leading-tight text-justify line-clamp-3">
                        <Link href={`/article/${article.slug}`} className="text-neutral-900 dark:text-white hover:text-red-700 transition-colors">
                          {article.title}
                        </Link>
                      </h4>
                    </article>
                  ))}

                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Headline Advertisement Section */}
        <section className="py-8 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800\">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {adverts.filter((ad: any) => ad.position === 'homepage_top' && ad.isActive).length > 0 ? (
              adverts
                .filter((ad: any) => ad.position === 'homepage_top' && ad.isActive)
                .slice(0, 1)
                .map((advert: any) => (
                  <a
                    key={advert.id}
                    href={advert.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group hover:opacity-90 transition-opacity"
                  >
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden h-16 md:h-20 lg:h-28 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                      <img 
                        src={advert.imageUrl} 
                        alt={advert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </a>
                ))
            ) : (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-neutral-800 dark:to-neutral-800 rounded-lg overflow-hidden h-16 md:h-20 lg:h-28 flex items-center justify-center border-2 border-dashed" style={{borderColor: 'rgba(189, 80, 0, 0.3)'}}>                <div className="text-center">
                  <div className="text-5xl mb-3">📢</div>
                  <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-2\">Ikwanoni Ry'Umwanzi</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400\">Wifuza gukuba uburinzi?</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Latest Stories Section */}
        <section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="text-red-600 dark:text-red-500 text-xs font-semibold tracking-widest mb-2">INKURU ZIHERUKA</div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">Loading articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="group border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-white dark:bg-neutral-900 hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 cursor-pointer hover:shadow-lg"
                  >
                    {article.image && (
                      <Link href={`/article/${article.slug}`}>
                        <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-800 h-48">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="p-6">
                      <div className="text-red-600 dark:text-red-500 text-xs font-semibold tracking-widest mb-2 uppercase">
                        {article.category}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white mb-3 line-clamp-2">
                        <Link href={`/article/${article.slug}`} className="text-neutral-900 dark:text-white hover:text-red-700 transition-colors">{article.title}</Link>
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2 font-light">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">Nta nkuru zirashyirwaho</p>
              </div>
            )}
          </div>
        </section>

        {/* Most Viewed Articles Section - IZAKUNZWE CYANE */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="text-red-600 dark:text-red-500 text-xs font-semibold tracking-widest mb-2">IZAKUNZWE CYANE</div>
              <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">Inkuru Zasomwe Cyane</h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">Ibitambazo byarashyira hamwe...</p>
              </div>
            ) : mostViewed && mostViewed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mostViewed.map((article) => (
                  <article
                    key={article.id}
                    className="group border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-800 hover:shadow-lg transition-all duration-300"
                  >
                    {article.image && (
                      <Link href={`/article/${article.slug}`}>
                        <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-700 h-56 cursor-pointer">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="p-5">
                      <div className="text-red-600 dark:text-red-500 text-xs font-semibold tracking-widest mb-2 uppercase">
                        {article.category}
                      </div>
                      <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                        <Link href={`/article/${article.slug}`} className="text-neutral-900 dark:text-white hover:text-red-700 transition-colors">{article.title}</Link>
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-neutral-100 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-red-600 text-xs font-semibold tracking-widest mb-3">GUMANA AMAKURU</div>
            <h2 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white mb-3">
              Habwa amakuru yihariye kandi acukumbuye
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-light">
              Iyandikishe ku nkuru zacu kugira ngo ujye ubona amakuru acukumbuye n’ubusesenguzi bwihariye, amakuru agezweho yo muri Afurika y'Iburasirazuba.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Imeli yawe"
                className="flex-1 px-4 py-3 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-700 focus:border-transparent outline-none text-sm"
                required
              />
              <button className="px-6 py-3 text-white font-medium rounded-sm transition-colors text-sm" style={{ backgroundColor: '#e2001a' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b50015'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e2001a'}>
                Iyandikishe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
