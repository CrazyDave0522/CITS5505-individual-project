// js/best-practices.js

// Configuration Constants
const CONFIG = {
  PRACTICES_URL: "../data/best-practices.json",
  ANIMAL_API: "https://random.dog/woof.json",
  FALLBACK_IMAGE: "../images/fallback.svg",
  STORAGE_KEY: "bestPracticeSelections",
  SUCCESS_THRESHOLD: 12,
  CATEGORIES: ["HTML", "CSS", "JavaScript"],
};

class BestPracticesApp {
  constructor() {
    this.practices = [];
    this.selections = new Set();
    this.init();
  }

  async init() {
    await this.loadData();
    this.loadSelections();
    this.render();
    this.setupEventListeners();
    this.setupMobileMenu();
  }

  // Data Loading Methods
  async loadData() {
    try {
      const response = await fetch(CONFIG.PRACTICES_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      this.practices = await response.json();
      this.validateData();
    } catch (error) {
      console.error("Data loading failed:", error);
      this.showErrorAlert();
    }
  }

  validateData() {
    const isValid = this.practices.every(
      (practice) =>
        practice.id &&
        practice.title &&
        practice.description &&
        CONFIG.CATEGORIES.includes(practice.category)
    );
    if (!isValid) throw new Error("Invalid data structure");
  }

  // State Management
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

  // Rendering Methods
  render() {
    const container = document.getElementById("practices-container");
    container.innerHTML = this.generateCategoryCards();
    this.updateProgress();
  }

  generateCategoryCards() {
    return CONFIG.CATEGORIES.map(
      (category) => `
          <div class="col-md-4 category-card">
              <div class="card mb-4">
                  <div class="card-header category-header">
                      <h2>${category}</h2>
                  </div>
                  <div class="card-body">
                      ${this.generatePracticeItems(category)}
                  </div>
              </div>
          </div>
      `
    ).join("");
  }

  generatePracticeItems(category) {
    return this.practices
      .filter((p) => p.category === category)
      .map(
        (practice) => `
              <div class="practice-item mb-3" data-id="${practice.id}">
                  <h3 class="h5">${practice.title}</h3>
                  <p class="text-muted">${practice.description}</p>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" 
                          id="${practice.id}" ${
          this.selections.has(practice.id) ? "checked" : ""
        }>
                      <label class="form-check-label" for="${practice.id}">
                          Implemented
                      </label>
                  </div>
              </div>
          `
      )
      .join("");
  }

  // Progress Tracking
  updateProgress() {
    const total = this.selections.size;

    // update progress bar width
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      const percentage = ((total / 15) * 100).toFixed(1);
      progressBar.style.width = `${percentage}%`;
    }

    // update progress text
    const progressText = document.querySelector(".progress-text");
    if (progressText) {
      progressText.textContent = `${total}/15 best practices implemented`;
    }

    // handle success state
    if (total >= CONFIG.SUCCESS_THRESHOLD) {
      this.showSuccessMessage(total);
      this.fetchAnimalImage();
    }
  }

  // Event Handling
  setupEventListeners() {
    document
      .getElementById("practices-container")
      .addEventListener("change", (e) => {
        if (e.target.matches(".form-check-input")) {
          this.handleCheckboxChange(e.target);
        }
      });
  }

  handleCheckboxChange(checkbox) {
    const practiceId = checkbox.id;

    if (checkbox.checked) {
      this.selections.add(practiceId);
    } else {
      this.selections.delete(practiceId);
    }

    this.saveSelections();
    this.updateProgress();
  }

  // Mobile Menu Implementation
  setupMobileMenu() {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMobileChange = (mq) => {
      const headers = document.querySelectorAll(".category-header");

      if (mq.matches) {
        headers.forEach((header) => {
          header.addEventListener("click", this.toggleMobileCategory);
          header.style.cursor = "pointer";
        });
      } else {
        headers.forEach((header) => {
          header.removeEventListener("click", this.toggleMobileCategory);
          header.style.cursor = "default";
        });
      }
    };

    mediaQuery.addListener(handleMobileChange);
    handleMobileChange(mediaQuery);
  }

  toggleMobileCategory = (e) => {
    const header = e.target.closest(".category-header");
    const cardBody = header.nextElementSibling;

    cardBody.classList.toggle("d-none");
    header.classList.toggle("active-category");
  };

  // API Handling
  async fetchAnimalImage() {
    try {
      const response = await fetch(CONFIG.ANIMAL_API);
      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const imageUrl = data.url.includes(".mp4")
        ? CONFIG.FALLBACK_IMAGE
        : data.url;
      this.displayAnimal(imageUrl);
    } catch (error) {
      console.error("Animal fetch failed:", error);
      this.displayAnimal(CONFIG.FALLBACK_IMAGE);
    }
  }

  displayAnimal(imageUrl) {
    const container = document.querySelector(".animal-reward");
    container.innerHTML = `
          <div class="text-center mt-4">
              <h3>Congratulations! 🎉</h3>
              <div class="animal-image-container">
                  ${
                    imageUrl.endsWith(".webm")
                      ? `
                      <video controls class="img-fluid">
                          <source src="${imageUrl}" type="video/webm">
                      </video>
                  `
                      : `
                      <img src="${imageUrl}" class="img-fluid rounded" alt="Cute animal reward">
                  `
                  }
              </div>
          </div>
      `;
  }

  // Error Handling
  showErrorAlert() {
    const container = document.getElementById("practices-container");
    container.innerHTML = `
          <div class="alert alert-danger" role="alert">
              Failed to load content. Please refresh the page or try again later.
          </div>
      `;
  }

  // modify success message
  showSuccessMessage(total) {
    const progressText = document.querySelector(".progress-text");
    if (progressText) {
      progressText.innerHTML = `
          <span class="text-success fw-bold">
              Success！You have implemented ${total}/15 best practices！
          </span>
      `;
    }
  }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  new BestPracticesApp();
});
