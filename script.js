// === Particles ===
const canvas=document.getElementById('particleCanvas'),ctx=canvas.getContext('2d');
let particles=[],mouse={x:-1e3,y:-1e3};
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();addEventListener('resize',resize);
function getPC(){return document.documentElement.dataset.theme==='light'?{r:20,g:60,b:150}:{r:0,g:212,b:255}}
class P{constructor(){this.reset()}reset(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.s=Math.random()*2+.5;this.sx=(Math.random()-.5)*.4;this.sy=(Math.random()-.5)*.4;this.o=Math.random()*.5+.1}update(){this.x+=this.sx;this.y+=this.sy;const dx=mouse.x-this.x,dy=mouse.y-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<150){const f=(150-d)/150;this.x-=dx*f*.02;this.y-=dy*f*.02}if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height)this.reset()}draw(){const c=getPC();ctx.beginPath();ctx.arc(this.x,this.y,this.s,0,Math.PI*2);ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},${this.o})`;ctx.fill()}}
function initP(){particles=[];const n=Math.min(70,Math.floor(canvas.width*canvas.height/18000));for(let i=0;i<n;i++)particles.push(new P)}initP();
function anim(){ctx.clearRect(0,0,canvas.width,canvas.height);const c=getPC();particles.forEach(p=>{p.update();p.draw()});for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.strokeStyle=`rgba(${c.r},${c.g},${c.b},${.06*(1-d/120)})`;ctx.lineWidth=.5;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke()}}requestAnimationFrame(anim)}anim();

// === Cursor ===
const cg=document.getElementById('cursorGlow');
document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;cg.style.left=e.clientX+'px';cg.style.top=e.clientY+'px'});

// === Nav ===
const nb=document.getElementById('navbar'),nt=document.getElementById('navToggle'),nl=document.getElementById('navLinks');
addEventListener('scroll',()=>nb.classList.toggle('scrolled',scrollY>50));
nt.addEventListener('click',()=>nl.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{
    if(window.innerWidth<=768) nl.classList.remove('open');
}));
const secs=document.querySelectorAll('section[id]');
addEventListener('scroll',()=>{const sy=scrollY+200;secs.forEach(s=>{const t=s.offsetTop,h=s.offsetHeight,id=s.getAttribute('id');const l=document.querySelector(`.nav-link[href="#${id}"]`);if(l)l.classList.toggle('active',sy>=t&&sy<t+h)})});

// === Theme ===
const tt=document.getElementById('themeToggle');
let theme=localStorage.getItem('theme')||'dark';
function setTheme(t){theme=t;document.documentElement.dataset.theme=t;tt.innerHTML=t==='dark'?'<i class="fas fa-moon"></i>':'<i class="fas fa-sun"></i>';localStorage.setItem('theme',t)}
setTheme(theme);
tt.addEventListener('click',()=>setTheme(theme==='dark'?'light':'dark'));

// === Language ===
const lb=document.getElementById('langToggle');
let lang=localStorage.getItem('lang')||'en';
function setLang(l){
  lang=l;localStorage.setItem('lang',l);
  lb.textContent=l==='en'?'AR':'EN';
  document.documentElement.lang=l;
  document.documentElement.dir=l==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-'+l+']').forEach(el=>{
    const v=el.getAttribute('data-'+l);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=v;
    else if(v){
      const img=el.querySelector('img.tl-logo');
      if(img){const clone=img.cloneNode(true);el.innerHTML=v;el.prepend(clone)}
      else el.innerHTML=v;
    }
  });
}
setLang(lang);
lb.addEventListener('click',()=>setLang(lang==='en'?'ar':'en'));

// === Typewriter ===
const titles_en=['IT Support Engineer','Network & Security Specialist','Cybersecurity Analyst','Business & Data Analyst'];
const titles_ar=['مهندس دعم تقنية معلومات','أخصائي شبكات وأمن معلومات','محلل أمن سيبراني','محلل أعمال وبيانات'];
let ti=0,ci2=0,del=false;const tw=document.getElementById('typewriter');
function type(){const titles=lang==='ar'?titles_ar:titles_en;const c=titles[ti];if(del){tw.textContent=c.substring(0,ci2--);if(ci2<0){del=false;ti=(ti+1)%titles.length;setTimeout(type,400);return}setTimeout(type,30)}else{tw.textContent=c.substring(0,ci2++);if(ci2>c.length){del=true;setTimeout(type,2e3);return}setTimeout(type,70)}}type();

// === Counters ===
function counters(){document.querySelectorAll('.stat-n').forEach(el=>{const t=+el.dataset.count,st=performance.now();(function u(now){const p=Math.min((now-st)/2e3,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(u)})(st)})}

// === Scroll Anim ===
const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);if(e.target.closest('.hero-stats'))counters();e.target.querySelectorAll('.sfill').forEach(b=>b.style.width=b.dataset.width+'%')}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.anim').forEach(el=>obs.observe(el));

// === Magnetic buttons ===
document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});

// === 3D tilt ===
document.querySelectorAll('.gcard').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-8px)`});c.addEventListener('mouseleave',()=>c.style.transform='')});

// === Certificate Modal ===
const modal=document.getElementById('certModal'),mImg=document.getElementById('modalImg'),mClose=document.getElementById('modalClose');
document.querySelectorAll('.cert-card').forEach(c=>{c.addEventListener('click',()=>{mImg.src=c.dataset.cert;modal.classList.add('active')})});
mClose.addEventListener('click',()=>modal.classList.remove('active'));
modal.querySelector('.modal-bg').addEventListener('click',()=>modal.classList.remove('active'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('active')});

// === Download CV === (handled via direct link in HTML)

// === Contact Form ===
const cForm=document.getElementById('contactForm'),fMsg=document.getElementById('formMsg'),fBtn=document.getElementById('formBtn');
cForm.addEventListener('submit',async e=>{
  e.preventDefault();
  fBtn.disabled=true;fBtn.style.opacity='.6';
  // Simulate network request delay for static hosting (GitHub Pages)
  await new Promise(resolve => setTimeout(resolve, 800));
  fMsg.style.display='block';fMsg.style.background='linear-gradient(135deg,rgba(0,212,255,0.15),rgba(108,59,235,0.15))';fMsg.style.color='var(--c1)';
  fMsg.innerHTML=lang==='ar'?'✅ تم إرسال رسالتك بنجاح!':'✅ Message sent successfully!';
  cForm.reset();
  fBtn.disabled=false;fBtn.style.opacity='1';
  setTimeout(()=>fMsg.style.display='none',5000);
});

// === Loader ===
function hideLoader() {
  const loader = document.getElementById('loader');
  if(loader) {
    loader.classList.add('hidden');
    setTimeout(() => { loader.style.display = 'none'; }, 600);
  }
}
window.addEventListener('load', hideLoader);
// Fallback in case load event already fired or takes too long
setTimeout(hideLoader, 1500);

// === Back to Top ===
const btt = document.getElementById('backToTop');
if(btt) {
  window.addEventListener('scroll', () => {
    if(window.scrollY > 300) btt.classList.add('visible');
    else btt.classList.remove('visible');
  });
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === Scroll Progress ===
window.addEventListener('scroll', () => {
  const scrollPx = document.documentElement.scrollTop;
  const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = `${scrollPx / winHeightPx * 100}%`;
  const sp = document.getElementById('scrollProgress');
  if(sp) sp.style.width = scrolled;
});
