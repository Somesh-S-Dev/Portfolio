import { Injectable } from '@angular/core';
import { ContactSession } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private emailjsLoaded = false;

  loadEmailJS(publicKey: string): Promise<void> {
    if (this.emailjsLoaded) return Promise.resolve();
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = () => {
        (window as any).emailjs.init({ publicKey });
        this.emailjsLoaded = true;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  async sendEmail(
    serviceId: string,
    templateId: string,
    session: ContactSession,
    message: string
  ): Promise<void> {
    const emailjs = (window as any).emailjs;
    if (!emailjs) throw new Error('EmailJS not loaded');

    await emailjs.send(serviceId, templateId, {
      from_name: session.name,
      from_email: session.email,
      from_phone: session.phone,
      from_linkedin: session.linkedin,
      message,
      to_name: 'Portfolio Owner',
    });
  }
}
