class BestPracticeApp {
  constructor() {
    this.practices = [];
    this.selections = new Set();
    this.init();
  }

  async init() {
    try {
      this.practices = await DataManager.loadPractices();
      document.getElementById("practices-container").innerHTML =
        UIManager.generateCards(this.practices, this.selections);
      this.loadSelections(); // 先加载本地存储的选择数据
      // 根据 selections 更新复选框状态
      this.selections.forEach((id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
      UIManager.updateProgress(this.selections.size); // 页面加载时立即更新进度
      EventHandler.bindEvents(this);
      UIManager.initMobileMenu(); // Initialize the mobile menu
    } catch (error) {
      document.getElementById("practices-container").innerHTML =
        "<div class='alert alert-danger'>Failed to load practices.</div>";
    }
  }

  loadSelections() {
    const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
    this.selections = new Set(saved);
  }

  handleCheckbox(checkbox) {
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      checkbox.checked
        ? this.selections.add(checkbox.id)
        : this.selections.delete(checkbox.id);
      
      localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify([...this.selections])
      );
      UIManager.updateProgress(this.selections.size);
    }, 200); // 200ms延迟
  }

  resetSelections() {
    this.selections.clear();
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    document
      .querySelectorAll(".form-check-input")
      .forEach((cb) => (cb.checked = false));
    UIManager.updateProgress(0);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new BestPracticeApp(); // 将实例存到全局
});
