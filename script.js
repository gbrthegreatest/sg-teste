
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const config = window.SUPERIOR_GENES_CONFIG || {};
  const menuButton = $('#menu-button');
  const nav = $('#main-nav');
  const scrollBar = $('#scroll-progress');
  const year = $('#current-year');
  const noticeDialog = $('#notice-dialog');
  const noticeClose = $('#notice-close');
  const form = $('#brief-form');
  const formError = $('#form-error');
  const floatWhatsapp = $('#float-whatsapp');
  const emailLink = $('#contact-email');
  const phoneLink = $('#contact-phone');
  const instaLink = $('#contact-instagram');

  if (year) year.textContent = new Date().getFullYear();

  const phone = String(config.whatsappNumber || '').replace(/\D/g, '');
  const validPhone = /^\d{12,13}$/.test(phone);

  function buildMessage(data={}) {
    const service = data.service ? `
• Serviço: ${data.service}` : '';
    const business = data.business ? `
• Negócio/segmento: ${data.business}` : '';
    const extra = data.extra ? `
• Detalhes: ${data.extra}` : '';
    const name = data.name ? `Olá! Meu nome é ${data.name}.` : 'Olá!';
    const intro = config.whatsappMessage || 'Olá! Vim pelo site da Superior Genes e gostaria de conversar sobre um projeto.';
    return `${name} ${intro}${service}${business}${extra}`.trim();
  }

  function whatsappUrl(message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function showNotice(message) {
    $('#notice-message').textContent = message || 'Preencha o número de WhatsApp no arquivo config.js para ativar os botões de contato.';
    if (noticeDialog && typeof noticeDialog.showModal === 'function') noticeDialog.showModal();
    else alert(message);
  }

  noticeClose?.addEventListener('click', () => noticeDialog.close());
  noticeDialog?.addEventListener('click', event => {
    const rect = noticeDialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) noticeDialog.close();
  });

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  if (emailLink && config.email) {
    emailLink.href = `mailto:${config.email}`;
    const strong = $('strong', emailLink);
    if (strong) strong.textContent = config.email;
  }

  if (phoneLink) {
    const strong = $('strong', phoneLink);
    if (strong) strong.textContent = config.phoneLabel || '(preencher em config.js)';
    if (validPhone) {
      phoneLink.href = whatsappUrl(config.whatsappMessage || 'Olá!');
      phoneLink.target = '_blank';
      phoneLink.rel = 'noopener noreferrer';
    } else {
      phoneLink.href = '#';
      phoneLink.addEventListener('click', e => { e.preventDefault(); showNotice('Preencha um número válido em config.js para ativar o contato.'); });
    }
  }

  if (instaLink) {
    const strong = $('strong', instaLink);
    if (config.instagramUrl && /^https?:\/\//i.test(config.instagramUrl)) {
      instaLink.href = config.instagramUrl;
      if (strong) strong.textContent = config.instagramUrl.replace(/^https?:\/\//i, '');
    } else {
      instaLink.href = '#';
      instaLink.addEventListener('click', e => { e.preventDefault(); showNotice('Adicione a URL do Instagram em config.js para ativar este link.'); });
    }
  }

  function updateFloatWhatsapp() {
    if (!floatWhatsapp) return;
    if (validPhone) {
      floatWhatsapp.href = whatsappUrl(config.whatsappMessage || 'Olá!');
      floatWhatsapp.target = '_blank';
      floatWhatsapp.rel = 'noopener noreferrer';
    } else {
      floatWhatsapp.href = '#';
      floatWhatsapp.addEventListener('click', e => { e.preventDefault(); showNotice('Preencha o número de WhatsApp em config.js para ativar o botão.'); });
    }
  }
  updateFloatWhatsapp();

  form?.addEventListener('submit', event => {
    event.preventDefault();
    formError.textContent = '';
    if (!validPhone) {
      showNotice('Preencha um número de WhatsApp válido em config.js antes de usar o formulário.');
      return;
    }
    const data = {
      name: $('#field-name')?.value.trim(),
      business: $('#field-business')?.value.trim(),
      extra: $('#field-extra')?.value.trim(),
      service: $('input[name="service"]:checked', form)?.value || ''
    };
    if (!data.name) {
      formError.textContent = 'Por favor, informe seu nome para montar a mensagem.';
      $('#field-name')?.focus();
      return;
    }
    window.open(whatsappUrl(buildMessage(data)), '_blank', 'noopener');
  });

  const reveals = $$('.reveal');
  const observer = ('IntersectionObserver' in window)
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .18 })
    : null;
  reveals.forEach((el, idx) => {
    if (idx % 3 === 1) el.classList.add('reveal-delay');
    if (observer) observer.observe(el); else el.classList.add('is-visible');
  });

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${progress}%`;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
