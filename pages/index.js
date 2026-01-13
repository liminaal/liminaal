// pages/index.js
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [communityImages, setCommunityImages] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [hoverPreview, setHoverPreview] = useState({ visible: false, x: 0, y: 0, data: null });
  const [popup, setPopup] = useState({ open: false, data: null });
  const [collabPopup, setCollabPopup] = useState({ open: false, data: null });
  const [screensaverActive, setScreensaverActive] = useState(false);

  const idleTimerRef = useRef(null);
  const hoverTimerRef = useRef(null);

  // ─── Cargar imágenes aprobadas y colaboradores ─────────────────────
  useEffect(() => {
    const fetchData = async () => {
      // Imágenes aprobadas de la comunidad
      const { data: imagesData } = await supabase
        .from('images')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Colaboradores
      const { data: collabData } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_collaborator', true)
        .order('full_name');

      setCommunityImages(imagesData || []);
      setCollaborators(collabData || []);
    };

    fetchData();
  }, []);

  // ─── Loader inicial (como en tu HTML) ──────────────────────────────
  useEffect(() => {
    const hideLoader = () => {
      document.getElementById('siteLoader')?.classList.add('hidden');
      document.getElementById('siteContent')?.setAttribute('aria-hidden', 'false');
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 120);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 160));
    }
  }, []);

  // ─── Screensaver (5 min idle) ───────────────────────────────────────
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

  // ─── Interacciones ──────────────────────────────────────────────────
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

  // ─── Tus imágenes originales (fijas, como en tu HTML) ───────────────
  const staticImages = [
    { id: 'static-1', title: 'Abandoned Hospital', desc: 'Abandoned hospital found...', img: '/assets/images/hospital.png', date: 'november 2025' },
    { id: 'static-2', title: 'Cold Loneliness', desc: 'Cold halls and colder hearts.', img: '/assets/images/cold-loneliness.jpg', date: 'somewhere inside' },
    { id: 'static-3', title: 'Oppressive Cells', desc: 'Cells full of silence.', img: '/assets/images/oppressive-cells.jpg', date: 'locked memories' },
    { id: 'static-4', title: '???', desc: '???', img: '/assets/images/unknown.png', date: '???' },
  ];

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Loader */}
      <div className="loader" id="siteLoader" role="status" aria-hidden="false">
        <div className="loader-inner">
          <div className="label">liminaalizing</div>
          <div className="dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div className="container" id="siteContent" aria-hidden="true">
        {screensaverActive && (
          <div id="screensaver" className="show">
            <iframe id="iframe-ss" src="/assets/screensaver" width="100%" height="100%" frameBorder="0"></iframe>
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

        {/* Galería estática (tus imágenes originales) */}
        <div className="image-placeholder">
          {staticImages.map((img) => (
            <div
              key={img.id}
              className="image-box"
              data-title={img.title}
              data-desc={img.desc}
              data-img={img.img}
              onMouseEnter={(e) => showHoverPreview(e, img)}
              onMouseMove={moveHoverPreview}
              onMouseLeave={hideHoverPreview}
              onClick={() => openImagePopup(img)}
            >
              <img className="thumb" src={img.img} alt={img.title} loading="lazy" decoding="async" />
              <div className="meta">
                <div className="title">{img.title}</div>
                <div className="sub">{img.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comunidad (imágenes aprobadas de Supabase) */}
        {communityImages.length > 0 && (
          <>
            <h2 style={{ textAlign: 'center', marginTop: '4rem', fontSize: '1.8rem', opacity: 0.7 }}>Comunidad</h2>
            <div className="image-placeholder">
              {communityImages.map((img) => (
                <div
                  key={img.id}
                  className="image-box"
                  data-title={img.title || 'Sin título'}
                  data-desc={img.description || ''}
                  data-img={img.url}
                  onMouseEnter={(e) => showHoverPreview(e, img)}
                  onMouseMove={moveHoverPreview}
                  onMouseLeave={hideHoverPreview}
                  onClick={() => openImagePopup(img)}
                >
                  <img className="thumb" src={img.url} alt={img.title || 'Comunidad'} loading="lazy" decoding="async" />
                  <div className="meta">
                    <div className="title">{img.title || 'Comunidad'}</div>
                    <div className="sub">
                      {new Date(img.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Colaboradores */}
        <div className="collab-wrap">
          <div className="collab-head">
            <h2>Collaborators</h2>
          </div>
          <div className="collaborators" id="collaborators">
            {(collaborators.length > 0 ? collaborators : [
              // Fallback: tus colaboradores originales si no hay en DB
              { id: 'kaido', full_name: 'Kaido', avatar_url: '/assets/mii/Kaido head.png', bio: "Kaido — a young boy that likes photographing & coding.\nhe started when he was 11 y/o creating a Minecraft bot, then started taking ambiental photos when he was 13.", role: '' },
              { id: 'awitax', full_name: 'Awitax', avatar_url: '/assets/mii/Awitax head.png', bio: "Awitax — a young girl that loves drawing & gaming.", role: '' }
            ]).map((collab, idx) => (
              <div
                key={collab.id}
                className="collaborator"
                data-coll-img={collab.avatar_url}
                data-coll-img-full={collab.avatar_url}
                data-coll-desc={collab.bio || ''}
                onClick={() => openCollabPopup(collab)}
                ref={(el) => {
                  if (el) {
                    setTimeout(() => el.classList.add('visible'), 80 * idx + 120);
                  }
                }}
              >
                <img src={collab.avatar_url} alt={collab.full_name} loading="lazy" />
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
            <img id="previewThumb" src={hoverPreview.data.img || hoverPreview.data.url} alt="" />
          </div>
          <div className="preview-meta">
            <h4 id="previewTitle">{hoverPreview.data.title}</h4>
            <p id="previewDesc">{hoverPreview.data.desc || hoverPreview.data.description}</p>
          </div>
        </div>
      )}

      {/* Popup Imagen */}
      {popup.open && popup.data && (
        <div className="popup active" onClick={closePopups} aria-hidden="false">
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopups} aria-label="Close">✕</button>
            <div className="popup-content">
              <img id="popup-img" src={popup.data.img || popup.data.url} alt={popup.data.title} />
              <h3 id="popup-title">{popup.data.title}</h3>
              <p id="popup-desc">{popup.data.desc || popup.data.description}</p>
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
              <img id="popup-collab-img" src={collabPopup.data.avatar_url} alt={collabPopup.data.full_name} />
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
                if (popup) popup.classList.remove('active');
                if (collabPopup) collabPopup.classList.remove('active');
                document.body.style.overflow = '';
              }
            });
          `
        }}
      />
    </>
  );
}