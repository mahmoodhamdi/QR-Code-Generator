import {
  sanitizeText,
  textSchema,
  urlSchema,
  emailSchema,
  phoneSchema,
  smsSchema,
  whatsappSchema,
  wifiSchema,
  vcardSchema,
  calendarSchema,
  locationSchema,
  cryptoSchema,
  appStoreSchema,
} from '@/lib/validations';

describe('Validation Utilities', () => {
  describe('sanitizeText', () => {
    it('should remove HTML tags from text', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeText('<p>Hello</p>')).toBe('Hello');
      expect(sanitizeText('<b>Bold</b> and <i>italic</i>')).toBe('Bold and italic');
    });

    it('should trim whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello');
      expect(sanitizeText('\n\thello\t\n')).toBe('hello');
    });

    it('should handle text without HTML', () => {
      expect(sanitizeText('Normal text')).toBe('Normal text');
    });

    it('should handle empty string', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('textSchema', () => {
    it('should validate valid text', () => {
      const result = textSchema.safeParse({ text: 'Hello World' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.text).toBe('Hello World');
      }
    });

    it('should reject empty text', () => {
      const result = textSchema.safeParse({ text: '' });
      expect(result.success).toBe(false);
    });

    it('should reject text exceeding max length', () => {
      const longText = 'a'.repeat(5001);
      const result = textSchema.safeParse({ text: longText });
      expect(result.success).toBe(false);
    });

    it('should sanitize HTML in text', () => {
      const result = textSchema.safeParse({ text: '<script>test</script>' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.text).toBe('test');
      }
    });
  });

  describe('urlSchema', () => {
    it('should validate valid HTTP URLs', () => {
      const result = urlSchema.safeParse({ url: 'https://example.com' });
      expect(result.success).toBe(true);
    });

    it('should validate URLs without protocol by prefixing https', () => {
      const result = urlSchema.safeParse({ url: 'example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject empty URL', () => {
      const result = urlSchema.safeParse({ url: '' });
      expect(result.success).toBe(false);
    });

    it('should reject javascript: URLs', () => {
      const result = urlSchema.safeParse({ url: 'javascript:alert(1)' });
      expect(result.success).toBe(false);
    });

    it('should reject data: URLs', () => {
      const result = urlSchema.safeParse({ url: 'data:text/html,<script>alert(1)</script>' });
      expect(result.success).toBe(false);
    });

    it('should reject URLs exceeding max length', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(3000);
      const result = urlSchema.safeParse({ url: longUrl });
      expect(result.success).toBe(false);
    });
  });

  describe('emailSchema', () => {
    it('should validate valid email with all fields', () => {
      const result = emailSchema.safeParse({
        email: 'test@example.com',
        subject: 'Hello',
        body: 'This is a test',
      });
      expect(result.success).toBe(true);
    });

    it('should validate email without optional fields', () => {
      const result = emailSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = emailSchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = emailSchema.safeParse({ email: '' });
      expect(result.success).toBe(false);
    });

    it('should sanitize subject and body', () => {
      const result = emailSchema.safeParse({
        email: 'test@example.com',
        subject: '<script>XSS</script>',
        body: '<b>Bold</b> text',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.subject).toBe('XSS');
        expect(result.data.body).toBe('Bold text');
      }
    });
  });

  describe('phoneSchema', () => {
    it('should validate valid international phone numbers', () => {
      expect(phoneSchema.safeParse({ phone: '+1234567890' }).success).toBe(true);
      expect(phoneSchema.safeParse({ phone: '+442071234567' }).success).toBe(true);
      expect(phoneSchema.safeParse({ phone: '1234567890' }).success).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(phoneSchema.safeParse({ phone: '' }).success).toBe(false);
      expect(phoneSchema.safeParse({ phone: 'abc123' }).success).toBe(false);
      expect(phoneSchema.safeParse({ phone: '+0123456789' }).success).toBe(false); // starts with 0
    });
  });

  describe('smsSchema', () => {
    it('should validate SMS with phone and message', () => {
      const result = smsSchema.safeParse({
        phone: '+1234567890',
        message: 'Hello!',
      });
      expect(result.success).toBe(true);
    });

    it('should validate SMS with only phone', () => {
      const result = smsSchema.safeParse({ phone: '+1234567890' });
      expect(result.success).toBe(true);
    });

    it('should reject message exceeding 160 characters', () => {
      const result = smsSchema.safeParse({
        phone: '+1234567890',
        message: 'a'.repeat(161),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('whatsappSchema', () => {
    it('should validate WhatsApp with phone and message', () => {
      const result = whatsappSchema.safeParse({
        phone: '+1234567890',
        message: 'Hello from WhatsApp!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject message exceeding 1000 characters', () => {
      const result = whatsappSchema.safeParse({
        phone: '+1234567890',
        message: 'a'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('wifiSchema', () => {
    it('should validate valid WiFi configuration', () => {
      const result = wifiSchema.safeParse({
        ssid: 'MyNetwork',
        password: 'mypassword',
        encryption: 'WPA',
        hidden: false,
      });
      expect(result.success).toBe(true);
    });

    it('should validate WiFi without password (nopass)', () => {
      const result = wifiSchema.safeParse({
        ssid: 'OpenNetwork',
        encryption: 'nopass',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty SSID', () => {
      const result = wifiSchema.safeParse({
        ssid: '',
        encryption: 'WPA',
      });
      expect(result.success).toBe(false);
    });

    it('should reject SSID exceeding 32 characters', () => {
      const result = wifiSchema.safeParse({
        ssid: 'a'.repeat(33),
        encryption: 'WPA',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password exceeding 63 characters', () => {
      const result = wifiSchema.safeParse({
        ssid: 'Network',
        password: 'a'.repeat(64),
        encryption: 'WPA',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('vcardSchema', () => {
    it('should validate valid vCard with all fields', () => {
      const result = vcardSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        organization: 'ACME Corp',
        title: 'Engineer',
        email: 'john@example.com',
        phone: '+1234567890',
        mobile: '+0987654321',
        website: 'https://example.com',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        note: 'A note',
      });
      expect(result.success).toBe(true);
    });

    it('should validate vCard with only first name', () => {
      const result = vcardSchema.safeParse({ firstName: 'John' });
      expect(result.success).toBe(true);
    });

    it('should reject empty first name', () => {
      const result = vcardSchema.safeParse({ firstName: '' });
      expect(result.success).toBe(false);
    });

    it('should sanitize text fields', () => {
      const result = vcardSchema.safeParse({
        firstName: '<b>John</b>',
        lastName: '<script>Doe</script>',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
      }
    });
  });

  describe('calendarSchema', () => {
    const validDates = {
      startDate: '2024-12-01T10:00',
      endDate: '2024-12-01T11:00',
    };

    it('should validate valid calendar event', () => {
      const result = calendarSchema.safeParse({
        title: 'Meeting',
        description: 'Team meeting',
        location: 'Conference Room',
        ...validDates,
        allDay: false,
      });
      expect(result.success).toBe(true);
    });

    it('should validate calendar event with only required fields', () => {
      const result = calendarSchema.safeParse({
        title: 'Meeting',
        ...validDates,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = calendarSchema.safeParse({
        title: '',
        ...validDates,
      });
      expect(result.success).toBe(false);
    });

    it('should reject end date before start date', () => {
      const result = calendarSchema.safeParse({
        title: 'Meeting',
        startDate: '2024-12-01T11:00',
        endDate: '2024-12-01T10:00',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('locationSchema', () => {
    it('should validate valid coordinates', () => {
      const result = locationSchema.safeParse({
        latitude: 40.7128,
        longitude: -74.006,
        label: 'New York City',
      });
      expect(result.success).toBe(true);
    });

    it('should validate coordinates without label', () => {
      const result = locationSchema.safeParse({
        latitude: 0,
        longitude: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid latitude', () => {
      expect(
        locationSchema.safeParse({ latitude: 91, longitude: 0 }).success
      ).toBe(false);
      expect(
        locationSchema.safeParse({ latitude: -91, longitude: 0 }).success
      ).toBe(false);
    });

    it('should reject invalid longitude', () => {
      expect(
        locationSchema.safeParse({ latitude: 0, longitude: 181 }).success
      ).toBe(false);
      expect(
        locationSchema.safeParse({ latitude: 0, longitude: -181 }).success
      ).toBe(false);
    });
  });

  describe('cryptoSchema', () => {
    it('should validate valid Bitcoin address', () => {
      const result = cryptoSchema.safeParse({
        type: 'bitcoin',
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        amount: 0.001,
        label: 'Payment',
      });
      expect(result.success).toBe(true);
    });

    it('should validate valid Ethereum address', () => {
      const result = cryptoSchema.safeParse({
        type: 'ethereum',
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: 0.1,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid Bitcoin address', () => {
      const result = cryptoSchema.safeParse({
        type: 'bitcoin',
        address: 'invalid-address',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid Ethereum address', () => {
      const result = cryptoSchema.safeParse({
        type: 'ethereum',
        address: 'invalid-address',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty address', () => {
      const result = cryptoSchema.safeParse({
        type: 'bitcoin',
        address: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('appStoreSchema', () => {
    it('should validate valid Apple App Store URL', () => {
      const result = appStoreSchema.safeParse({
        appStoreUrl: 'https://apps.apple.com/app/example/id123456789',
      });
      expect(result.success).toBe(true);
    });

    it('should validate valid Google Play Store URL', () => {
      const result = appStoreSchema.safeParse({
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
      });
      expect(result.success).toBe(true);
    });

    it('should validate both store URLs', () => {
      const result = appStoreSchema.safeParse({
        appStoreUrl: 'https://apps.apple.com/app/example/id123456789',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
      });
      expect(result.success).toBe(true);
    });

    it('should reject if no URL provided', () => {
      const result = appStoreSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject invalid App Store URL', () => {
      const result = appStoreSchema.safeParse({
        appStoreUrl: 'https://example.com/app',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid Play Store URL', () => {
      const result = appStoreSchema.safeParse({
        playStoreUrl: 'https://example.com/app',
      });
      expect(result.success).toBe(false);
    });
  });
});
