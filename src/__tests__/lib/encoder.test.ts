import {
  encodeText,
  encodeURL,
  encodeEmail,
  encodePhone,
  encodeSMS,
  encodeWhatsApp,
  encodeWiFi,
  encodeVCard,
  encodeCalendar,
  encodeLocation,
  encodeCrypto,
  encodeAppStore,
  encodeQRData,
} from '@/lib/qr/encoder';

describe('QR Encoder', () => {
  describe('encodeText', () => {
    it('should return plain text as-is', () => {
      expect(encodeText({ text: 'Hello World' })).toBe('Hello World');
    });

    it('should handle special characters', () => {
      expect(encodeText({ text: 'Hello\nWorld' })).toBe('Hello\nWorld');
      expect(encodeText({ text: 'Test & "quotes"' })).toBe('Test & "quotes"');
    });
  });

  describe('encodeURL', () => {
    it('should return URL with existing protocol', () => {
      expect(encodeURL({ url: 'https://example.com' })).toBe('https://example.com');
      expect(encodeURL({ url: 'http://example.com' })).toBe('http://example.com');
    });

    it('should add https:// to URLs without protocol', () => {
      expect(encodeURL({ url: 'example.com' })).toBe('https://example.com');
    });

    it('should trim whitespace', () => {
      expect(encodeURL({ url: '  https://example.com  ' })).toBe('https://example.com');
    });
  });

  describe('encodeEmail', () => {
    it('should encode email address only', () => {
      expect(encodeEmail({ email: 'test@example.com' })).toBe('mailto:test@example.com');
    });

    it('should encode email with subject', () => {
      expect(encodeEmail({ email: 'test@example.com', subject: 'Hello' })).toBe(
        'mailto:test@example.com?subject=Hello'
      );
    });

    it('should encode email with subject and body', () => {
      const result = encodeEmail({
        email: 'test@example.com',
        subject: 'Hello',
        body: 'This is a test',
      });
      expect(result).toContain('mailto:test@example.com?');
      expect(result).toContain('subject=Hello');
      expect(result).toContain('body=This+is+a+test');
    });

    it('should handle special characters in subject and body', () => {
      const result = encodeEmail({
        email: 'test@example.com',
        subject: 'Hello & Goodbye',
        body: 'Line 1\nLine 2',
      });
      expect(result).toContain('subject=Hello+%26+Goodbye');
    });
  });

  describe('encodePhone', () => {
    it('should encode phone number with tel: prefix', () => {
      expect(encodePhone({ phone: '+1234567890' })).toBe('tel:+1234567890');
    });

    it('should strip non-digit characters except +', () => {
      expect(encodePhone({ phone: '+1 (234) 567-890' })).toBe('tel:+1234567890');
    });
  });

  describe('encodeSMS', () => {
    it('should encode SMS without message', () => {
      expect(encodeSMS({ phone: '+1234567890' })).toBe('sms:+1234567890');
    });

    it('should encode SMS with message', () => {
      expect(encodeSMS({ phone: '+1234567890', message: 'Hello' })).toBe(
        'sms:+1234567890?body=Hello'
      );
    });

    it('should encode special characters in message', () => {
      expect(encodeSMS({ phone: '+1234567890', message: 'Hello & Goodbye' })).toBe(
        'sms:+1234567890?body=Hello%20%26%20Goodbye'
      );
    });
  });

  describe('encodeWhatsApp', () => {
    it('should encode WhatsApp URL without message', () => {
      expect(encodeWhatsApp({ phone: '+1234567890' })).toBe('https://wa.me/1234567890');
    });

    it('should encode WhatsApp URL with message', () => {
      expect(encodeWhatsApp({ phone: '+1234567890', message: 'Hello' })).toBe(
        'https://wa.me/1234567890?text=Hello'
      );
    });

    it('should strip all non-digit characters from phone', () => {
      expect(encodeWhatsApp({ phone: '+1 (234) 567-890' })).toBe('https://wa.me/1234567890');
    });
  });

  describe('encodeWiFi', () => {
    it('should encode basic WiFi config', () => {
      const result = encodeWiFi({
        ssid: 'MyNetwork',
        password: 'mypassword',
        encryption: 'WPA',
      });
      expect(result).toBe('WIFI:S:MyNetwork;T:WPA;P:mypassword;;');
    });

    it('should encode WiFi without password for nopass encryption', () => {
      const result = encodeWiFi({
        ssid: 'OpenNetwork',
        encryption: 'nopass',
      });
      expect(result).toBe('WIFI:S:OpenNetwork;T:nopass;;');
    });

    it('should encode hidden network', () => {
      const result = encodeWiFi({
        ssid: 'HiddenNetwork',
        password: 'secret',
        encryption: 'WPA',
        hidden: true,
      });
      expect(result).toBe('WIFI:S:HiddenNetwork;T:WPA;P:secret;H:true;;');
    });

    it('should escape special characters in SSID and password', () => {
      const result = encodeWiFi({
        ssid: 'My;Network',
        password: 'pass;word',
        encryption: 'WPA',
      });
      expect(result).toBe('WIFI:S:My\\;Network;T:WPA;P:pass\\;word;;');
    });
  });

  describe('encodeVCard', () => {
    it('should encode minimal vCard', () => {
      const result = encodeVCard({ firstName: 'John' });
      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('VERSION:3.0');
      expect(result).toContain('N:;John;;;');
      expect(result).toContain('FN:John');
      expect(result).toContain('END:VCARD');
    });

    it('should encode full vCard', () => {
      const result = encodeVCard({
        firstName: 'John',
        lastName: 'Doe',
        organization: 'ACME Corp',
        title: 'Engineer',
        email: 'john@example.com',
        phone: '+1234567890',
        mobile: '+0987654321',
        fax: '+1111111111',
        website: 'https://example.com',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        note: 'A note',
      });
      expect(result).toContain('N:Doe;John;;;');
      expect(result).toContain('FN:John Doe');
      expect(result).toContain('ORG:ACME Corp');
      expect(result).toContain('TITLE:Engineer');
      expect(result).toContain('EMAIL:john@example.com');
      expect(result).toContain('TEL;TYPE=WORK:+1234567890');
      expect(result).toContain('TEL;TYPE=CELL:+0987654321');
      expect(result).toContain('TEL;TYPE=FAX:+1111111111');
      expect(result).toContain('URL:https://example.com');
      expect(result).toContain('ADR;TYPE=WORK:;;123 Main St;New York;NY;10001;USA');
      expect(result).toContain('NOTE:A note');
    });
  });

  describe('encodeCalendar', () => {
    it('should encode calendar event', () => {
      const result = encodeCalendar({
        title: 'Meeting',
        startDate: '2024-12-01T10:00:00',
        endDate: '2024-12-01T11:00:00',
      });
      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('VERSION:2.0');
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('SUMMARY:Meeting');
      expect(result).toContain('DTSTART:');
      expect(result).toContain('DTEND:');
      expect(result).toContain('END:VEVENT');
      expect(result).toContain('END:VCALENDAR');
    });

    it('should encode calendar event with description and location', () => {
      const result = encodeCalendar({
        title: 'Team Meeting',
        description: 'Weekly sync',
        location: 'Conference Room A',
        startDate: '2024-12-01T10:00:00',
        endDate: '2024-12-01T11:00:00',
      });
      expect(result).toContain('DESCRIPTION:Weekly sync');
      expect(result).toContain('LOCATION:Conference Room A');
    });

    it('should format all-day events correctly', () => {
      const result = encodeCalendar({
        title: 'Holiday',
        startDate: '2024-12-25T00:00:00',
        endDate: '2024-12-25T23:59:59',
        allDay: true,
      });
      // All-day format should not include time component
      expect(result).toMatch(/DTSTART:\d{8}$/m);
      expect(result).not.toContain('DTSTART:20241225T');
    });
  });

  describe('encodeLocation', () => {
    it('should encode coordinates without label', () => {
      expect(encodeLocation({ latitude: 40.7128, longitude: -74.006 })).toBe(
        'geo:40.7128,-74.006'
      );
    });

    it('should encode coordinates with label', () => {
      const result = encodeLocation({
        latitude: 40.7128,
        longitude: -74.006,
        label: 'New York City',
      });
      expect(result).toBe('geo:40.7128,-74.006?q=New%20York%20City');
    });
  });

  describe('encodeCrypto', () => {
    it('should encode Bitcoin address without amount', () => {
      expect(
        encodeCrypto({
          type: 'bitcoin',
          address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        })
      ).toBe('bitcoin:1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2');
    });

    it('should encode Bitcoin address with amount and label', () => {
      const result = encodeCrypto({
        type: 'bitcoin',
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        amount: 0.001,
        label: 'Payment',
      });
      expect(result).toContain('bitcoin:1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2?');
      expect(result).toContain('amount=0.001');
      expect(result).toContain('label=Payment');
    });

    it('should encode Ethereum address', () => {
      expect(
        encodeCrypto({
          type: 'ethereum',
          address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        })
      ).toBe('ethereum:0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    });

    it('should include message in params', () => {
      const result = encodeCrypto({
        type: 'bitcoin',
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        message: 'Thank you',
      });
      expect(result).toContain('message=Thank+you');
    });
  });

  describe('encodeAppStore', () => {
    it('should encode App Store URL only', () => {
      expect(
        encodeAppStore({
          appStoreUrl: 'https://apps.apple.com/app/example/id123',
        })
      ).toBe('https://apps.apple.com/app/example/id123');
    });

    it('should encode Play Store URL only', () => {
      expect(
        encodeAppStore({
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
        })
      ).toBe('https://play.google.com/store/apps/details?id=com.example');
    });

    it('should prioritize App Store URL when both are provided', () => {
      expect(
        encodeAppStore({
          appStoreUrl: 'https://apps.apple.com/app/example/id123',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
        })
      ).toBe('https://apps.apple.com/app/example/id123');
    });

    it('should return empty string when neither URL is provided', () => {
      expect(encodeAppStore({})).toBe('');
    });
  });

  describe('encodeQRData', () => {
    it('should dispatch to correct encoder based on type', () => {
      expect(encodeQRData({ type: 'text', data: { text: 'Hello' } })).toBe('Hello');
      expect(encodeQRData({ type: 'url', data: { url: 'example.com' } })).toBe(
        'https://example.com'
      );
      expect(encodeQRData({ type: 'email', data: { email: 'test@example.com' } })).toBe(
        'mailto:test@example.com'
      );
      expect(encodeQRData({ type: 'phone', data: { phone: '+1234567890' } })).toBe(
        'tel:+1234567890'
      );
    });

    it('should return empty string for unknown type', () => {
      expect(encodeQRData({ type: 'unknown' as any, data: {} as any })).toBe('');
    });
  });
});
