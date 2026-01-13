// pages/index.js
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [hoverPreview, setHoverPreview] = useState({ visible: false, x: 0, y: 0, data: null });
  const [popup, setPopup] = useState({ open: false, data: null });
  const [collabPopup, setCollabPopup] = useState({ open: false, data: null });
  const [screensaverActive, setScreensaverActive] = useState(false);

  const idleTimerRef = useRef(null);
  const hoverTimerRef = useRef(null);

  // ─── Cargar datos desde Supabase ───────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      const { data: imageData } = await supabase
        .from('images')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      const { data: collabData } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_collaborator', true)
        .order('full_name');

      setImages(imageData || []);
      setCollaborators(collabData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // ─── Ocultar loader tras carga ──────────────────────────────────
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const loader = document.getElementById('siteLoader');
        const content = document.getElementById('siteContent');
        if (loader) loader.classList.add('hidden');
        if (content) content.setAttribute('aria-hidden', 'false');
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // ─── Screensaver (5 min idle) ───────────────────────────────────
  useEffect(() => {
    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setScreensaverActive(false);
      idleTimerRef.current = setTimeout(() => setScreensaverActive(true), 5 * 60 * 1000);
    };

    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // ─── Interacciones ──────────────────────────────────────────────
  const showHoverPreview = (e, img) => {
    hoverTimerRef.current = setTimeout(() => {
      setHoverPreview({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        data: img
      });
    }, 110);
  };

  const moveHoverPreview = (e) => {
    if (hoverPreview.visible) {
      setHoverPreview(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  const hideHoverPreview = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoverPreview({ visible: false, x: 0, y: 0, data: null });
  };

  const openImagePopup = (img) => {
    setPopup({ open: true, data: img });
    document.body.style.overflow = 'hidden';
  };

  const closePopups = () => {
    setPopup({ open: false, data: null });
    setCollabPopup({ open: false, data: null });
    document.body.style.overflow = '';
  };

  const openCollabPopup = (collab) => {
    setCollabPopup({ open: true, data: collab });
    document.body.style.overflow = 'hidden';
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <>
      {/* Loader (igual que en tu HTML) */}
      <div className="loader" id="siteLoader" role="status" aria-hidden="false">
        <div className="loader-inner">
          <div className="label">liminaalizing</div>
          <div className="dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div className="container" id="siteContent" aria-hidden="true">
        {/* Screensaver */}
        {screensaverActive && (
          <div id="screensaver" className="show">
            <iframe
              id="iframe-ss"
              src="/assets/screensaver"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Screensaver"
            ></iframe>
          </div>
        )}

        <h1>liminaal</h1>

        <div className="spotify-player">
          <iframe
            src="https://open.spotify.com/embed/playlist/5xzeVvVZU6mCfSwALg1yNp?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>

        {/* Galería dinámica */}
        <div className="image-placeholder">
          {images.length > 0 ? (
            images.map((img) => (
              <div
                key={img.id}
                className="image-box"
                data-title={img.title}
                data-desc={img.description}
                data-img={img.image_url}
                onMouseEnter={(e) => showHoverPreview(e, img)}
                onMouseMove={moveHoverPreview}
                onMouseLeave={hideHoverPreview}
                onClick={() => openImagePopup(img)}
              >
                <img
                  className="thumb"
                  src={img.image_url}
                  alt={img.title}
                  loading="lazy"
                  decoding="async"
                />
                <div className="meta">
                  <div className="title">{img.title}</div>
                  <div className="sub">
                    {new Date(img.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="image-box">
                <div className="meta">
                  <div className="title">No images yet</div>
                  <div className="sub">Check back soon</div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Colaboradores */}
        <div className="collab-wrap">
          <div className="collab-head">
            <h2>Collaborators</h2>
          </div>
          <div className="collaborators" id="collaborators">
            {collaborators.map((collab, idx) => (
              <div
                key={collab.id}
                className="collaborator"
                data-coll-img={collab.avatar_url}
                data-coll-img-full={collab.avatar_url}
                data-coll-desc={collab.bio || `${collab.full_name} — ${collab.role || ''}`}
                onClick={() => openCollabPopup(collab)}
                ref={(el) => {
                  if (el && !loading) {
                    setTimeout(() => {
                      el.classList.add('visible');
                    }, 80 * idx + 120);
                  }
                }}
              >
                <img
                  src={collab.avatar_url}
                  alt={collab.full_name}
                  loading="lazy"
                />
                <div className="name">{collab.full_name}</div>
                <div className="role">{collab.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Preview */}
      {hoverPreview.visible && hoverPreview.data && (
        <div
          className="hover-preview active"
          style={{
            transform: `translate3d(${hoverPreview.x + 18}px, ${hoverPreview.y + 18}px, 0) scale(1)`
          }}
          aria-hidden="false"
        >
          <div className="preview-thumb">
            <img
              id="previewThumb"
              src={hoverPreview.data.image_url}
              alt={hoverPreview.data.title}
            />
          </div>
          <div className="preview-meta">
            <h4 id="previewTitle">{hoverPreview.data.title}</h4>
            <p id="previewDesc">{hoverPreview.data.description}</p>
          </div>
        </div>
      )}

      {/* Popup Imagen */}
      {popup.open && popup.data && (
        <div className="popup active" onClick={closePopups} aria-hidden="false">
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopups} aria-label="Close">✕</button>
            <div className="popup-content">
              <img
                id="popup-img"
                src={popup.data.image_url}
                alt={popup.data.title}
              />
              <h3 id="popup-title">{popup.data.title}</h3>
              <p id="popup-desc">{popup.data.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Popup Colaborador */}
      {collabPopup.open && collabPopup.data && (
        <div className="popup-collab active" onClick={closePopups} aria-hidden="false">
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopups} aria-label="Close">✕</button>
            <div className="collab-left">
              <img
                id="popup-collab-img"
                src={collabPopup.data.avatar_url}
                alt={collabPopup.data.full_name}
              />
            </div>
            <div className="collab-right">
              <h3 id="popup-collab-title">{collabPopup.data.full_name}</h3>
              <p
                id="popup-collab-desc"
                dangerouslySetInnerHTML={{
                  __html: (collabPopup.data.bio || '').replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(245,245,245,.6)' }}>
        &copy; liminaal
      </footer>

      {/* Manejo de teclado (ESC) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                const popup = document.querySelector('.popup.active');
                const collabPopup = document.querySelector('.popup-collab.active');
                if (popup) {
                  popup.classList.remove('active');
                  document.body.style.overflow = '';
                }
                if (collabPopup) {
                  collabPopup.classList.remove('active');
                  document.body.style.overflow = '';
                }
              }
            });
          `
        }}
      />
    </>
  );
}