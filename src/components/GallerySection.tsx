import React, { useState } from 'react';
import { GalleryPhoto } from '../types';
import { Sparkles, X } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryPhoto[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section id="trabajos" className="py-16 border-t border-pink-100 relative">
      <div id="galeria" className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block bg-[#fce7f3] text-[#db2777] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-2">
            TRABAJOS Y DISEÑOS REALES
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1f1625] tracking-tight">
            Inspirate para tu próximo turno
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Cada trabajo se realiza con precisión milimétrica, esterilización de herramientas de grado médico y materiales premium de máxima duración.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer border border-pink-200/80 bg-neutral-100 shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={item.url}
                alt={item.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-pink-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <span className="text-[11px] font-semibold leading-snug line-clamp-2">
                  {item.caption}
                </span>
                <span className="text-[10px] text-pink-200 font-bold uppercase mt-0.5">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-purple-950/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-pink-200 relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 p-2 bg-neutral-900/70 text-white rounded-full hover:bg-neutral-900 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                referrerPolicy="no-referrer"
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="p-4 bg-white">
                <p className="text-sm font-bold text-neutral-900">{activePhoto.caption}</p>
                <p className="text-xs text-pink-600 font-semibold mt-0.5">{activePhoto.category}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
