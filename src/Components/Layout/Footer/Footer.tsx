import tdFooter from "@/Images/td-footer.png";
import "@/Styles/Footer.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/data/site";

export const Footer = () => {
  const { t } = useTranslation("common");

  const { contact } = siteConfig;
  const phoneDisplay = contact.phone || contact.phoneHref || "";
  const phoneHref = contact.phoneHref || contact.phone;
  const email = contact.email;
  const addressLines = contact.addressLines || [];
  const workingHours = contact.workingHours || {};

  const brandName = siteConfig.brand.name;
  const serviceLinks = [
    { to: "/hizmetlerimiz/sosyal-medya-yonetimi", label: t("services.social") },
    { to: "/hizmetlerimiz/gorsel-hizmetler", label: t("services.drone") },
    { to: "/hizmetlerimiz/sanal-tur", label: t("services.virtualTour") },
    { to: "/hizmetlerimiz/reklam-yonetimi", label: t("services.ads") },
    { to: "/hizmetlerimiz/uzman-danismanlik", label: t("services.consulting") },
  ];

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/hizmetlerimiz", label: t("nav.services") },
    { to: "/hakkimizda", label: t("nav.about") },
    { to: "/iletisim", label: t("nav.contact") },
  ];

  return (
    <footer className="footer-v2">
      <div className="footer-top py-5">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex flex-row gap-8 justify-between">
            <div className="w-1/4">
              <div className="footer-widget footer-about">
                <div className="footer-logo mb-4">
                  <img
                    src={tdFooter}
                    alt="Logo"
                    className="img-fluid"
                    height="45"
                  />
                </div>
                <p className="footer-desc mb-4">{t("footer.aboutText")}</p>
                <div className="footer-social-icons"></div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0 lg:col-span-2">
              <div className="footer-widget">
                <h4 className="footer-widget-title">{t("footer.quick")}</h4>
                <ul className="footer-links">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to}>
                        <i className="fas fa-chevron-right"></i>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0 lg:col-span-3">
              <div className="footer-widget">
                <h4 className="footer-widget-title">{t("footer.services")}</h4>
                <ul className="footer-links">
                  {serviceLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to}>
                        <i className="fas fa-chevron-right"></i>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-1/4">
              <div className="footer-widget">
                <h4 className="footer-widget-title">
                  {t("footer.contactInfo")}
                </h4>
                <ul className="footer-contact-info">
                  <li>
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">
                      {addressLines.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                  </li>
                  <li>
                    <div className="contact-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="contact-text">
                      <a href={`tel:${phoneHref}`}>{phoneDisplay}</a>
                    </div>
                  </li>
                  <li>
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-text">
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  </li>
                  <li>
                    <div className="contact-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-text space-y-1">
                      <div>
                        {t("map.weekLabel", { defaultValue: "Hafta ici" })}:{" "}
                        {workingHours.week || ""}
                      </div>
                      <div>
                        {t("map.satLabel", { defaultValue: "Cumartesi" })}:{" "}
                        {workingHours.saturday || ""}
                      </div>
                      <div>
                        {t("map.sunLabel", { defaultValue: "Pazar" })}:{" "}
                        {workingHours.sunday || ""}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container mx-auto max-w-[1200px]">
          <div className="row align-items-center flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="col-lg-6 col-md-6">
              <div className="copyright-text">
                <p>
                  © 2025 {t("footer.rights")}{" "}
                  <span className="text-primary fw-bold">Vehbi Taha Edis</span>{" "}
                  {t("footer.by", { name: brandName })}
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="footer-bottom-links text-start md:text-end">
                <Link to="/gizlilik">{t("footer.privacy")}</Link>
                <Link to="/kosullar">{t("footer.terms")}</Link>
                <Link to="/kvkk">{t("footer.kvkk")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
