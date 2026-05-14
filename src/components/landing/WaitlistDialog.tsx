'use client';
import React, { useEffect, useState } from 'react';
import styles from './WaitlistDialog.module.scss';

interface WaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  mobile: string;
  website: string;
  community: string;
}

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  mobile: '',
  website: '',
  community: '',
};

const WaitlistDialog: React.FC<WaitlistDialogProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset after close animation
      const t = setTimeout(() => {
        setForm(initialForm);
        setSubmitted(false);
        setSubmitting(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Simulate submission; replace with real API call later
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>

        {!submitted ? (
          <>
            <div className={styles.header}>
              <div className={styles.badge}>Private Beta</div>
              <h2 className={styles.title}>Enter the Dataroom</h2>
              <p className={styles.subtitle}>
                Tell us a little about you and your community. We&apos;ll reach out with early access details.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    className={styles.input}
                    type="text"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    className={styles.input}
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="mobile">Mobile</label>
                <input
                  id="mobile"
                  className={styles.input}
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={form.mobile}
                  onChange={handleChange('mobile')}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="website">Official Website</label>
                <input
                  id="website"
                  className={styles.input}
                  type="url"
                  placeholder="https://your-organization.com"
                  value={form.website}
                  onChange={handleChange('website')}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="community">About your community</label>
                <textarea
                  id="community"
                  className={styles.textarea}
                  placeholder="Share a brief description of your community — size, focus, goals…"
                  value={form.community}
                  onChange={handleChange('community')}
                  required
                />
              </div>

              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.thankYou}>
            <div className={styles.checkIcon}>✓</div>
            <h2 className={styles.thankTitle}>Thank you!</h2>
            <p className={styles.thankText}>
              We&apos;ve received your details and will contact you shortly with next steps.
            </p>
            <button className={styles.submit} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistDialog;
