const primaryNavItems = [
  { id: "tamil", label: "Tamil", href: "tamil.html" },
  { id: "hindi", label: "Hindi", href: "hindi.html" },
  { id: "telugu", label: "Telugu", href: "telugu.html" },
  { id: "kannada", label: "Kannada", href: "kannada.html" },
  { id: "malayalam", label: "Malayalam", href: "malayalam.html" },
  { id: "marathi", label: "Marathi", href: "marathi.html" },
  { id: "punjabi", label: "Punjabi", href: "punjabi.html" },
  { id: "air", label: "AIR", href: "air.html" },
  { id: "favorites", label: "Favorites", href: "favorites.html" }
];
const primaryNavItems1 = [
  { id: "privacy", label: "Privacy Policy", href: "privacy-policy.html" },  
  { id: "contact", label: "Contact Us", href: "contact-us.html" },
   { id: "submit", label: "Submit Radio", href: "submit-radio.html" }
];
const footerNavItems = [
  {
    id: "home",
    label: "Home",
    href: "index.html",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5.2a.5.5 0 0 1-.5-.5v-5.2H9.2v5.2a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-9.7Z"></path>
      </svg>
    `
  },
  {
    id: "favorites",
    label: "Favorites",
    href: "favorites.html",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7.6-4.7-9.5-10.2C1.2 7 3.6 4 7.1 4c2 0 3.7 1.1 4.9 2.8C13.2 5.1 14.9 4 16.9 4c3.5 0 5.9 3 4.6 6.8C19.6 16.3 12 21 12 21Z"></path>
      </svg>
    `
  }
];

const currentPage = document.body.dataset.page || "home";

const renderNavLinks = (items) =>
  items
    .map(
      (item) =>
        `<a href="${item.href}"${item.id === currentPage ? ' class="is-active"' : ""}>${item.label}</a>`
    )
    .join("");

const renderFooterLinks = (items) =>
  items
    .map((item) => {
      const activeClass = item.id === currentPage ? " is-active" : "";
      const ariaCurrent = item.id === currentPage ? ' aria-current="page"' : "";

      return `
        <a class="bottom-nav-link${activeClass}" href="${item.href}"${ariaCurrent}>
          <span class="bottom-nav-icon">${item.icon}</span>
          <span class="bottom-nav-label">${item.label}</span>
        </a>
      `;
    })
    .join("");

const headerMarkup = `
  <header class="site-header">
    <div class="brand-row">
      <a class="brand" href="index.html" aria-label="Radio Star home">
        <img class="brand-logo" src="images/radio-star-logo.svg" alt="Tamil Radios logo">
        <span class="brand-text">Tamil Radios</span>
      </a>
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
      ${renderNavLinks(primaryNavItems1)}
    </nav>
  </header>
`;

const footerMarkup = `
  <footer class="site-footer">
    <nav class="bottom-nav" aria-label="Bottom navigation">
      ${renderFooterLinks(footerNavItems)}
    </nav>
  </footer>
`;

document.querySelectorAll('[data-include="header"]').forEach((node) => {
  node.outerHTML = headerMarkup;
});

document.querySelectorAll('[data-include="footer"]').forEach((node) => {
  node.outerHTML = footerMarkup;
});

const toggleButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (toggleButton && siteNav) {
  toggleButton.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });
}
