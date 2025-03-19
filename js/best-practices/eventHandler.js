// eventHandler.js
class EventHandler {
  static bindEvents(app) {
    const container = document.getElementById("practices-container");
    container.addEventListener("change", (e) => {
      const checkbox = e.target.closest(".form-check-input");
      if (checkbox) app.handleCheckbox(checkbox);
    });
  }
}
