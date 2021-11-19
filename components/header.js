const headerTemplate = document.createElement('template');

// This is code that creates the header any changes to header should be made here
headerTemplate.innerHTML = `
<style>
    .navbar-custom {
        background-color: white;
    }

  </style>
  <nav class="navbar navbar-expand-lg navbar-light navbar-custom align-items-center">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="/images/Logo.png" alt="" width="40" height="40" class="d-inline-block">
        </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
          <a class="nav-link" href="#">Interest</a>
          <a class="nav-link" href="#">Skills</a>
          <a class="nav-link" href="./upload.html">Progress</a>
          <a class="nav-link" href="#">Checkin</a>
          <a class="nav-link" href="#">Chat</a>
          <a class="nav-link" href="#">FAQ/Help</a>
        </div>
      </div>
    </div>
  </nav>
`;
// constructs a class from the header styled above
class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // check if bootstrap css is linked in the document calling this header (Must link bootstrap for page to work!)
        const bootstrap = document.querySelector('link[href*="bootstrap"]')
        const bootstrapJS = document.querySelector('script[src*="bootstrap"]')
        const shadowRoot = this.attachShadow({
            mode: 'closed'
        });
        if (bootstrap) {
            shadowRoot.appendChild(bootstrap.cloneNode());
        }
        if (bootstrapJS) {
            shadowRoot.appendChild(bootstrapJS.cloneNode());
        }
        shadowRoot.appendChild(headerTemplate.content);
    }
}

customElements.define('header-component', Header);