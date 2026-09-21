const CHEMISTRY_CARD_BASE64 = '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';

module.exports = async function handler(req, res) {
  try {
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || 'sesau-certo.vercel.app';
    const sourceUrl = 'https://' + productionHost + '/index.html';

    const source = await fetch(sourceUrl, {
      headers: { 'user-agent': 'JR-Apostilas-Projeto1-Quimica/1.1' }
    });

    if (!source.ok) {
      res.statusCode = 502;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end('Não foi possível carregar a plataforma original.');
      return;
    }

    let html = await source.text();
    html = html.replace('<head>', '<head><script>try{history.replaceState(null,\"\",\"/\")}catch(e){}</script>');

    if (!html.includes('data-jr-card="quimica-seduc-pa"')) {
      const imageSrc = 'https://especificas-premium.vercel.app/quimica-card.jpg?v=20260921-3';

      const card = `
<a class="especifica-card-link" data-jr-card="quimica-seduc-pa" href="https://especificas-premium.vercel.app/?area=quimica&v=12" target="_blank" rel="noopener">
  <div class="especifica-card">
    <img src="${imageSrc}" alt="SEDUC PA Professor de Química" width="320" height="480" loading="eager" decoding="async">
  </div>
</a>
`;

      const sectionStart = html.indexOf('<section id="especificas"');
      if (sectionStart >= 0) {
        const sectionEnd = html.indexOf('</section>', sectionStart);
        if (sectionEnd >= 0) {
          const gridClose = html.lastIndexOf('</div>', sectionEnd);
          if (gridClose >= sectionStart) {
            html = html.slice(0, gridClose) + card + html.slice(gridClose);
          }
        }
      }
    }


    if (!html.includes('data-jr-card="prf-administrativo"')) {
      const prfCard = `
<a class="especifica-card-link" data-jr-card="prf-administrativo" href="https://especificas-premium.vercel.app/?area=prf&v=13" target="_blank" rel="noopener">
  <div class="especifica-card">
    <img src="https://especificas-premium.vercel.app/prf-card.jpg?v=20260921-3" alt="PRF Agente Administrativo" width="320" height="480" loading="eager" decoding="async">
  </div>
</a>
`;

      const prfSectionStart = html.indexOf('<section id="especificas"');
      if (prfSectionStart >= 0) {
        const prfSectionEnd = html.indexOf('</section>', prfSectionStart);
        if (prfSectionEnd >= 0) {
          const prfGridClose = html.lastIndexOf('</div>', prfSectionEnd);
          if (prfGridClose >= prfSectionStart) {
            html = html.slice(0, prfGridClose) + prfCard + html.slice(prfGridClose);
          }
        }
      }
    }

    res.statusCode = 200;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
    res.end(html);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('Erro ao montar a página: ' + (error && error.message ? error.message : 'erro desconhecido'));
  }
};