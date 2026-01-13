// pages/index.js
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // ─── LOADER ───────────────────────────────────────────────────────
    const hideLoader = () => {
      const loader = document.getElementById('siteLoader');
      const content = document.getElementById('siteContent');
      if (loader) loader.classList.add('hidden');
      if (content) content.setAttribute('aria-hidden', 'false');
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 120);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 160));
    }

    // ─── SCREENSAVER (5 MIN IDLE) ─────────────────────────────────────
    let idleTimer;
    const SCREENSAVER_DELAY = 5 * 60 * 1000; // 5 minutes
    const screensaver = document.getElementById('screensaver');

    const showScreensaver = () => {
      if (screensaver) {
        screensaver.classList.remove('hide');
        screensaver.classList.add('show');
      }
    };
    const hideScreensaver = () => {
      if (screensaver) {
        screensaver.classList.remove('show');
        screensaver.classList.add('hide');
      }
    };

    const resetTimer = () => {
      clearTimeout(idleTimer);
      hideScreensaver();
      idleTimer = setTimeout(showScreensaver, SCREENSAVER_DELAY);
    };

    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll'];
    events.forEach(ev => document.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    // ─── HOVER PREVIEW & POPUPS ───────────────────────────────────────
    const highResPath = (path) => {
      if (!path) return path;
      const parts = path.split('.');
      if (parts.length < 2) return path;
      const ext = parts.pop();
      const base = parts.join('.');
      return `${base}@2x.${ext}`;
    };

    const boxes = document.querySelectorAll('.image-box');
    const hoverPreview = document.getElementById('hoverPreview');
    const popup = document.getElementById('popup');
    const popupCollab = document.getElementById('popup-collab');

    const positionPreview = (x, y) => {
      if (!hoverPreview) return;
      const pad = 12;
      const rect = hoverPreview.getBoundingClientRect();
      let left = x + 18;
      let top = y + 18;
      if (left + rect.width + pad > window.innerWidth) left = x - rect.width - 18;
      if (top + rect.height + pad > window.innerHeight) top = y - rect.height - 18;
      hoverPreview.style.transform = `translate3d(${left}px, ${top}px, 0) scale(1)`;
    };

    boxes.forEach(box => {
      let showTimer = null;

      box.addEventListener('mouseenter', (e) => {
        showTimer = setTimeout(() => {
          const imgPath = box.dataset.img || '';
          const candidate = highResPath(imgPath);

          const previewThumb = document.getElementById('previewThumb');
          const previewTitle = document.getElementById('previewTitle');
          const previewDesc = document.getElementById('previewDesc');

          if (previewThumb) {
            previewThumb.src = candidate;
            previewThumb.onerror = () => { previewThumb.src = imgPath; };
          }
          if (previewTitle) previewTitle.textContent = box.dataset.title || '';
          if (previewDesc) previewDesc.textContent = box.dataset.desc || '';

          if (hoverPreview) {
            hoverPreview.classList.add('active');
            hoverPreview.setAttribute('aria-hidden', 'false');
            positionPreview(e.clientX, e.clientY);
          }
        }, 110);
      });

      box.addEventListener('mousemove', (e) => {
        if (hoverPreview && hoverPreview.classList.contains('active')) {
          positionPreview(e.clientX, e.clientY);
        }
      });

      box.addEventListener('mouseleave', () => {
        clearTimeout(showTimer);
        if (hoverPreview) {
          hoverPreview.classList.remove('active');
          hoverPreview.setAttribute('aria-hidden', 'true');
        }
      });

      box.addEventListener('click', () => {
        const imgPath = box.dataset.img || '';
        const candidate = highResPath(imgPath);

        const popupImg = document.getElementById('popup-img');
        const popupTitle = document.getElementById('popup-title');
        const popupDesc = document.getElementById('popup-desc');

        if (popupImg) {
          popupImg.src = candidate;
          popupImg.onerror = () => { popupImg.src = imgPath; };
        }
        if (popupTitle) popupTitle.textContent = box.dataset.title || '';
        if (popupDesc) popupDesc.textContent = box.dataset.desc || '';

        if (popup) {
          popup.classList.add('active');
          popup.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // ─── COLLABORATORS ────────────────────────────────────────────────
    const collaborators = document.querySelectorAll('.collaborator');
    collaborators.forEach((coll, idx) => {
      setTimeout(() => coll.classList.add('visible'), 80 * idx + 120);
    });

    collaborators.forEach(coll => {
      coll.addEventListener('click', () => {
        const fullImg = coll.getAttribute('data-coll-img-full') || coll.dataset.collImgFull || '';
        const headImg = coll.getAttribute('data-coll-img') || coll.dataset.collImg || '';
        const tileImg = coll.querySelector('img')?.src || '';
        const chosen = fullImg || headImg || tileImg || '';

        const popupCollabImg = document.getElementById('popup-collab-img');
        const popupCollabTitle = document.getElementById('popup-collab-title');
        const popupCollabDesc = document.getElementById('popup-collab-desc');

        if (popupCollabImg) {
          popupCollabImg.src = chosen;
          popupCollabImg.onerror = () => { popupCollabImg.src = chosen; };
        }

        const name = coll.querySelector('.name')?.textContent || '';
        const desc = coll.getAttribute('data-coll-desc') || coll.dataset.collDesc || '';

        if (popupCollabTitle) popupCollabTitle.textContent = name;
        if (popupCollabDesc) {
          popupCollabDesc.innerHTML = (desc || '').replace(/\n/g, '<br>');
        }

        if (popupCollab) {
          popupCollab.classList.add('active');
          popupCollab.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // ─── CLOSE POPUPS ─────────────────────────────────────────────────
    const closePopups = () => {
      if (popup) {
        popup.classList.remove('active');
        popup.setAttribute('aria-hidden', 'true');
      }
      if (popupCollab) {
        popupCollab.classList.remove('active');
        popupCollab.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    };

    if (popup) popup.addEventListener('click', (e) => { if (e.target === popup) closePopups(); });
    if (popupCollab) popupCollab.addEventListener('click', (e) => { if (e.target === popupCollab) closePopups(); });

    const closeButtons = document.querySelectorAll('.popup-close');
    closeButtons.forEach(btn => btn.addEventListener('click', closePopups));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePopups();
    });

    // ─── TOUCH DEVICES ────────────────────────────────────────────────
    const isTouch = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch() && hoverPreview) {
      hoverPreview.style.display = 'none';
    };

    // Cleanup (optional for static site)
    return () => {
      events.forEach(ev => document.removeEventListener(ev, resetTimer));
      document.removeEventListener('keydown', () => {});
    };
  }, []);

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
        {/* Screensaver */}
        <div id="screensaver" className="hide">
          <iframe
            id="iframe-ss"
            src="https://liminaal.github.io/assets/screensaver/"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Screensaver"
          ></iframe>
        </div>

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

        <div className="image-placeholder">
          <div
            className="image-box"
            data-title="Abandoned Hospital"
            data-desc="Abandoned hospital found..."
            data-img="https://liminaal.github.io/assets/images/hospital.png"
          >
            <img
              className="thumb"
              src="https://liminaal.github.io/assets/images/hospital.png"
              alt="Abandoned Hospital"
              loading="lazy"
              decoding="async"
            />
            <div className="meta">
              <div className="title">Abandoned Hospital</div>
              <div className="sub">found - november 2025</div>
            </div>
          </div>

          <div
            className="image-box"
            data-title="Cold Loneliness"
            data-desc="Cold halls and colder hearts."
            data-img="https://liminaal.github.io/assets/images/cold-loneliness.jpg"
          >
            <img
              className="thumb"
              src="https://liminaal.github.io/assets/images/cold-loneliness.jpg"
              alt="Cold Loneliness"
              loading="lazy"
              decoding="async"
            />
            <div className="meta">
              <div className="title">Cold Loneliness</div>
              <div className="sub">somewhere inside</div>
            </div>
          </div>

          <div
            className="image-box"
            data-title="Oppressive Cells"
            data-desc="Cells full of silence."
            data-img="https://liminaal.github.io/assets/images/oppressive-cells.jpg"
          >
            <img
              className="thumb"
              src="https://liminaal.github.io/assets/images/oppressive-cells.jpg"
              alt="Oppressive Cells"
              loading="lazy"
              decoding="async"
            />
            <div className="meta">
              <div className="title">Oppressive Cells</div>
              <div className="sub">locked memories</div>
            </div>
          </div>

          <div
            className="image-box"
            data-title="???"
            data-desc="???"
            data-img="https://liminaal.github.io/assets/images/unknown.png"
          >
            <img
              className="thumb"
              src="https://liminaal.github.io/assets/images/unknown.png"
              alt="???"
              loading="lazy"
              decoding="async"
            />
            <div className="meta">
              <div className="title">???</div>
              <div className="sub">???</div>
            </div>
          </div>
        </div>

        <div className="collab-wrap">
          <div className="collab-head">
            <h2>Collaborators</h2>
          </div>
          <div className="collaborators" id="collaborators">
            <div
              className="collaborator"
              data-coll-img="https://liminaal.github.io/assets/mii/Kaido%20head.png"
              data-coll-img-full="https://liminaal.github.io/assets/mii/Kaido%20head.png"
              data-coll-desc="Kaido — a young boy that likes photographing & coding.
he started when he was 11 y/o creating a Minecraft bot, then started taking ambiental photos when he was 13."
            >
              <img src="https://liminaal.github.io/assets/mii/Kaido%20head.png" alt="Kaido" />
              <div className="name">Kaido</div>
              <div className="role"></div>
            </div>

            <div
              className="collaborator"
              data-coll-img="https://liminaal.github.io/assets/mii/Awitax%20head.png"
              data-coll-img-full="https://liminaal.github.io/assets/mii/Awitax%20head.png"
              data-coll-desc="Awitax — a young girl that loves drawing & gaming."
            >
              <img src="https://liminaal.github.io/assets/mii/Awitax%20head.png" alt="Awitax" />
              <div className="name">Awitax</div>
              <div className="role"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Preview */}
      <div className="hover-preview" id="hoverPreview" aria-hidden="true">
        <div className="preview-thumb">
          <img id="previewThumb" src="" alt="" />
        </div>
        <div className="preview-meta">
          <h4 id="previewTitle"></h4>
          <p id="previewDesc"></p>
        </div>
      </div>

      {/* Popup Imagen */}
      <div className="popup" id="popup" aria-hidden="true">
        <div className="popup-inner" role="dialog" aria-modal="true">
          <button className="popup-close" aria-label="Close">✕</button>
          <div className="popup-content">
            <img id="popup-img" src="" alt="" />
            <h3 id="popup-title"></h3>
            <p id="popup-desc"></p>
          </div>
        </div>
      </div>

      {/* Popup Colaborador */}
      <div className="popup-collab" id="popup-collab" aria-hidden="true">
        <div className="popup-inner" role="dialog" aria-modal="true">
          <button className="popup-close" aria-label="Close">✕</button>
          <div className="collab-left">
            <img id="popup-collab-img" src="" alt="" />
          </div>
          <div className="collab-right">
            <h3 id="popup-collab-title"></h3>
            <p id="popup-collab-desc"></p>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(245,245,245,.6)' }}>
        &copy; liminaal
      </footer>
    </>
  );
}