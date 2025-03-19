class RewardManager {
  static cachedMedia = null; // 新增缓存变量
  static preloadTimeout = null;

  static async preloadMedia() {
    try {
      this.cachedMedia = await this.fetchAnimal();
      console.log("Media preloaded successfully");
    } catch (error) {
      console.log("Preload failed, will use fallback");
      this.cachedMedia = CONFIG.FALLBACK_IMAGE;
    }
  }

  static async showReward() {
    const media = this.cachedMedia || CONFIG.FALLBACK_IMAGE;
    this.displayMedia(media);
    document.querySelector(".reward-modal").style.display = "block";
    
    // 立即开始预加载下一张
    this.preloadMedia();
  }

  static hideModal() {
    document.querySelector(".reward-modal").style.display = "none";
  }

  static async fetchAnimal() {
    try {
      const response = await fetch(CONFIG.ANIMAL_API);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return data[0].url;
    } catch (error) {
      return CONFIG.FALLBACK_IMAGE;
    }
  }

  static displayMedia(url) {
    const container = document.querySelector(".animal-media");
    container.innerHTML = `
      <h2 class="text-center fw-bold">Congratulations 🎉</h2>
      ${
        url.endsWith(".mp4")
          ? `<video src="${url}" autoplay muted loop class="img-fluid rounded-3"></video>`
          : `<img src="${url}" loading="lazy" class="img-fluid rounded-3" alt="Reward Image">`
      }
    `;
  }
}

// 绑定关闭弹窗的事件，并重置选择状态
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".modal-mask")
    .addEventListener("click", RewardManager.hideModal);
  document.querySelector(".confirm-btn").addEventListener("click", () => {
    if (window.app) {
      window.app.resetSelections();
    }
    RewardManager.hideModal();
  });
});
