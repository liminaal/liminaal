// pages/index.js
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // --- LOADER ---
    const hideLoader = () => {
      document.getElementById('siteLoader')?.classList.add('hidden');
      document.getElementById('siteContent')?.setAttribute('aria-hidden', 'false');
    };
    if (document.readyState === 'complete') setTimeout(hideLoader, 120);
    else window.addEventListener('load', () => setTimeout(hideLoader, 160));

    // --- SCREENSAVER ---
    let idleTimer;
    const resetTimer = () => {
      clearTimeout(idleTimer);
      document.getElementById('screensaver')?.classList.remove('show');
      idleTimer = setTimeout(() => {
        document.getElementById('screensaver')?.classList.add('show');
      }, 5 * 60 * 1000);
    };
    ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
      document.addEventListener(ev, resetTimer, { passive: true })
    );
    resetTimer();

    // --- HOVER PREVIEW & POPUPS ---
    const highResPath = (path) => {
      if (!path) return path;
      const parts = path.split('.');
      if (parts.length < 2) return path;
      const ext = parts.pop();
      return `${parts.join('.')}${ext.includes('@2x') ? '' : '@2x'}.${ext}`;
    };

    const positionPreview = (x, y) => {
      const hp = document.getElementById('hoverPreview');
      if (!hp) return;
      const rect = hp.getBoundingClientRect();
      let left = x + 18, top = y + 18;
      if (left + rect.width > window.innerWidth - 12) left = x - rect.width - 18;
      if (top + rect.height > window.innerHeight - 12) top = y - rect.height - 18;
      hp.style.transform = `translate3d(${left}px, ${top}px, 0) scale(1)`;
    };

    const boxes = document.querySelectorAll('.image-box');
    boxes.forEach(box => {
      let timer;
      box.addEventListener('mouseenter', e => {
        timer = setTimeout(() => {
          const img = box.dataset.img;
          const thumb = document.getElementById('previewThumb');
          if (thumb) {
            thumb.src = highResPath(img);
            thumb.onerror = () => thumb.src = img;
          }
          document.getElementById('previewTitle').textContent = box.dataset.title;
          document.getElementById('previewDesc').textContent = box.dataset.desc;
          document.getElementById('hoverPreview').classList.add('active');
          positionPreview(e.clientX, e.clientY);
        }, 110);
      });
      box.addEventListener('mousemove', e => positionPreview(e.clientX, e.clientY));
      box.addEventListener('mouseleave', () => {
        clearTimeout(timer);
        document.getElementById('hoverPreview')?.classList.remove('active');
      });
      box.addEventListener('click', () => {
        const img = box.dataset.img;
        const popupImg = document.getElementById('popup-img');
        if (popupImg) {
          popupImg.src = highResPath(img);
          popupImg.onerror = () => popupImg.src = img;
        }
        document.getElementById('popup-title').textContent = box.dataset.title;
        document.getElementById('popup-desc').textContent = box.dataset.desc;
        document.getElementById('popup').classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // --- COLLABORATORS ENTRANCE ---
    document.querySelectorAll('.collaborator').forEach((c, i) => {
      setTimeout(() => c.classList.add('visible'), 80 * i + 120);
    });

    // --- COLLABORATOR CLICK ---
    document.querySelectorAll('.collaborator').forEach(coll => {
      coll.addEventListener('click', () => {
        const img = coll.getAttribute('data-coll-img') || coll.querySelector('img')?.src || '';
        document.getElementById('popup-collab-img').src = img;
        document.getElementById('popup-collab-title').textContent = coll.querySelector('.name')?.textContent || '';
        document.getElementById('popup-collab-desc').innerHTML = (coll.getAttribute('data-coll-desc') || '').replace(/\n/g, '<br>');
        document.getElementById('popup-collab').classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // --- CLOSE POPUPS ---
    const closePopups = () => {
      document.getElementById('popup')?.classList.remove('active');
      document.getElementById('popup-collab')?.classList.remove('active');
      document.body.style.overflow = '';
    };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopups(); });
    document.getElementById('popup')?.addEventListener('click', e => { if (e.target.id === 'popup') closePopups(); });
    document.getElementById('popup-collab')?.addEventListener('click', e => { if (e.target.id === 'popup-collab') closePopups(); });
    document.querySelectorAll('.popup-close').forEach(btn => btn.addEventListener('click', closePopups));

    // --- TOUCH DEVICES ---
    if (('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
      document.getElementById('hoverPreview').style.display = 'none';
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
        <div id="screensaver" className="hide">
          <iframe
            id="iframe-ss"
            src="https://liminaal.github.io/assets/screensaver/"
            width="100%"
            height="100%"
            frameBorder="0"
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
          <div className="image-box" data-title="Abandoned Hospital" data-desc="Abandoned hospital found..." data-img="https://liminaal.github.io/assets/images/hospital.png">
            <img className="thumb" src="https://liminaal.github.io/assets/images/hospital.png" alt="Abandoned Hospital" loading="lazy" decoding="async" />
            <div className="meta"><div className="title">Abandoned Hospital</div><div className="sub">found - november 2025</div></div>
          </div>
          <div className="image-box" data-title="Cold Loneliness" data-desc="Cold halls and colder hearts." data-img="https://liminaal.github.io/assets/images/cold-loneliness.jpg">
            <img className="thumb" src="https://liminaal.github.io/assets/images/cold-loneliness.jpg" alt="Cold Loneliness" loading="lazy" decoding="async" />
            <div className="meta"><div className="title">Cold Loneliness</div><div className="sub">somewhere inside</div></div>
          </div>
          <div className="image-box" data-title="Oppressive Cells" data-desc="Cells full of silence." data-img="https://liminaal.github.io/assets/images/oppressive-cells.jpg">
            <img className="thumb" src="https://liminaal.github.io/assets/images/oppressive-cells.jpg" alt="Oppressive Cells" loading="lazy" decoding="async" />
            <div className="meta"><div className="title">Oppressive Cells</div><div className="sub">locked memories</div></div>
          </div>
          <div className="image-box" data-title="???" data-desc="???" data-img="https://liminaal.github.io/assets/images/unknown.png">
            <img className="thumb" src="https://liminaal.github.io/assets/images/unknown.png" alt="???" loading="lazy" decoding="async" />
            <div className="meta"><div className="title">???</div><div className="sub">???</div></div>
          </div>
        </div>

        <div className="collab-wrap">
          <div className="collab-head">
            <h2>Collaborators</h2>
          </div>
          <div className="collaborators" id="collaborators">
            <div className="collaborator"
              data-coll-img="https://liminaal.github.io/assets/mii/Kaido%20head.png"
              data-coll-desc="Kaido — a young boy that likes photographing & coding.
he started when he was 11 y/o creating a Minecraft bot, then started taking ambiental photos when he was 13.">
              <img src="https://liminaal.github.io/assets/mii/Kaido%20head.png" alt="Kaido" />
              <div className="name">Kaido</div>
              <div className="role"></div>
            </div>
            <div className="collaborator"
              data-coll-img="https://liminaal.github.io/assets/mii/Awitax%20head.png"
              data-coll-desc="Awitax — a young girl that loves drawing & gaming.">
              <img src="https://liminaal.github.io/assets/mii/Awitax%20head.png" alt="Awitax" />
              <div className="name">Awitax</div>
              <div className="role"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Preview */}
      <div className="hover-preview" id="hoverPreview" aria-hidden="true">
        <div className="preview-thumb"><img id="previewThumb" src="" alt="" /></div>
        <div className="preview-meta">
          <h4 id="previewTitle"></h4>
          <p id="previewDesc"></p>
        </div>
      </div>

      {/* Popup Image */}
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

      {/* Popup Collaborator */}
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