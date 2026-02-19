import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from '../../services/cookie.service';
import { ContactService } from '../../services/contact.service';
import { DataService } from '../../services/data.service';
import { ContactSession, ContactMessage, Profile } from '../../models/portfolio.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  private cookieService = inject(CookieService);
  private contactService = inject(ContactService);
  private dataService = inject(DataService);

  profile = signal<Profile | null>(null);
  session = signal<ContactSession | null>(null);
  messages = signal<ContactMessage[]>([]);
  newMessage = '';
  isSending = signal(false);
  isSessionMode = signal(false);

  // Form fields for new session
  form = { name: '', email: '', phone: '', linkedin: '' };

  ngOnInit() {
    this.dataService.getProfile().subscribe(p => {
      this.profile.set(p);
      this.contactService.loadEmailJS(p.emailjsPublicKey).catch(() => {});
    });

    const saved = this.cookieService.getSession();
    if (saved) {
      this.session.set(saved);
      this.isSessionMode.set(true);
    }
  }

  saveSession() {
    if (!this.form.name || !this.form.email) return;
    const s: ContactSession = { ...this.form };
    this.cookieService.saveSession(s);
    this.session.set(s);
    this.isSessionMode.set(true);
    this.loadLinkedInAvatar(s.linkedin);
  }

  async loadLinkedInAvatar(linkedinUrl: string) {
    // LinkedIn doesn't allow direct avatar fetch — we use a fallback initials approach
  }

  clearSession() {
    this.cookieService.clearSession();
    this.session.set(null);
    this.isSessionMode.set(false);
    this.form = { name: '', email: '', phone: '', linkedin: '' };
  }

  async sendMessage() {
    const p = this.profile();
    const s = this.session();
    if (!this.newMessage.trim() || !p || !s || this.isSending()) return;

    const id = Date.now().toString();
    const msg: ContactMessage = {
      id,
      message: this.newMessage.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    this.messages.update(msgs => [...msgs, msg]);
    const text = this.newMessage.trim();
    this.newMessage = '';
    this.isSending.set(true);

    try {
      await this.contactService.sendEmail(p.emailjsServiceId, p.emailjsTemplateId, s, text);
      this.updateMessageStatus(id, 'sent');
    } catch {
      this.updateMessageStatus(id, 'error');
    } finally {
      this.isSending.set(false);
    }
  }

  private updateMessageStatus(id: string, status: ContactMessage['status']) {
    this.messages.update(msgs => msgs.map(m => m.id === id ? { ...m, status } : m));
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
}
