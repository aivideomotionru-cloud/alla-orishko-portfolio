const dialog=document.querySelector('.lightbox');const full=dialog.querySelector('img');let returnY=0;document.querySelectorAll('.image-button img').forEach(img=>img.parentElement.addEventListener('click',()=>{returnY=scrollY;full.src=img.src;full.alt=img.alt;dialog.showModal()}));dialog.querySelector('button').addEventListener('click',()=>{dialog.close();requestAnimationFrame(()=>scrollTo(0,returnY))});dialog.addEventListener('click',e=>{if(e.target===dialog){dialog.close();requestAnimationFrame(()=>scrollTo(0,returnY))}});

const motionVideos=[...document.querySelectorAll('[data-viewport-video]')];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const videoObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    const video=entry.target;
    if(!entry.isIntersecting){video.pause();continue;}
    if(reducedMotion)continue;
    motionVideos.filter(other=>other!==video).forEach(other=>other.pause());
    video.play().catch(()=>{});
  }
},{threshold:0.4});
motionVideos.forEach(video=>{
  videoObserver.observe(video);
  video.addEventListener('click',()=>video.paused?video.play().catch(()=>{}):video.pause());
  video.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      video.paused?video.play().catch(()=>{}):video.pause();
    }
  });
});
