import "./styles/footer.css";

const socialLinks = [
  {
    href: "https://zaksshowroom.vercel.app",
    label: "Portfolio",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7.5A2.5 2.5 0 0 1 9.5 5h5A2.5 2.5 0 0 1 17 7.5v9A2.5 2.5 0 0 1 14.5 19h-5A2.5 2.5 0 0 1 7 16.5z" />
        <path d="M9 9h6M9 12h6M9 15h3.5" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/redled.fx/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.05" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/zakaria-hammoudi/",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10.5v6M8 7.5v.01M11.5 16.5v-3.2c0-1.3.9-2.3 2.2-2.3s2.1 1 2.1 2.3v3.2M11.5 10.5v-1.7" />
      </svg>
    ),
  },
  {
    href: "https://github.com/Zakaria-Ham",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 19c-4.5 1.4-4.5-2.2-6-2.6M15 21v-3.2c0-1.1-.2-1.7-1-2.5 3.2-.4 6.5-1.6 6.5-7a5.4 5.4 0 0 0-1.5-3.7A5 5 0 0 0 19 2.5S17.8 2 15.9 3.4a13.7 13.7 0 0 0-7.8 0C6.2 2 5 2.5 5 2.5a5 5 0 0 0-.2 3.6A5.4 5.4 0 0 0 3.4 9.5c0 5.4 3.3 6.6 6.5 7-.8.8-1 1.6-1 2.5V21" />
      </svg>
    ),
  },
  {
    href: "mailto:contact.zakariaham@gmail.com",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="m5 7 7 6 7-6" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bar">
        <div className="footer-left">
          <span className="footer-tag">Let`s connect</span>
          <span className="copyright-badge">© No Copyright</span>
        </div>

        <div className="social-links" aria-label="Social media links">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              className="social-link"
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
