class UIManager {
  static updateProgress(total) {
    const progress = document.querySelector(".progress-bar");
    const percent = ((total / 15) * 100).toFixed(1);
    progress.style.width = `${percent}%`;
    document.querySelector(
      ".progress-text"
    ).textContent = `${total}/15 best practices implemented`;

    // 处理礼物图标
    const gift = document.querySelector(".gift-indicator");
    if (total >= CONFIG.SUCCESS_THRESHOLD) {
      if (!gift) UIManager.createGift(); // 只有当礼物图标不存在时才创建
    } else {
      if (gift) gift.remove();
    }
  }

  static generateCards(practices) {
    return CONFIG.CATEGORIES.map(
      (category) => `
        <div class="col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-header ${category.toLowerCase()}-header">
              <h3 class="mb-0">${category}</h3>
            </div>
            <div class="card-body">
              ${UIManager.generateItems(practices, category)}
            </div>
          </div>
        </div>
      `
    ).join("");
  }

  static generateItems(practices, category) {
    return practices
      .filter((p) => p.category === category)
      .map(
        (p) => `
        <div class="practice-item mb-5" data-id="${p.id}">
          <h5 class="fw-bold">${p.title}</h5>
          <p class="text-muted">${p.description}</p>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="${p.id}" />
            <label class="form-check-label" for="${p.id}">Implemented</label>
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
