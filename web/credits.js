document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
        document.getElementById("navbar").classList.add("navbar-dark");
        document.getElementById("navbar").classList.add("bg-dark");
        document.getElementById("navbar").classList.remove("navbar-light");
        document.getElementById("navbar").classList.remove("bg-light");
    }

    document.getElementById("darkModeButton").addEventListener("click", function () {
        let body = document.body;
        let navbar = document.getElementById("navbar");

        body.classList.toggle("dark");
        navbar.classList.toggle("navbar-light");
        navbar.classList.toggle("bg-light");
        navbar.classList.toggle("navbar-dark");
        navbar.classList.toggle("bg-dark");

        if (body.classList.contains("dark")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });
});