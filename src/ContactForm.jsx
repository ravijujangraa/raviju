import React, { useState } from "react";
import { contactFormCopy as text } from "./contactFormData";

// CONTACT ME FORM: labels/copy src/contactFormData.js mein; delivery endpoint /api/contact hai.
export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");

  async function submitMessage(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") || "").trim(),
      email: String(values.get("email") || "").trim(),
      message: String(values.get("message") || "").trim(),
      website: String(values.get("website") || ""),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setNotice(text.whitespaceError);
      return;
    }

    setStatus("sending");
    setNotice("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || text.failed);
      form.reset();
      setStatus("success");
      setNotice(text.success);
    } catch (error) {
      setStatus("error");
      setNotice(error.message || text.failed);
    }
  }

  return (
    <form
      className="contact-form"
      aria-labelledby="contact-form-title"
      aria-describedby="contact-form-help"
      onSubmit={submitMessage}
    >
      <h3 id="contact-form-title">{text.heading}</h3>
      <p className="form-intro">{text.intro}</p>
      <div className="contact-form-fields">
        <div className="contact-field">
          <label htmlFor="contact-name">{text.name}</label>
          <input id="contact-name" name="name" autoComplete="name" placeholder={text.namePlaceholder} required maxLength={100} />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">{text.email}</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder={text.emailPlaceholder} required maxLength={254} />
        </div>
        <div className="contact-field message-field">
          <label htmlFor="contact-message">{text.message}</label>
          <textarea id="contact-message" name="message" rows={3} placeholder={text.messagePlaceholder} required maxLength={2000} />
        </div>
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <button className="button contact-send" type="submit" disabled={status === "sending"}>
        {status === "sending" ? text.sending : text.submit}
        <span aria-hidden="true">↗</span>
      </button>
      <p
        id="contact-form-help"
        className={`contact-form-help${status === "error" ? " is-error" : ""}${status === "success" ? " is-success" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice || text.hint}
      </p>
    </form>
  );
}
