const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'img');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgs = {
  'audio-placeholder.svg': { icon: '🎵', title: 'Sonido Vivo', color: '#1e90ff' },
  'ath-m50x.svg': { icon: '🎧', title: 'ATH-M50x', color: '#38bdf8' },
  'shure-sm7b.svg': { icon: '🎙️', title: 'Shure SM7B', color: '#a855f7' },
  'scarlett-2i2.svg': { icon: '🎛️', title: 'Scarlett 2i2', color: '#ef4444' },
  'yamaha-hs5.svg': { icon: '🔊', title: 'Yamaha HS5', color: '#f59e0b' },
  'marshall-acton.svg': { icon: '📻', title: 'Marshall Acton III', color: '#fbbf24' },
  'launchkey-49.svg': { icon: '🎹', title: 'Launchkey 49', color: '#10b981' },
  'rode-ntusb.svg': { icon: '🎤', title: 'Rode NT-USB', color: '#06b6d4' },
  'sony-wh1000xm5.svg': { icon: '🎧', title: 'Sony WH-1000XM5', color: '#6366f1' },
  'behringer-xenyx.svg': { icon: '🎚️', title: 'Xenyx Q802USB', color: '#ec4899' },
  'shure-se215.svg': { icon: '👂', title: 'Shure SE215', color: '#14b8a6' },
  'lp120x.svg': { icon: '💿', title: 'AT-LP120XUSB', color: '#8b5cf6' },
  'cables-xlr.svg': { icon: '🔌', title: 'Cables XLR', color: '#64748b' }
};

for (const [filename, info] of Object.entries(svgs)) {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad_${filename.replace(/[^a-z0-9]/gi, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="glow_${filename.replace(/[^a-z0-9]/gi, '')}" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${info.color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${info.color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" rx="12" fill="url(#bgGrad_${filename.replace(/[^a-z0-9]/gi, '')})" stroke="#1e293b" stroke-width="2"/>
  <circle cx="200" cy="125" r="85" fill="url(#glow_${filename.replace(/[^a-z0-9]/gi, '')})"/>
  <g opacity="0.35" stroke="${info.color}" stroke-width="3" stroke-linecap="round">
    <line x1="70" y1="125" x2="70" y2="125"/>
    <line x1="90" y1="105" x2="90" y2="145"/>
    <line x1="110" y1="95" x2="110" y2="155"/>
    <line x1="130" y1="115" x2="130" y2="135"/>
    <line x1="270" y1="115" x2="270" y2="135"/>
    <line x1="290" y1="95" x2="290" y2="155"/>
    <line x1="310" y1="105" x2="310" y2="145"/>
    <line x1="330" y1="125" x2="330" y2="125"/>
  </g>
  <circle cx="200" cy="125" r="54" fill="#1e293b" stroke="${info.color}" stroke-width="2" opacity="0.95"/>
  <text x="200" y="142" font-size="50" text-anchor="middle">${info.icon}</text>
  <text x="200" y="222" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="0.5">${info.title}</text>
  <text x="200" y="248" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="${info.color}" text-anchor="middle" letter-spacing="2">AUDIO PROFESIONAL</text>
</svg>`;
  fs.writeFileSync(path.join(dir, filename), content, 'utf8');
}
console.log('SVGs generated successfully in ' + dir);
