const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const works = [
  {
    src: "assets/work-2-aligned.webp",
    alt: "Bronze editorial eye makeup by Alla Orishko",
    title: "Bronze Editorial",
  },
  {
    src: "assets/work-replacement-11.webp",
    alt: "Editorial green eye makeup and luminous skin by Alla Orishko",
    title: "Colour & Light",
  },
  {
    src: "assets/work-contemporary-nude.webp",
    alt: "Contemporary nude makeup with a soft satin finish by Alla Orishko",
    title: "Contemporary Nude",
  },
  {
    src: "assets/work-precision-liner.webp",
    alt: "Precision graphic liner and luminous complexion by Alla Orishko",
    title: "Precision Liner",
  },
];

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const titleLines = document.querySelectorAll(".title-line > span");
const revealCopy = document.querySelectorAll(".reveal-copy");
const portraitWrap = document.querySelector(".hero-portrait-wrap");
const portrait = document.querySelector(".hero-portrait");
const hero = document.querySelector(".hero");
const titleLineBlocks = [...document.querySelectorAll(".title-line")];
const heroThread = document.querySelector(".hero-thread");
const progress = document.querySelector(".scroll-progress");
const workViewport = document.querySelector(".work-viewport");
const workTrack = document.querySelector(".work-track");
const workFrames = [...document.querySelectorAll(".work-frame")];
workFrames.forEach((frame) => {
  const clone = document.createElement("div");
  clone.className = `${frame.className} work-frame-clone`;
  clone.innerHTML = frame.innerHTML;
  clone.setAttribute("aria-hidden", "true");
  workTrack.appendChild(clone);
});
const allWorkFrames = [...workTrack.querySelectorAll(".work-frame")];
const workMotionToggle = document.querySelector(".work-motion-toggle");
const guestSlides = [...document.querySelectorAll(".guest-slide")];
const guestCarousel = document.querySelector(".guest-carousel");
const guestImage = document.querySelector(".guest-image");
const guestCounter = document.querySelector(".guest-counter");
const guestMotionToggle = document.querySelector(".guest-motion-toggle");
const dialog = document.querySelector(".work-dialog");
const dialogImage = dialog.querySelector("figure img");
const dialogCount = dialog.querySelector("figcaption span");
const dialogTitle = dialog.querySelector("figcaption strong");
const guestDialog = document.querySelector(".guest-dialog");
const guestDialogImage = guestDialog.querySelector("figure img");
const guestDialogCount = guestDialog.querySelector(".guest-dialog-count");
let activeWork = 0;
let activeGuest = 0;
let ticking = false;
let galleryOffset = 0;
let galleryLoopWidth = 0;
let previousGalleryTime = 0;
let portraitPointerX = 0;
let portraitPointerY = 0;
let heroScrollProgress = 0;
let galleryPaused = false;
let guestPaused = false;
let stableViewportWidth = window.innerWidth;
let stableViewportHeight = window.innerHeight;
let lockedScrollY = 0;
let dialogScrollLocked = false;

function lockDialogScroll() {
  if (window.innerWidth > 760 || dialogScrollLocked) return;
  lockedScrollY = window.scrollY;
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.classList.add("dialog-open");
  dialogScrollLocked = true;
}

function unlockDialogScroll() {
  if (!dialogScrollLocked) return;
  document.body.classList.remove("dialog-open");
  document.body.style.top = "";
  dialogScrollLocked = false;
  window.scrollTo(0, lockedScrollY);
}

function showStableDialog(dialogElement) {
  dialogElement.showModal();
  lockDialogScroll();
}

function updateMotionToggle(button, paused, galleryName) {
  button.setAttribute("aria-pressed", String(paused));
  button.setAttribute("aria-label", `${paused ? "Play" : "Pause"} ${galleryName}`);
  button.title = `${paused ? "Play" : "Pause"} gallery`;
  button.classList.toggle("is-paused", paused);
}

updateMotionToggle(workMotionToggle, galleryPaused, "work gallery");
updateMotionToggle(guestMotionToggle, guestPaused, "client gallery");

function showGuest(index) {
  activeGuest = index % guestSlides.length;
  guestSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeGuest;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  guestCounter.textContent = `${String(activeGuest + 1).padStart(2, "0")} / ${String(guestSlides.length).padStart(2, "0")}`;
}

if (guestSlides.length > 1) {
  window.setInterval(() => {
    if (guestPaused || document.hidden || guestDialog.open) return;
    guestCarousel.classList.add("is-collapsing");
    guestImage.classList.add("is-transitioning");
    window.setTimeout(() => showGuest(activeGuest + 1), 1500);
    window.setTimeout(() => {
      guestCarousel.classList.remove("is-collapsing");
      guestImage.classList.remove("is-transitioning");
    }, 1550);
  }, 5000);
}

workMotionToggle.addEventListener("click", () => {
  galleryPaused = !galleryPaused;
  updateMotionToggle(workMotionToggle, galleryPaused, "work gallery");
});

guestMotionToggle.addEventListener("click", () => {
  guestPaused = !guestPaused;
  guestCarousel.classList.remove("is-collapsing");
  guestImage.classList.remove("is-transitioning");
  updateMotionToggle(guestMotionToggle, guestPaused, "client gallery");
});

guestCarousel.addEventListener("click", () => {
  const activeSlide = guestSlides[activeGuest];
  guestDialogImage.src = activeSlide.src;
  guestDialogImage.alt = activeSlide.alt;
  guestDialogCount.textContent = `${String(activeGuest + 1).padStart(2, "0")} / ${String(guestSlides.length).padStart(2, "0")}`;
  showStableDialog(guestDialog);
});

guestDialog.querySelector(".guest-dialog-close").addEventListener("click", () => guestDialog.close());
guestDialog.addEventListener("close", unlockDialogScroll);
guestDialog.addEventListener("click", (event) => {
  if (event.target === guestDialog) guestDialog.close();
});

function renderHeroMotion() {
  if (reducedMotion) return;
  portrait.style.transform = `translate3d(${portraitPointerX}px, ${1.5 + portraitPointerY + heroScrollProgress * 3.5}%, 0) scale(${1.015 + heroScrollProgress * 0.035})`;
  titleLineBlocks[0].style.transform = `translate3d(${-heroScrollProgress * 34}px, 0, 0)`;
  titleLineBlocks[1].style.transform = `translate3d(${heroScrollProgress * 38}px, 0, 0)`;
}

function animateIntro() {
  if (reducedMotion) {
    titleLines.forEach((line) => (line.style.transform = "translateY(0)"));
    revealCopy.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });
    portraitWrap.style.clipPath = "inset(0 0 0 0)";
    heroThread.style.height = "68%";
    return;
  }

  titleLines.forEach((line, index) => {
    line.animate(
      [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }],
      {
        duration: 1050,
        delay: 180 + index * 130,
        easing: "cubic-bezier(.18,.78,.18,1)",
        fill: "forwards",
      },
    );
  });

  revealCopy.forEach((item, index) => {
    item.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 700,
        delay: 520 + index * 115,
        easing: "ease-out",
        fill: "forwards",
      },
    );
  });

  portraitWrap.animate(
    [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
    { duration: 1250, delay: 120, easing: "cubic-bezier(.24,.72,.16,1)", fill: "forwards" },
  );

  heroThread.animate([{ height: "0" }, { height: "68%" }], {
    duration: 1150,
    delay: 320,
    easing: "cubic-bezier(.24,.72,.16,1)",
    fill: "forwards",
  });
}

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.querySelector("span").textContent = open ? "Close" : "Menu";
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}

menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

hero.addEventListener("pointermove", (event) => {
  if (reducedMotion || window.innerWidth <= 760) return;
  const box = hero.getBoundingClientRect();
  portraitPointerX = ((event.clientX - box.left) / box.width - 0.5) * 8;
  portraitPointerY = ((event.clientY - box.top) / box.height - 0.5) * 0.7;
  requestAnimationFrame(renderHeroMotion);
});

hero.addEventListener("pointerleave", () => {
  portraitPointerX = 0;
  portraitPointerY = 0;
  requestAnimationFrame(renderHeroMotion);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

document.querySelectorAll(".reveal-on-scroll").forEach((element) => revealObserver.observe(element));

function updateDialog() {
  const work = works[activeWork];
  dialogImage.src = work.src;
  dialogImage.alt = work.alt;
  dialogCount.textContent = `${String(activeWork + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
  dialogTitle.textContent = work.title;
}

function openWork(index) {
  activeWork = index;
  updateDialog();
  showStableDialog(dialog);
}

function stepWork(direction) {
  activeWork = (activeWork + direction + works.length) % works.length;
  updateDialog();
}

allWorkFrames.forEach((frame) => frame.addEventListener("click", () => openWork(Number(frame.dataset.work))));
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", unlockDialogScroll);
dialog.querySelector(".dialog-prev").addEventListener("click", () => stepWork(-1));
dialog.querySelector(".dialog-next").addEventListener("click", () => stepWork(1));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") stepWork(-1);
  if (event.key === "ArrowRight") stepWork(1);
});

function measureGallery() {
  const repeatedFirstFrame = allWorkFrames[works.length];
  galleryLoopWidth = repeatedFirstFrame
    ? repeatedFirstFrame.offsetLeft - allWorkFrames[0].offsetLeft
    : 0;
  if (galleryLoopWidth > 0) galleryOffset %= galleryLoopWidth;
}

function updateGalleryFocus() {
  const center = window.innerWidth / 2;
  allWorkFrames.forEach((frame) => {
    const box = frame.getBoundingClientRect();
    const frameCenter = box.left + box.width / 2;
    const distance = Math.min(1, Math.abs(frameCenter - center) / center);
    const blur = Math.max(0, distance - 0.34) * 3;
    frame.querySelector("img").style.filter = `blur(${blur}px)`;
  });
}

function animateGallery(timestamp) {
  if (!previousGalleryTime) previousGalleryTime = timestamp;
  const elapsed = Math.min(50, timestamp - previousGalleryTime);
  previousGalleryTime = timestamp;

  if (galleryLoopWidth > 0 && !dialog.open && !galleryPaused && !document.hidden) {
    const speed = window.innerWidth <= 760 ? 20 : 32;
    galleryOffset = (galleryOffset + (elapsed / 1000) * speed) % galleryLoopWidth;
  }

  workTrack.style.transform = `translate3d(${-galleryOffset}px, 0, 0)`;
  updateGalleryFocus();
  requestAnimationFrame(animateGallery);
}

function updateMotion() {
  ticking = false;
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

  if (!reducedMotion) {
    heroScrollProgress = Math.min(1, y / Math.max(1, stableViewportHeight));
    renderHeroMotion();
  }
}

function requestMotionUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateMotion);
  }
}

window.addEventListener("scroll", requestMotionUpdate, { passive: true });
window.addEventListener("resize", () => {
  const nextViewportWidth = window.innerWidth;
  if (Math.abs(nextViewportWidth - stableViewportWidth) > 1) {
    stableViewportWidth = nextViewportWidth;
    stableViewportHeight = window.innerHeight;
    measureGallery();
  }
  requestMotionUpdate();
});
window.addEventListener("load", () => {
  animateIntro();
  measureGallery();
  updateMotion();
  requestAnimationFrame(animateGallery);
});
