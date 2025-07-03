let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    // Common function to handle movement
    const movePaper = (x, y) => {
      if (!this.rotating) {
        this.velX = x - this.prevX;
        this.velY = y - this.prevY;
      }

      const dirX = x - this.touchStartX;
      const dirY = y - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevX = x;
        this.prevY = y;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // TOUCH EVENTS
    paper.addEventListener("touchstart", (e) => {
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = this.prevX = e.touches[0].clientX;
      this.touchStartY = this.prevY = e.touches[0].clientY;
    });

    paper.addEventListener("touchmove", (e) => {
      e.preventDefault();
      movePaper(e.touches[0].clientX, e.touches[0].clientY);
    });

    paper.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // MOUSE EVENTS
    paper.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        this.touchStartX = this.prevX = e.clientX;
        this.touchStartY = this.prevY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (this.holdingPaper) {
        movePaper(e.clientX, e.clientY);
      }
    });

    document.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Optional: Gesture support for mobile
    paper.addEventListener("gesturestart", (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener("gestureend", () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
