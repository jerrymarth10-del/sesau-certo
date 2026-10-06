const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960" viewBox="0 0 640 960">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#28425b"/><stop offset=".54" stop-color="#162231"/><stop offset="1" stop-color="#030405"/></linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="640" height="960" fill="url(#bg)"/>
<rect x="28" y="28" width="584" height="904" rx="36" fill="none" stroke="#ff3131" stroke-width="5" filter="url(#glow)"/>
<rect x="72" y="78" width="496" height="330" rx="22" fill="#f2eadf"/>
<rect x="94" y="102" width="255" height="62" rx="8" fill="#24588e"/>
<text x="221" y="128" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#fff">ATENDIMENTO</text>
<text x="221" y="153" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#fff">PEDIÁTRICO</text>
<circle cx="278" cy="252" r="58" fill="#ae704b"/>
<path d="M218 241c10-70 111-78 121-4-17-23-38-33-60-33-24 0-44 10-61 37z" fill="#2a1a16"/>
<path d="M168 504c15-127 54-184 112-184 58 0 103 56 117 184z" fill="#f4f6f8"/>
<path d="M220 356c20 23 87 23 111 0" fill="none" stroke="#1f3551" stroke-width="22" stroke-linecap="round"/>
<circle cx="225" cy="392" r="13" fill="#26384f"/><path d="M226 391c62 2 94 34 93 69" fill="none" stroke="#26384f" stroke-width="7"/>
<circle cx="319" cy="461" r="13" fill="#26384f"/>
<rect x="428" y="190" width="95" height="150" rx="15" fill="#fff6ce"/>
<circle cx="475" cy="232" r="23" fill="#f4c35b"/><circle cx="465" cy="227" r="4" fill="#333"/><circle cx="485" cy="227" r="4" fill="#333"/>
<path d="M459 243c10 8 22 8 32 0" fill="none" stroke="#7a4a25" stroke-width="4" stroke-linecap="round"/>
<rect x="52" y="526" width="536" height="354" rx="26" fill="#020203" fill-opacity=".92"/>
<text x="320" y="620" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="55" font-weight="900" fill="#fff">SEMUSA</text>
<text x="320" y="682" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="55" font-weight="900" fill="#fff">SESAU</text>
<text x="320" y="760" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="54" font-weight="900" fill="#fff">MÉDICO</text>
<text x="320" y="824" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="54" font-weight="900" fill="#fff">PEDIATRA</text>
<line x1="105" y1="855" x2="205" y2="855" stroke="#ef2d2d" stroke-width="4"/><line x1="435" y1="855" x2="535" y2="855" stroke="#ef2d2d" stroke-width="4"/>
<text x="320" y="865" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#f3f4f6">Cargo: Médico Pediatra</text>
</svg>`;
module.exports='data:image/svg+xml;base64,'+Buffer.from(svg,'utf8').toString('base64');
