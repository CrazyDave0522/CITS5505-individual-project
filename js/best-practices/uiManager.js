class UIManager {
  static updateProgress(total) {
    const progress = document.querySelector(".progress-bar");
    const percent = ((total / 15) * 100).toFixed(1);
    progress.style.width = `${percent}%`;
    document.querySelector(
      ".progress-text"
    ).textContent = `${total}/15 best practices implemented`;

    // handling gift icon
    const gift = document.querySelector(".gift-indicator");
    if (total >= CONFIG.SUCCESS_THRESHOLD) {
      if (!gift) UIManager.createGift(); // only create gift when it's not there
    } else {
      if (gift) gift.remove();
    }
  }

  static generateCards(practices, selections) {
    return CONFIG.CATEGORIES.map(
      (category) => `
        <div class="col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-header ${category.toLowerCase()}-header">
              <h3 class="mb-0">${category}</h3>
            </div>
            <div class="card-body">
              ${this.generateItems(
                practices,
                category,
                selections
              )} <!-- pass selections -->
            </div>
          </div>
        </div>
      `
    ).join("");
  }

  static generateItems(practices, category, selections) {
    return practices
      .filter((p) => p.category === category)
      .map(
        (p) => `
          <div class="practice-item mb-5" data-id="${p.id}">
            <h5 class="fw-bold">${p.title}</h5>
            <p class="text-muted">${p.description}</p>
            <div class="form-check form-switch">
              <input class="form-check-input" 
        type="checkbox" 
        id="${p.id}-input"  
        ${selections.has(p.id) ? "checked" : ""}
        aria-labelledby="${p.id}-label"> 

<label class="form-check-label" 
       id="${p.id}-label"  
       for="${p.id}-input">  
  Implemented
</label>
            </div>
          </div>
        `
      )
      .join("");
  }

  static createGift() {
    const container = document.querySelector(".progress-bar-container");
    if (!container) return;

    const gift = document.createElement("div");
    gift.className = "gift-indicator";
    gift.innerHTML = "🎁";

    RewardManager.preloadMedia();

    gift.addEventListener("click", () => RewardManager.showReward());
    container.appendChild(gift);
  }

  static initMobileMenu() {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => {
      document.querySelectorAll(".card-header").forEach((header) => {
        header.style.cursor = mq.matches ? "pointer" : "default";
        header[mq.matches ? "addEventListener" : "removeEventListener"](
          "click",
          UIManager.toggleSection
        );
      });
    };
    mq.addListener(handler);
    handler();
  }

  static toggleSection(e) {
    const header = e.target.closest(".card-header");
    if (header) {
      const body = header.nextElementSibling;
      body.classList.toggle("d-none");
    }
  }
}
