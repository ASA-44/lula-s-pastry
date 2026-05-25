import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="contact-footer">
      <div className="contact-footer-inner">
        <h2>Contact Us</h2>
        <p>Have a question or want a custom order? We&apos;d love to hear from you.</p>

        <div className="contact-footer-details" aria-label="Contact details">
          <a href="tel:+96170493168">
            <Phone size={18} />
            <span>Phone: +961 70 493168</span>
          </a>
          <a href="mailto:info@lulaspastry.com">
            <Mail size={18} />
            <span>Email: info@lulaspastry.com</span>
          </a>
          <span>
            <MapPin size={18} />
            <span>Location: Bekaa, Lebanon LB</span>
          </span>
        </div>

        <a href="https://www.instagram.com/lula_pastry/" className="instagram-link">
          <span className="instagram-mark" aria-hidden="true">
            @
          </span>
          <span>Visit Our Instagram (@lula_pastry)</span>
        </a>
      </div>
    </footer>
  );
}
