document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["darkMode"], (result) => {
    if (result.darkMode === "enabled") {
      document.body.classList.add("dark");
      document.getElementById("navbar").classList.add("navbar-dark");
      document.getElementById("navbar").classList.add("bg-dark");
      document.getElementById("navbar").classList.remove("navbar-light");
      document.getElementById("navbar").classList.remove("bg-light");
    }
  });

  document
    .getElementById("darkModeButton")
    .addEventListener("click", function () {
      let body = document.body;
      let navbar = document.getElementById("navbar");

      body.classList.toggle("dark");
      navbar.classList.toggle("navbar-light");
      navbar.classList.toggle("bg-light");
      navbar.classList.toggle("navbar-dark");
      navbar.classList.toggle("bg-dark");

      if (body.classList.contains("dark")) {
        chrome.storage.local.set({ darkMode: "enabled" });
      } else {
        chrome.storage.local.set({ darkMode: "disabled" });
      }
    });
});