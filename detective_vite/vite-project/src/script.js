import { Client, gql, cacheExchange, fetchExchange } from "@urql/core";
import fallbackProfile from "./asset/profile.jpg";

let animationToken = 0;
export function initHome() {
  const container = document.getElementById("modules-container");
  if (!container) return;
  async function loadDetectives() {
    container.innerHTML = "";
    const client = new Client({
      url: "https://eu-west-2.cdn.hygraph.com/content/cmic8lwzx01e407w429wkjxja/master",
      exchanges: [cacheExchange, fetchExchange],
      fetchOptions: () => {
        const token =
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjM5OTk2ODAsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21pYzhsd3p4MDFlNDA3dzQyOXdranhqYS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiNmFlMzc4OWItNTE2ZC00ODQxLWEzYmYtYWM0MGM2MWE4Zjc2IiwianRpIjoiY21pZGJ2NG1yMDNjdTA3bW1hZTh1Ymp0eCJ9.W8kcTboiqjeC2YCVO5KhNgQgkQ0JjzbWRAXGQ2d7kEwOxMSGbNbPUc2z42IhXYwx9bnL76nuAwnuSn7gF3fSqbFBUQAVdPX4h2e3lmXEWe48q7Msqam32yH9gCoWk2U5TVgXdKLv6XVRM8bJWw11R8P5P66QpAjYYZ-niYu4577tD2iUTdyMb_QpEvdFWel5Hfb-sfBWHG8u9xSLZ_eUEN8gPfbFcoQwmt-OQ8FW-w7-2yzPNakFqcZ9Z0-uKd_4pAIZjyfH8_JqERyTu18LzicX4AH9nF6zd1dcloew6TD-AHgDouosa8QMAsCgLreFbuadUsshFrs5VpS3O0BXfZhbxRDOAQOSQpujewUMoaCNod_AN7b5JVUfHGBkiWgjXNSL1PaWyaSXT56VQdhxXUlDdOS_OWlNWhfjCyMC0CcjwOwCsSDh5ivrPF3DWMzYYp0Ardllqs_oHzr1XDxS80s3kzmlyCRmIBA3sWu0BghYDVghBv2ITyZWflfebz5heS793iUYowVapVBUhYLPdzw5aezFkLV28aLfU-IvmKaS6vAU6KFHAvYLnibtAf2nOWxU-wcuOOfswFmzD8M8pvF-yXPIUczGSuuHD62O-6JsHGbgL7JDeJCosckTpUYslCCtI48GsfcGNBen6UlLaRjItJqDJRNRNyhix-hUhag";
        return {
          headers: { authorization: token ? `Bearer ${token}` : "" },
        };
      },
    });

    const DetectivesQuery = gql`
      query {
        detectives {
          name
          age
          nationality
          introduction
          appearingInMedia
          profilePhoto {
            url
          }
        }
      }
    `;

    const clientQueryResult = await client.query(DetectivesQuery);
    // console.log(clientQueryResult);

    // const list = document.querySelector(".photo-list");
    const detectives = clientQueryResult.data.detectives;

    console.log(detectives);
    // list.innerHTML = "";

    // const container = document.getElementById("modules-container");

    // Insert floating photos
    container.innerHTML = detectives
      .map(
        (d) => `
        <a class="floating-photo" data-id="${d.name}">
          <img src="${
            d.profilePhoto && d.profilePhoto.url
              ? d.profilePhoto.url
              : fallbackProfile
          }" alt="${d.name}">
          <div class="photo-title">${d.name}</div>
        </a>
      `
      )
      .join("");

    setTimeout(() => {
      initFloatingPhotos();
      initDetectiveClick();
      initSearch();
    }, 50);

    function initDetectiveClick() {
      const photos = document.querySelectorAll(".floating-photo");

      photos.forEach((photo) => {
        photo.addEventListener("click", () => {
          const id = photo.dataset.id;

          loadDetectiveProfile(id);
        });
      });
    }

    function loadDetectiveProfile(id) {
      const d = detectives.find((x) => x.name === id);

      // Fill modal content
      document.getElementById("modalPhoto").src =
        d.profilePhoto && d.profilePhoto.url
          ? d.profilePhoto.url
          : fallbackProfile;
      document.getElementById("modalName").innerText = d.name;
      document.getElementById("modalAge").innerText = d.age;
      document.getElementById("modalNationality").innerText = d.nationality;
      document.getElementById("modalMedia").innerText = d.appearingInMedia;
      document.getElementById("modalIntro").innerText = d.introduction;

      // Show modal
      document.getElementById("detectiveModal").style.display = "block";
    }
    // Close modal
    document.getElementById("closeModal").onclick = () => {
      document.getElementById("detectiveModal").style.display = "none";
    };

    // Close when clicking outside the modal
    window.onclick = (event) => {
      const modal = document.getElementById("detectiveModal");
      if (event.target === modal) modal.style.display = "none";
    };

    // initFloatingPhotos();
    // initDetectiveClick();
    // initSearch(); // must be last
  }

  // --------------------- SEARCH SYSTEM ---------------------
  function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    let currentlyCentered = null;

    function centerElement(el) {
      const size = 150; // based on your image size
      const centerX = window.innerWidth / 2 - size / 2;
      const centerY = window.innerHeight / 2 - size / 2;

      el.style.left = centerX + "px";
      el.style.top = centerY + "px";
    }

    function searchPhotos() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      const elements = Array.from(document.querySelectorAll(".floating-photo"));

      // remove old highlight/freeze
      elements.forEach((el) => {
        el.classList.remove("highlighted", "frozen");
      });

      const match = elements.find((el) =>
        el.getAttribute("data-id").toLowerCase().includes(query)
      );

      if (!match) {
        alert("No matching detective found.");
        return;
      }

      // freeze animation + scale it + center it
      match.classList.add("highlighted", "frozen");
      centerElement(match);

      currentlyCentered = match;
    }

    // clicking anywhere else removes highlight + floating resumes
    document.addEventListener("click", (e) => {
      if (!currentlyCentered) return;

      // If click IS NOT the centered image
      if (!currentlyCentered.contains(e.target)) {
        currentlyCentered.classList.remove("highlighted", "frozen");
        currentlyCentered = null;
      }
    });

    searchBtn.addEventListener("click", (e) => {
      e.preventDefault(); // prevent form refresh
      searchPhotos();
    });

    searchBtn.addEventListener("click", searchPhotos);
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") searchPhotos();
    });

    document.addEventListener("click", (e) => {
      if (!currentlyCentered) return;
      if (
        !currentlyCentered.contains(e.target) &&
        e.target !== searchBtn &&
        e.target !== searchInput
      ) {
        currentlyCentered.classList.remove("highlighted", "frozen");
        currentlyCentered = null;
      }
    });
  }
  // --------------------- FLOATING SYSTEM ---------------------
  function initFloatingPhotos() {
    const token = ++animationToken;
    const SIZE = 110;
    const items = [...document.querySelectorAll(".floating-photo")];

    const W = window.innerWidth;
    const H = window.innerHeight;

    const bubbles = items.map((el) => {
      const x = Math.random() * (W - SIZE);
      const y = Math.random() * (H - SIZE);
      const speed = 0.4 + Math.random();
      const angle = Math.random() * Math.PI * 2;

      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      el.style.left = x + "px";
      el.style.top = y + "px";

      return { el, x, y, dx, dy };
    });

    function animate() {
      if (token !== animationToken) return;
      bubbles.forEach((b) => {
        // Skip frozen/highlighted elements
        if (b.el.classList.contains("frozen")) return;

        b.x += b.dx;
        b.y += b.dy;

        if (b.x <= 0 || b.x >= W - SIZE) b.dx *= -1;
        if (b.y <= 0 || b.y >= H - SIZE) b.dy *= -1;

        b.el.style.left = b.x + "px";
        b.el.style.top = b.y + "px";
      });

      requestAnimationFrame(animate);
    }
    animate();
  }
  // Start
  loadDetectives();
}
