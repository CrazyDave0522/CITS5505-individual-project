const CONFIG = {
  PRACTICES_URL: "./data/best-practices.json",
  ANIMAL_API: "https://api.thedogapi.com/v1/images/search",
  FALLBACK_IMAGE: "./images/fallback.png",
  STORAGE_KEY: "practiceSelections",
  SUCCESS_THRESHOLD: 12,
  CATEGORIES: ["HTML", "CSS", "JS"],
};

class BestPracticeApp {
  constructor() {
    this.practices = [];
    this.selections = new Set();
    this.cachedAnimal = null;
    this.modalVisible = false;
    this.init();
  }

  async init() {
    await this.loadData();
    this.loadSelections();
    this.render();
    this.bindEvents();
    this.initMobileMenu();
  }

  // data loading
  async loadData() {
    try {
      const response = await fetch(CONFIG.PRACTICES_URL);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      this.practices = await response.json();
      this.validateData();
    } catch (error) {
      console.error("data loading failed:", error);
      this.showError();
    }
  }

  validateData() {
    const requiredFields = ["id", "title", "description", "category"];
    const isValid = this.practices.every(
      (p) =>
        requiredFields.every((f) => p[f]) &&
        CONFIG.CATEGORIES.includes(p.category)
    );
    if (!isValid) throw new Error("data validation failed");
  }

  // state management
  loadSelections() {
    const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
    this.selections = new Set(saved);
  }

  saveSelections() {
    localStorage.setItem(
      CONFIG.STORAGE_KEY,
      JSON.stringify([...this.selections])
    );
  }

  // render UI
  render() {
    const container = document.getElementById("practices-container");
    container.innerHTML = this.generateCards();
    this.updateProgress();
  }


// 修改 generateCards() 方法
generateCards() {
  return CONFIG.CATEGORIES.map(category => {
    // 将 JavaScript 转换为 JS
    const formattedCategory = category === 'JavaScript' ? 'JS' : category;
    const headerClass = `${formattedCategory.toLowerCase()}-header`;
    
    return `
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header ${headerClass}">
            <h3 class="mb-0">${category}</h3>
          </div>
          <div class="card-body">
            ${this.generateItems(category)}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

  generateItems(category) {
    return this.practices
      .filter((p) => p.category === category)
      .map(
        (p) => `
              <div class="practice-item mb-3" data-id="${p.id}">
                  <h5 class="fw-bold">${p.title}</h5>
                  <p class="text-muted">${p.description}</p>
                  <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" 
                             id="${p.id}" ${
          this.selections.has(p.id) ? "checked" : ""
        }>
                      <label class="form-check-label" for="${p.id}">
                         Implemented
                      </label>
                  </div>
              </div>
          `
      )
      .join("");
  }

  // progress update
  updateProgress() {
    const total = this.selections.size;
    const progress = document.querySelector(".progress-bar");

    // update progress bar
    const percent = ((total / 15) * 100).toFixed(1);
    progress.style.width = `${percent}%`;
    document.querySelector(
      ".progress-text"
    ).textContent = `${total}/15 best practices implemented`;

    // handle gift icon
    const gift = document.querySelector(".gift-indicator");
    if (total >= CONFIG.SUCCESS_THRESHOLD) {
      if (!gift) this.createGift();
    } else {
      if (gift) gift.remove();
      if (this.modalVisible) this.hideModal();
    }
  }

  createGift() {
    const container = document.querySelector(".progress-bar-container");
    const gift = document.createElement("div");
    gift.className = "gift-indicator";
    gift.innerHTML = "🎁";
    gift.addEventListener("click", () => this.showReward());
    container.appendChild(gift);
  }

  // event handling
  bindEvents() {
    document
      .getElementById("practices-container")
      .addEventListener("change", (e) => {
        if (e.target.matches(".form-check-input")) {
          this.handleCheckbox(e.target);
        }
      });

    document
      .querySelector(".modal-mask")
      .addEventListener("click", () => this.hideModal());
    document.querySelector(".confirm-btn").addEventListener("click", () => {
      this.resetSelections();
      this.hideModal();
    });
  }

  handleCheckbox(checkbox) {
    const id = checkbox.id;
    checkbox.checked ? this.selections.add(id) : this.selections.delete(id);
    this.saveSelections();
    this.updateProgress();
  }

  // modal control
  async showReward() {
    if (this.modalVisible) return;
    this.modalVisible = true;

    try {
      const media = await this.fetchAnimal();
      this.displayMedia(media);
    } catch (error) {
      console.error("failed to get reward:", error);
      this.displayMedia(CONFIG.FALLBACK_IMAGE);
    }

    document.querySelector(".reward-modal").style.display = "block";
  }

  hideModal() {
    document.querySelector(".reward-modal").style.display = "none";
    this.modalVisible = false;
  }

  // data reset
  resetSelections() {
    this.selections.clear();
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    document
      .querySelectorAll(".form-check-input")
      .forEach((cb) => (cb.checked = false));
    this.updateProgress();
  }

  // animal image fetching
  async fetchAnimal() {
    if (this.cachedAnimal) return this.cachedAnimal;

    try {
      const response = await fetch(CONFIG.ANIMAL_API);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      this.cachedAnimal = data[0].url;
      return this.cachedAnimal;
    } catch (error) {
      return CONFIG.FALLBACK_IMAGE;
    }
  }

  displayMedia(url) {
    const container = document.querySelector(".animal-media");
    container.innerHTML = url.endsWith(".mp4")
      ? `
          <video src="${url}" autoplay muted loop class="img-fluid rounded-3"></video>
      `
      : `
          <img src="${url}" class="img-fluid rounded-3" alt="Reward Image">
      `;
  }

  // mobile menu
  initMobileMenu() {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => {
      const headers = document.querySelectorAll(".category-header");
      headers.forEach((h) => {
        h.style.cursor = mq.matches ? "pointer" : "default";
        h[mq.matches ? "addEventListener" : "removeEventListener"](
          "click",
          this.toggleSection
        );
      });
    };
    mq.addListener(handler);
    handler();
  }

  toggleSection = (e) => {
    const header = e.target.closest(".card-header");
    const body = header.nextElementSibling;
    body.classList.toggle("d-none");
  };

  // error handling
  showError() {
    const container = document.getElementById("practices-container");
    container.innerHTML = `
          <div class="alert alert-danger">
              <i class="bi bi-exclamation-triangle"></i>
              unable to load content, please check your network connection and refresh the page
          </div>
      `;
  }
}

// initialize the app
document.addEventListener("DOMContentLoaded", () => new BestPracticeApp());
