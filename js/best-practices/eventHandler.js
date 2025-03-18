// eventHandler.js
class EventHandler {
    static bindEvents(app) {
      document.getElementById("practices-container").addEventListener("change", (e) => {
        if (e.target.matches(".form-check-input")) {
          app.handleCheckbox(e.target);
        }
      });
    }
  }
  