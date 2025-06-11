window.addEventListener('load', () => {
        
    const frameCount = 60;
    const images = [];
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Add canvas to page
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = "-1";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    // Resize canvas to screen
    function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Frame path generator
    const currentFrame = i => `frames2/${i.toString().padStart(4, '0')}.jpg`;

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
    }
    images[0].onload = () => drawFrameWithAlpha(0, 0); // Start fully transparent

    // Get the section after which animation begins
    const triggerSection = document.querySelector('.scrolling-img2');
    const triggerOffset = triggerSection.offsetTop - 200;

    function drawFrameWithAlpha(index, alpha = 1) {
    const img = images[index];
    if (!img.complete) return;

    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight;
    if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
    } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
    }

    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = alpha;
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    context.globalAlpha = 1;
    }

    window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const fadeInStart = triggerOffset;
    const fadeInEnd = fadeInStart + 300;

    const scrollStart = triggerOffset;
    const scrollRange = 1500;

    const scrolled = Math.max(0, scrollTop - scrollStart);
    const scrollFraction = Math.min(1, scrolled / scrollRange);
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));

    // Fade in first frame
    let alpha = 1;
    if (scrollTop < fadeInStart) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        return;
    } else if (scrollTop >= fadeInStart && scrollTop <= fadeInEnd) {
        alpha = (scrollTop - fadeInStart) / (fadeInEnd - fadeInStart);
    }

    // Fade out last frame
    const fadeOutStart = scrollStart + scrollRange - 300;
    const fadeOutEnd = scrollStart + scrollRange;

    if (scrollTop >= fadeOutStart && scrollTop <= fadeOutEnd) {
        alpha = 1 - (scrollTop - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    } else if (scrollTop > fadeOutEnd) {
        alpha = 0;
    }
    
    drawFrameWithAlpha(frameIndex, alpha);
    });
    //end video scroll animation



    const rightText = document.querySelector(".scroll-right2");
    const textSection = document.querySelector(".scroll-text-container2");

    const sectionTop = textSection.offsetTop;
    const sectionHeight = textSection.offsetHeight;

    window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Progress: 0 at section start, 1 at section end
    const progress = (scrollY - sectionTop) / sectionHeight;
    const clamped = Math.min(Math.max(progress, 0), 1);

    // Fade: max opacity at 0.5, fades at edges
    const fade = 1 - Math.abs(clamped - 0.5) * 2;

    const gap = 200; // pixels between the two at origin
    const distance = 100; // full move-out distance

    rightText.style.transform = `translateX(calc(${gap}px + ${clamped * distance}px)) translateY(-50%)`;

    // Fade text
    rightText.style.opacity = fade;
    });
});