#!/usr/bin/env node
// Build locale stubs (fr, es, pt, de, tr) from the English source.
// Critical UX strings (nav, common, home title) get hand translations baked in;
// the rest stay as English so the UI never shows raw keys.
//
// Run: node scripts/build-locale-stubs.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const enPath = path.join(root, 'messages', 'en.json');

const en = JSON.parse(await readFile(enPath, 'utf8'));

const overrides = {
  fr: {
    common: { appName: 'Générateur QR', loading: 'Chargement…', error: 'Erreur', success: 'Succès', cancel: 'Annuler', save: 'Enregistrer', delete: 'Supprimer', edit: 'Modifier', close: 'Fermer', confirm: 'Confirmer', back: 'Retour', next: 'Suivant', yes: 'Oui', no: 'Non', preview: 'Aperçu', download: 'Télécharger', upload: 'Téléverser', search: 'Rechercher', filter: 'Filtrer', clear: 'Effacer', reset: 'Réinitialiser', apply: 'Appliquer' },
    nav: { generator: 'Générateur', scanner: 'Scanner', batch: 'Par lots', templates: 'Modèles' },
    home: { title: 'Générateur de QR Code', description: 'Créez des QR codes professionnels pour URL, WiFi, contacts, e-mails et plus. Tout fonctionne dans votre navigateur.' },
    privacy: { badgeShort: '100% Navigateur', badgeLong: 'Vos données ne quittent jamais votre appareil', pageTitle: 'Confidentialité et fonctionnement' },
    meta: { homeTitle: 'Générateur de QR Code - Créez gratuitement en ligne', homeDescription: 'Créez des QR codes professionnels pour URL, WiFi, contacts. Outil 100% navigateur, aucune donnée envoyée à un serveur.' },
  },
  es: {
    common: { appName: 'Generador QR', loading: 'Cargando…', error: 'Error', success: 'Éxito', cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', edit: 'Editar', close: 'Cerrar', confirm: 'Confirmar', back: 'Atrás', next: 'Siguiente', yes: 'Sí', no: 'No', preview: 'Vista previa', download: 'Descargar', upload: 'Subir', search: 'Buscar', filter: 'Filtrar', clear: 'Limpiar', reset: 'Restablecer', apply: 'Aplicar' },
    nav: { generator: 'Generador', scanner: 'Escáner', batch: 'Por lotes', templates: 'Plantillas' },
    home: { title: 'Generador de Código QR', description: 'Crea códigos QR profesionales para URL, WiFi, contactos, correos y más. Todo funciona en tu navegador.' },
    privacy: { badgeShort: '100% Navegador', badgeLong: 'Tus datos nunca salen de tu dispositivo', pageTitle: 'Privacidad y cómo funciona' },
    meta: { homeTitle: 'Generador de Código QR - Crea gratis en línea', homeDescription: 'Crea códigos QR profesionales para URL, WiFi, contactos. Herramienta 100% navegador, sin enviar datos a servidores.' },
  },
  pt: {
    common: { appName: 'Gerador QR', loading: 'A carregar…', error: 'Erro', success: 'Sucesso', cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', edit: 'Editar', close: 'Fechar', confirm: 'Confirmar', back: 'Voltar', next: 'Próximo', yes: 'Sim', no: 'Não', preview: 'Pré-visualização', download: 'Descarregar', upload: 'Enviar', search: 'Pesquisar', filter: 'Filtrar', clear: 'Limpar', reset: 'Repor', apply: 'Aplicar' },
    nav: { generator: 'Gerador', scanner: 'Scanner', batch: 'Em lote', templates: 'Modelos' },
    home: { title: 'Gerador de Código QR', description: 'Crie códigos QR profissionais para URL, Wi-Fi, contactos, e-mails e mais. Tudo corre no seu navegador.' },
    privacy: { badgeShort: '100% Navegador', badgeLong: 'Os seus dados nunca saem do seu dispositivo', pageTitle: 'Privacidade e como funciona' },
    meta: { homeTitle: 'Gerador de Código QR - Crie online gratuitamente', homeDescription: 'Crie códigos QR profissionais para URL, Wi-Fi, contactos. Ferramenta 100% no navegador, sem envio de dados a servidores.' },
  },
  de: {
    common: { appName: 'QR-Generator', loading: 'Wird geladen…', error: 'Fehler', success: 'Erfolg', cancel: 'Abbrechen', save: 'Speichern', delete: 'Löschen', edit: 'Bearbeiten', close: 'Schließen', confirm: 'Bestätigen', back: 'Zurück', next: 'Weiter', yes: 'Ja', no: 'Nein', preview: 'Vorschau', download: 'Herunterladen', upload: 'Hochladen', search: 'Suchen', filter: 'Filtern', clear: 'Leeren', reset: 'Zurücksetzen', apply: 'Anwenden' },
    nav: { generator: 'Generator', scanner: 'Scanner', batch: 'Stapel', templates: 'Vorlagen' },
    home: { title: 'QR-Code-Generator', description: 'Erstellen Sie professionelle QR-Codes für URLs, WLAN, Kontakte, E-Mails und mehr. Alles läuft in Ihrem Browser.' },
    privacy: { badgeShort: '100% Im Browser', badgeLong: 'Ihre Daten verlassen niemals Ihr Gerät', pageTitle: 'Datenschutz und Funktionsweise' },
    meta: { homeTitle: 'QR-Code-Generator - Kostenlos online erstellen', homeDescription: 'Erstellen Sie professionelle QR-Codes für URLs, WLAN, Kontakte. 100% im Browser — keine Daten werden an Server gesendet.' },
  },
  tr: {
    common: { appName: 'QR Üreteci', loading: 'Yükleniyor…', error: 'Hata', success: 'Başarılı', cancel: 'İptal', save: 'Kaydet', delete: 'Sil', edit: 'Düzenle', close: 'Kapat', confirm: 'Onayla', back: 'Geri', next: 'İleri', yes: 'Evet', no: 'Hayır', preview: 'Önizleme', download: 'İndir', upload: 'Yükle', search: 'Ara', filter: 'Filtrele', clear: 'Temizle', reset: 'Sıfırla', apply: 'Uygula' },
    nav: { generator: 'Üretici', scanner: 'Tarayıcı', batch: 'Toplu', templates: 'Şablonlar' },
    home: { title: 'QR Kod Üreteci', description: 'URL, Wi-Fi, kişiler, e-postalar ve daha fazlası için profesyonel QR kodlar oluşturun. Tamamen tarayıcınızda çalışır.' },
    privacy: { badgeShort: '100% Tarayıcıda', badgeLong: 'Verileriniz cihazınızdan asla çıkmaz', pageTitle: 'Gizlilik ve nasıl çalışır' },
    meta: { homeTitle: 'QR Kod Üreteci - Ücretsiz çevrimiçi oluşturun', homeDescription: 'URL, Wi-Fi, kişiler için profesyonel QR kodlar oluşturun. Tamamen tarayıcıda — sunuculara veri gönderilmez.' },
  },
};

function deepMerge(target, source) {
  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    const sval = source[key];
    if (sval && typeof sval === 'object' && !Array.isArray(sval) && out[key] && typeof out[key] === 'object') {
      out[key] = deepMerge(out[key], sval);
    } else {
      out[key] = sval;
    }
  }
  return out;
}

for (const [locale, override] of Object.entries(overrides)) {
  const merged = deepMerge(en, override);
  await writeFile(path.join(root, 'messages', `${locale}.json`), JSON.stringify(merged, null, 2) + '\n');
  console.log(`wrote messages/${locale}.json`);
}
