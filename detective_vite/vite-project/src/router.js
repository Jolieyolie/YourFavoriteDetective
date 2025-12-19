import Home from "./pages/home.js";
import DetectiveDetail from "./pages/detective-detail.js";
import { initHome } from "./script.js";
// navigate without refreshing
function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

async function router() {
  const app = document.querySelector("#app");

  // HARD teardown before route change
  app.innerHTML = "";
  const routes = [
    { path: "/", view: Home, init: initHome },
    { path: "/detective-detail", view: DetectiveDetail },
  ];

  // find matching route
  const match = routes.find((r) => r.path === location.pathname) || routes[0];

  document.querySelector("#app").innerHTML = match.view();
  if (match.init) {
    match.init();
  }
}

// back/forward buttons
window.addEventListener("popstate", router);

// intercept link clicks
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

// load initial view
router();
