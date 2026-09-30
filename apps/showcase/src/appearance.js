// Runs before the first paint so the catalog opens in the appearance its URL names.
const appearanceQuery = new URLSearchParams(location.hash.split("?")[1]);
document.documentElement.dataset.cairnAppearance =
  (appearanceQuery.get("appearance") ?? appearanceQuery.get("mode")) === "light" ? "light" : "dark";
