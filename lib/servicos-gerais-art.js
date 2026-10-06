const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960" viewBox="0 0 640 960">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#17243a"/><stop offset=".58" stop-color="#0b1320"/><stop offset="1" stop-color="#030407"/></linearGradient>
  <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff4141"/><stop offset="1" stop-color="#b40000"/></linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="640" height="960" fill="url(#bg)"/>
<rect x="28" y="28" width="584" height="904" rx="36" fill="none" stroke="#ff3131" stroke-width="5" filter="url(#glow)"/>
<rect x="72" y="78" width="496" height="320" rx="22" fill="#eef4f8"/>
<rect x="96" y="98" width="448" height="74" rx="9" fill="#215b95"/>
<text x="320" y="130" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#fff">UNIDADE BÁSICA</text>
<text x="320" y="159" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#fff">DE SAÚDE</text>
<circle cx="218" cy="276" r="57" fill="#aa6c45"/>
<path d="M158 270c8-73 112-78 120-4-17-25-38-34-59-34-23 0-43 10-61 38z" fill="#241813"/>
<path d="M120 515c13-123 45-178 103-178 57 0 96 55 107 178z" fill="#102f53"/>
<rect x="184" y="383" width="72" height="46" rx="6" fill="#eef2f7"/>
<text x="210" y="463" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#fff">SEMUSA</text>
<text x="210" y="485" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#fff">SESAU</text>
<rect x="390" y="388" width="145" height="110" rx="14" fill="#242b35"/>
<rect x="409" y="413" width="50" height="65" rx="6" fill="#e5b624"/>
<rect x="472" y="406" width="46" height="73" rx="6" fill="#f0c83b"/>
<line x1="510" y1="278" x2="478" y2="415" stroke="#dbe5ec" stroke-width="10"/>
<circle cx="412" cy="512" r="13" fill="#111"/><circle cx="515" cy="512" r="13" fill="#111"/>
<rect x="52" y="526" width="536" height="354" rx="26" fill="#020203" fill-opacity=".92"/>
<text x="320" y="620" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="55" font-weight="900" fill="#fff">SEMUSA</text>
<text x="320" y="682" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="55" font-weight="900" fill="#fff">SESAU</text>
<text x="320" y="760" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="52" font-weight="900" fill="#fff">SERVIÇOS</text>
<text x="320" y="824" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="61" font-weight="900" fill="#fff">GERAIS</text>
<line x1="105" y1="855" x2="205" y2="855" stroke="#ef2d2d" stroke-width="4"/><line x1="435" y1="855" x2="535" y2="855" stroke="#ef2d2d" stroke-width="4"/>
<text x="320" y="865" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#f3f4f6">Cargo: Serviços Gerais</text>
</svg>`;
module.exports='data:image/svg+xml;base64,'+Buffer.from(svg,'utf8').toString('base64');
