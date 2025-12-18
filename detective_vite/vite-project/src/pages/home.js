export default function Home() {
  return /*html*/ `
    <div class="title-background">YOUR FAVORITE DETECTIVES</div>
    <div class="search-bar">
      <input type="text" id="searchInput" placeholder="Search detective..." />
      <button id="searchBtn">Go</button>
    </div>
    <div class="photo-list" id="modules-container"></div>
    <ul class="photo-list"></ul>
    <div id="profile-container"></div>

    <!-- POPUP / MODAL -->
    <div id="detectiveModal" class="modal">
      <div class="modal-content">
        <span id="closeModal" class="close">&times;</span>

        <img id="modalPhoto" src="" alt="" />
        <h2 id="modalName"></h2>
        <div class="modal-field">
          <span class="modal-label"><strong>Age: </strong></span>
          <span id="modalAge" class="modal-value"></span>
        </div>

        <div class="modal-field">
          <span class="modal-label"> <strong>Nationality: </strong></span>
          <span id="modalNationality" class="modal-value"></span>
        </div>

        <div class="modal-field">
          <span class="modal-label"><strong>Appearing in Media: </strong></span>
          <span id="modalMedia" class="modal-value"></span>
        </div>

        <div class="modal-field">
          <span class="modal-label"><strong>Introduction: </strong></span>
          <p id="modalIntro"></p>
        </div>

        <p id="modalIntro"></p>
        <a id="modalLink" href="/detective-detail" data-link>link</a>
      </div>
    </div>
   

  `;
}
//<script src="script.js" type="module"></script>
