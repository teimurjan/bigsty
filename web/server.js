const { readFileSync } = require('fs');
const { createServer } = require('http');
const { basename } = require('path');
const { parse } = require('url');

const cookie = require('cookie');
const glob = require('glob');
const IntlPolyfill = require('intl');
const next = require('next');

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const supportedLanguages = glob.sync('./lang/*.json').map(f => basename(f, '.json'));

const localeDataCache = new Map();
const getLocaleDataScript = locale => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`);
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

const getMessages = locale => {
  return require(`./lang/${locale}.json`);
};

app.prepare().then(() => {
  createServer((req, res) => {
    const locale = cookie.parse(req.headers.cookie || '').locale || 'ru';
    req.locale = supportedLanguages.some(l => l === locale) ? locale : 'ru';
    req.localeDataScript = getLocaleDataScript(locale);
    req.messages = getMessages(locale);

    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname.startsWith('/admin')) {
      app.render(req, res, '/admin', query);
    } else if (pathname.startsWith('/profile')) {
      app.render(req, res, '/profile', query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
