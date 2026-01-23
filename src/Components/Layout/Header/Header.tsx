import { useEffect, useMemo, useRef, useState } from "react";
import "@/Styles/Header.css";
import logo from "@/Images/td-header.png";
import { Link, useLocation } from "react-router";
import { LanguageSwitcher } from "@/Components/I18n/LanguageSwitcher";
import { useTranslation } from "react-i18next";

type MegaMenu = {
  title: string;
  subtitle: string;
  items: Array<{ icon: string; title: string; desc: string; href: string }>;
  footer: { label: string; href: string };
};

type NavLink = {
  label: string;
  to: string;
  icon?: string;
  children?: NavLink[];
  external?: boolean;
  mega?: MegaMenu;
};

const SCROLL_THRESHOLD = 60;

export const Header = () => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const servicesMega = useMemo<MegaMenu>(
    () => ({
      title: t("servicesDropdown.title", {
        defaultValue: "Dijital Pazarlama Hizmetleri",
      }),
      subtitle: t("servicesDropdown.subtitle", {
        defaultValue: "%150 büyüme garantili dijital çözümler",
      }),
      items: [
        {
          icon: "fas fa-share-alt",
          title: t("services.social", { defaultValue: "Sosyal Medya Yönetimi" }),
          desc: t("servicesDropdown.descriptions.social", {
            defaultValue: "%150 büyüme garantili paketler",
          }),
          href: "/hizmetlerimiz/sosyal-medya-yonetimi",
        },
        {
          icon: "fas fa-camera",
          title: t("services.drone", { defaultValue: "Görsel Hizmetler" }),
          desc: t("servicesDropdown.descriptions.visual", {
            defaultValue: "Drone çekimi, fotoğraf, video prodüksiyon",
          }),
          href: "/hizmetlerimiz/gorsel-hizmetler",
        },
        {
          icon: "fas fa-vr-cardboard",
          title: t("services.virtualTour", {
            defaultValue: "Sanal Tur Hizmetleri",
          }),
          desc: t("servicesDropdown.descriptions.virtualTour", {
            defaultValue: "360° sanal turlar ve Google entegrasyonu",
          }),
          href: "/hizmetlerimiz/sanal-tur",
        },
        {
          icon: "fas fa-bullhorn",
          title: t("services.ads", { defaultValue: "Reklam Yönetimi" }),
          desc: t("servicesDropdown.descriptions.ads", {
            defaultValue: "Meta Ads ve Google Ads yönetimi",
          }),
          href: "/hizmetlerimiz/reklam-yonetimi",
        },
        {
          icon: "fas fa-lightbulb",
          title: t("services.consulting", { defaultValue: "Uzman Danışmanlık" }),
          desc: t("servicesDropdown.descriptions.consulting", {
            defaultValue: "Influencer pazarlama ve strateji danışmanlığı",
          }),
          href: "/hizmetlerimiz/uzman-danismanlik",
        },
      ],
      footer: {
        label: t("actions.viewAllServices", {
          defaultValue: "Tüm Hizmetleri Görüntüle",
        }),
        href: "/hizmetlerimiz",
      },
    }),
    [t]
  );

  const desktopLinks = useMemo<NavLink[]>(
    () => [
      { label: t("nav.home"), to: "/" },
      { label: t("nav.services"), to: "/hizmetlerimiz", mega: servicesMega },
      {
        label: t("nav.about"),
        to: "/hakkimizda",
        children: [
          { label: t("nav.about"), to: "/hakkimizda" },
          { label: t("nav.references"), to: "/referanslar" },
        ],
      },
      { label: t("nav.products"), to: "/urunler" },
      { label: t("nav.contact"), to: "/iletisim" },
    ],
    [servicesMega, t]
  );

  const mobileLinks = useMemo<NavLink[]>(() => {
    const base: NavLink[] = [
      { label: t("nav.home"), to: "/", icon: "fas fa-home" },
      {
        label: t("nav.services"),
        to: "/hizmetlerimiz",
        icon: "fas fa-cogs",
        mega: servicesMega,
      },
      {
        label: t("nav.about"),
        to: "/hakkimizda",
        icon: "fas fa-users",
        children: [
          { label: t("nav.about"), to: "/hakkimizda" },
          { label: t("nav.references"), to: "/referanslar" },
        ],
      },
      { label: t("nav.products"), to: "/urunler", icon: "fas fa-box-open" },
      { label: t("nav.contact"), to: "/iletisim", icon: "fas fa-phone" },
    ];
    return base;
  }, [servicesMega, t]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!mobileOpen) return;
      const menu = mobileMenuRef.current;
      const toggle = mobileToggleRef.current;
      if (!menu || !toggle) return;
      if (
        menu.contains(event.target as Node) ||
        toggle.contains(event.target as Node)
      )
        return;
      setMobileOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("mobile-menu-open", mobileOpen);
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className={`modern-header${scrolled ? " scrolled" : ""}`}
    >
      <div className="header-container">
        <nav className="main-navbar">
          <div className="navbar-content">
            <div className="navbar-brand-section">
              <Link className="brand-logo" to="/">
                <img
                  className="brand-logo-img"
                  src={logo}
                  alt="Taşo Digital"
                />
              </Link>
            </div>

            <div className="desktop-menu">
              <ul className="nav-list">
                {desktopLinks.map((link) => (
                  <li
                    key={link.label}
                    className={`nav-item${
                      activeDropdown === link.label ? " open" : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveDropdown(link.mega || link.children ? link.label : null)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.mega ? (
                      <>
                        <button className="nav-link dropdown-link" type="button">
                          {link.label}
                          <i className="fas fa-chevron-down dropdown-icon"></i>
                        </button>
                        <div
                          className={`mega-dropdown${
                            activeDropdown === link.label ? " active" : ""
                          }`}
                        >
                          <div className="dropdown-container">
                            <div className="dropdown-header">
                              <h3>{link.mega.title}</h3>
                              <p>{link.mega.subtitle}</p>
                            </div>
                            <div className="services-grid">
                              {link.mega.items.map((item) => (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  className="service-item"
                                >
                                  <span className="service-icon">
                                    <i className={item.icon}></i>
                                  </span>
                                  <div className="service-content">
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="dropdown-footer">
                              <Link className="view-all-btn" to={link.mega.footer.href}>
                                <span>{link.mega.footer.label}</span>
                                <i className="fas fa-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : link.children?.length ? (
                      <>
                        <button className="nav-link dropdown-link" type="button">
                          {link.label}
                          <i className="fas fa-chevron-down dropdown-icon"></i>
                        </button>
                        <div
                          className={`simple-dropdown${
                            activeDropdown === link.label ? " active" : ""
                          }`}
                        >
                          {link.children.map((child) => (
                            <Link key={child.to} to={child.to} className="dropdown-item">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : link.external ? (
                      <a
                        className={`nav-link${
                          location.pathname === link.to ? " active" : ""
                        }`}
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        className={`nav-link${
                          location.pathname === link.to ? " active" : ""
                        }`}
                        to={link.to}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="navbar-actions">
              <LanguageSwitcher className="header-lang" />
              <button
                className={`mobile-toggle${mobileOpen ? " active" : ""}`}
                ref={mobileToggleRef}
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Menüyü aç/kapat"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </nav>

        <div className={`mobile-menu${mobileOpen ? " active" : ""}`} ref={mobileMenuRef}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <LanguageSwitcher className="header-lang" />
            </div>
            <nav className="mobile-nav">
              {mobileLinks.map((link) =>
                link.mega ? (
                  <div
                    key={link.label}
                    className={`mobile-dropdown${
                      mobileDropdown === link.label ? " open" : ""
                    }`}
                  >
                    <button
                      className="mobile-nav-item dropdown-toggle"
                      type="button"
                      onClick={() =>
                        setMobileDropdown((prev) =>
                          prev === link.label ? null : link.label
                        )
                      }
                    >
                      <i className={link.icon ?? "fas fa-cogs"}></i>
                      {link.label}
                      <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className="mobile-dropdown-content">
                      {link.mega.items.map((item) => (
                        <Link key={item.href} to={item.href}>
                          {item.title}
                        </Link>
                      ))}
                      <Link to={link.mega.footer.href} className="view-all-btn">
                        <span>{link.mega.footer.label}</span>
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                ) : link.children?.length ? (
                  <div
                    key={link.label}
                    className={`mobile-dropdown${
                      mobileDropdown === link.label ? " open" : ""
                    }`}
                  >
                    <button
                      className="mobile-nav-item dropdown-toggle"
                      type="button"
                      onClick={() =>
                        setMobileDropdown((prev) =>
                          prev === link.label ? null : link.label
                        )
                      }
                    >
                      <i className={link.icon ?? "fas fa-layer-group"}></i>
                      {link.label}
                      <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className="mobile-dropdown-content">
                      {link.children.map((child) => (
                        <Link key={child.to} to={child.to}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : link.external ? (
                  <a key={link.label} href={link.to} className="mobile-nav-item">
                    <i className={link.icon ?? "fas fa-external-link-alt"}></i>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.to} className="mobile-nav-item">
                    <i className={link.icon ?? "fas fa-circle"}></i>
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
