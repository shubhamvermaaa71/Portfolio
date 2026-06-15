/* ─── CURSOR ─────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function animate(){
  rx += (mx-rx)*.18; ry += (my-ry)*.18;
  dot.style.left  = mx+'px'; dot.style.top  = my+'px';
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animate);
})();

/* ─── SCROLL PROGRESS ────────────────────────── */
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - innerHeight;
  bar.style.width = (scrollY/max*100)+'%';
});

/* ─── NAV HIGHLIGHT ──────────────────────────── */
const sections = ['hero','about-section','skills-section','projects-section','contact-section'];
const navLinks = document.querySelectorAll('nav a');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navLinks.forEach(l => l.classList.remove('active'));
      const id = e.target.id;
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if(link) link.classList.add('active');
    }
  });
}, {threshold:.4});
sections.forEach(id => { const el=document.getElementById(id); if(el) io.observe(el); });

/* ─── TYPEWRITER ──────────────────────────────── */
const words = ['web apps','games','pixel art','3D worlds','cool stuff 🚀'];
let wi=0, ci=0, del=false;
const tw = document.getElementById('tw');
function type(){
  const w=words[wi];
  if(!del){
    tw.textContent = w.slice(0,++ci);
    if(ci===w.length){ del=true; setTimeout(type,1800); return; }
  } else {
    tw.textContent = w.slice(0,--ci);
    if(ci===0){ del=false; wi=(wi+1)%words.length; }
  }
  setTimeout(type, del?60:90);
}
type();

/* ─── BACKGROUND CANVAS ───────────────────────── */
(function(){
  const cv = document.getElementById('bg-canvas');
  const ctx = cv.getContext('2d');
  let W,H,dots;

  function resize(){
    W=cv.width=innerWidth; H=cv.height=innerHeight;
    dots=[];
    const cols = Math.ceil(W/55), rows = Math.ceil(H/55);
    for(let r=0;r<=rows;r++) for(let c=0;c<=cols;c++)
      dots.push({x:c*55,y:r*55,ox:c*55,oy:r*55,vx:0,vy:0,s:(Math.random()*.8+.2)});
  }

  let mx2=W/2, my2=H/2;
  document.addEventListener('mousemove',e=>{mx2=e.clientX;my2=e.clientY;});

  let t=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t+=.003;
    dots.forEach(d=>{
      const dx=d.x-mx2, dy=d.y-my2;
      const dist=Math.hypot(dx,dy);
      const force=Math.max(0,(140-dist)/140);
      d.vx += (d.ox-d.x)*.04 + (dx/dist||0)*force*1.5;
      d.vy += (d.oy-d.y)*.04 + (dy/dist||0)*force*1.5;
      d.vx*=.85; d.vy*=.85;
      d.x+=d.vx; d.y+=d.vy;
      const alpha = .10+force*.3;
      const size  = (d.s+force*.8)*1.5;
      ctx.beginPath();
      ctx.arc(d.x,d.y,size,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,232,255,${alpha})`;
      ctx.fill();
    });

    /* Subtle moving gradient orbs */
    const g1=ctx.createRadialGradient(
      W*.25+Math.sin(t)*W*.08, H*.3+Math.cos(t*.7)*H*.05, 0,
      W*.25+Math.sin(t)*W*.08, H*.3+Math.cos(t*.7)*H*.05, W*.35);
    g1.addColorStop(0,'rgba(0,232,255,.06)');
    g1.addColorStop(1,'transparent');
    ctx.fillStyle=g1; ctx.fillRect(0,0,W,H);

    const g2=ctx.createRadialGradient(
      W*.75+Math.cos(t*.8)*W*.07, H*.6+Math.sin(t)*H*.05, 0,
      W*.75+Math.cos(t*.8)*W*.07, H*.6+Math.sin(t)*H*.05, W*.3);
    g2.addColorStop(0,'rgba(255,171,64,.05)');
    g2.addColorStop(1,'transparent');
    ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);

    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize(); draw();
})();

/* ─── REVEAL ON SCROLL ────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('visible');
  });
}, {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── SKILL CARDS ────────────────────────── */
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      const card = e.target;
      const delay = (Array.from(card.parentElement.children).indexOf(card))*90;
      setTimeout(()=>{
        card.classList.add('visible');
        card.style.animationDelay = '0ms';
      }, delay);
      cardObserver.unobserve(card);
    }
  });
}, {threshold:.1});
document.querySelectorAll('.skill-card, .project-card').forEach(c => cardObserver.observe(c));

/* ─── TILT EFFECT ON CARDS ───────────────────── */
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = (e.clientX-r.left)/r.width  - .5;
    const cy = (e.clientY-r.top )/r.height - .5;
    card.style.transform = `translateY(-6px) rotateX(${-cy*10}deg) rotateY(${cx*10}deg) scale(1.01)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .35s cubic-bezier(.25,.46,.45,.94)';
  });
});
