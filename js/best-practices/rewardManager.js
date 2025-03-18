class RewardManager {
  static async showReward() {
    try {
      const media = await RewardManager.fetchAnimal();
      RewardManager.displayMedia(media);
    } catch (error) {
      console.error("Failed to fetch reward image:", error);
      RewardManager.displayMedia(CONFIG.FALLBACK_IMAGE);
    }
    document.querySelector(".reward-modal").style.display = "block";
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
          : `<img src="${url}" class="img-fluid rounded-3" alt="Reward Image">`
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
