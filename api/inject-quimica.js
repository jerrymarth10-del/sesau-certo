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
      let imageSrc = 'https://especificas-premium.vercel.app/quimica-card.jpg?card=v9';

      // Embute a mesma arte usada no Projeto 2 para evitar falha de cache/PWA no card.
      try {
        const imageSource = await fetch('https://especificas-premium.vercel.app/quimica-card.b64?card=v9', {
          headers: { 'user-agent': 'JR-Apostilas-Projeto1-Quimica-Image/1.1' }
        });
        if (imageSource.ok) {
          const b64 = (await imageSource.text()).trim();
          if (b64 && b64.length > 1000) imageSrc = 'data:image/jpeg;base64,' + b64;
        }
      } catch (e) {}

      const card = `
<a class="especifica-card-link" data-jr-card="quimica-seduc-pa" href="https://especificas-premium.vercel.app/?area=quimica" target="_blank" rel="noopener">
  <div class="especifica-card">
    <img src="${imageSrc}" alt="SEDUC PA Professor de Química" loading="eager" decoding="async">
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