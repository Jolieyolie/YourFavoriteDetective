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
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjgzMjE0NDcsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21pYzhsd3p4MDFlNDA3dzQyOXdranhqYS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiNTBmOTIwZGMtMTlkMy00Mzg3LWFkYWItM2ExMDU5YWNmMzMxIiwianRpIjoiY21rY3N4bDRpMDM4cTA3anMxNTl0ZjBneiJ9.BWGZ6YubG4GnfMc_KTXU59-hT-AlZccghXq0C8F_pKp2QJHbDEOmQd9SAqJSQ8bdmIhPDWP04ux437JX89SIvClNKsVve4DvxjFZBvbzSNn5wb_rjLHq4J0wXKzyCZeil4j7QbEVsWHr90_vCazHsKPKlZNGQxfaIZS-u3tGjoVqIf9PffnybOKi2-kcacWei6cKrKBNplGsicqEcOTcE0sW9N0Yl0ze_UOz5nYdfyPmsKsn5rxoodr4P93ObY9h28xvatD5adbtgsecCk7tKhHg30h8L4A8Y2uQVQF1zcYQ4kmoz7CD8Jo_4fVqZv2u7DsFJdpRnnTullHkpZWn6OsKbumHhwoezuIVCXaraYyq1xutJYZmyssUdAxnEt1dRH3aVomhEwFbBW1cykW6QnXBBInJubFpvkWA2eI9TZSmeRBUOqVn2ZN_FHQPG9GyXcwhedIZeSCutXTS0krh53Ff_DDEoiOGEAe-HuBs_dLs4fm4ZycNjBADiWG-lTfl4D6eU0zE9-1p1r91Y_bMV10ir4Fr7V6I0vxr2dhFimqbfoScJUuQHWFTueL4j5S5mefcAKRvmNYOLjFwEw_PqphehpvjezvWZ8uNdBZXEIIKwAYAmrxTMGkMDD7S57zWbY2o3HbUClaqpcz95Xp0F5BWE0pumizzkkyvBPlK5_c";
        return {
          headers: { authorization: token ? `Bearer ${token}` : "" },
        };
      },
    });

    const DetectivesQuery = gql`
      query {
        detectives(first:1000) {
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
      initHamburgerMenu(); 
      initAddDetectiveForm();
    }, 50);
// --------------------- add Form ---------------------
    function initAddDetectiveForm() {
      const form = document.getElementById("addDetectiveForm");
      if (!form) return;
      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        console.log("Submitting detective:", {
          name: data.name,
          age: data.age,
          nationality: data.nationality,
          introduction: data.introduction,
          appearingInMedia: data.appearingInMedia
        });
        try {
              const res = await fetch("http://localhost:3001/api/create-detective", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: data.name,
                  age: data.age,
                  nationality: data.nationality,
                  introduction: data.introduction,
                  appearingInMedia: data.appearingInMedia,
                }),
              });

              const result = await res.json();

              if (!res.ok) {
                console.error("Create error:", result);
                alert("Failed to create detective");
                return;
              }

              // close modal
              document.getElementById("addDetectiveModal").style.display = "none";
              console.log(result);
              form.reset();

              // reload detectives
              loadDetectives();
            } catch (err) {
              console.error("Network error:", err);
              alert("Server error");
            }
          };
        }
        // try {
        //   const mutation = gql`
        //     mutation AddDetective(
        //       $name: String!
        //       $age: String!
        //       $nationality: String
        //       $introduction: String!
        //       $appearingInMedia: String
        //     ) {
        //       createDetective(
        //         data: {
        //           name: $name
        //           age: $age
        //           nationality: $nationality
        //           introduction: $introduction
        //           appearingInMedia: $appearingInMedia
        //         }
        //       ) {
        //         id
        //       }
        //     }
        //   `;

        //   const createResult = await client
        //     .mutation(mutation, {
        //       name: data.name || "",
        //       age: data.age || "",
        //       nationality: data.nationality || "",
        //       introduction: data.introduction || "",
        //       appearingInMedia: data.appearingInMedia || "",
        //     })
        //     .toPromise();

        //   if (createResult.error) {
        //     console.error("Create error:", createResult.error);
        //     alert("Failed to create detective. Check console.");
        //     return;
        //   }

        //   const detectiveId = createResult.data.createDetective.id;

        //   // PUBLISH USING ID
        //   const publishMutation = gql`
        //     mutation PublishDetective($id: ID!) {
        //       publishDetective(where: { id: $id }) {
        //         id
        //       }
        //     }
        //   `;

        //   await client
        //     .mutation(publishMutation, { id: detectiveId })
        //     .toPromise();

        //   // Only now close modal
        //   document.getElementById("addDetectiveModal").style.display = "none";
        //   form.reset();

        //   // Reload detectives
        //   loadDetectives();
        // } catch (err) {
        //   console.error("Unexpected error:", err);
        //   alert("Unexpected error. See console.");
        // }
    //   };
    // }

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
  // ---------------------Hamburger Menu ---------------------
  function initHamburgerMenu() {
    const burger = document.getElementById("hamburger");
    const menu = document.getElementById("hamburgerMenu");
    const addBtn = document.getElementById("addDetectiveBtn");
    const modal = document.getElementById("addDetectiveModal");
    const close = document.getElementById("closeAddModal");

    burger.onclick = () => {
      menu.classList.toggle("open");
    };

    addBtn.onclick = () => {
      menu.classList.remove("open");
      modal.style.display = "block";
    };

    close.onclick = () => {
      modal.style.display = "none";
    };

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
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
