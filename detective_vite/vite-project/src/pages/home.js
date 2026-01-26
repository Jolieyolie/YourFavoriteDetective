export default function Home() {
  return /*html*/ `
    <div class="title-background">YOUR FAVORITE DETECTIVES</div>
    
    <div class="search-bar">
      <input type="text" id="searchInput" placeholder="Search detective..." />
      <button id="searchBtn">Go</button>
    </div>

    <div id="modules-container"></div>
    <ul class="photo-list"></ul>
    <div id="profile-container"></div>

    <!-- POPUP / MODAL -->
    <div id="detectiveModal" class="modal add-detective-backdrop">
      <div class="add-detective-panel">
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

      
        <a id="modalLink" href="/detective-detail" data-link>link</a>
      </div>
    </div>
   
<!-- ADD DETECTIVE MODAL -->
    <div id="addDetectiveModal" class="modal add-detective-backdrop">
      <div class="add-detective-panel">
        <span id="closeAddModal" class="close">&times;</span>

        <h2>Add Detective</h2>

        <form id="addDetectiveForm">
          <input name="name" placeholder="Name" required />
          <input name="age" type="text" placeholder="Age" required />
          <input name="nationality" placeholder="Nationality" />
          <input name="appearingInMedia" placeholder="Appearing In Media" />
          <textarea name="introduction" placeholder="Introduction"></textarea>
          <input name="photoUrl" placeholder="Photo URL (optional)" />

          <button type="submit">＋ Create</button>
        </form>
      </div>
    </div>

    <!-- HAMBURGER -->
    <div class="hamburger-wrapper">
      <button id="hamburger" class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div id="hamburgerMenu" class="hamburger-menu">
        <button id="addDetectiveBtn">＋ Add Detective</button>
      </div>
    </div>
  `;
}
//<script src="script.js" type="module"></script>
