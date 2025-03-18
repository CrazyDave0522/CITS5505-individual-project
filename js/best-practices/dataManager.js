// dataManager.js
class DataManager {
  static async loadPractices() {
    try {
      const response = await fetch(CONFIG.PRACTICES_URL);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      DataManager.validateData(data);
      return data;
    } catch (error) {
      console.error("Data loading failed:", error);
      throw error;
    }
  }

  static validateData(practices) {
    const requiredFields = ["id", "title", "description", "category"];
    if (
      !practices.every(
        (p) =>
          requiredFields.every((f) => p[f]) &&
          CONFIG.CATEGORIES.includes(p.category)
      )
    ) {
      throw new Error("Data validation failed");
    }
  }
}
