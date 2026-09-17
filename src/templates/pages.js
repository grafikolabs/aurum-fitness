import {
  brand, locations, therapies, ptLevels, transformations, reels, blog, blogUrl, telHref, waHref, mapsHref,
} from '../data/site.js';
import { head, nav, footer, joinForm, icon, picture, esc } from './partials.js';

const shell = ({ title, description, path, body, bodyClass = '' }) => `${head({ title, description, path, entry: '/src/sub.js' })}
<body class="page-sub ${bodyClass}">
<canvas class="stage stage--sub" data-stage role="img" aria-label="The Aurum emblem in gold, turning slowly."></canvas>
${nav()}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>`;

const crumbs = (items) => `
<nav class="crumbs" aria-label="Breadcrumb">
  <ol>${items.map((i, k) => (k === items.length - 1 ? `<li aria-current="page">${esc(i.label)}</li>` : `<li><a href="${i.href}">${esc(i.label)}</a></li>`)).join('')}</ol>
</nav>`;

const faqList = (items) => `
<div class="faq__list">
  ${items.map((f) => `
  <details class="faq__item reveal">
    <summary><span>${esc(f.q)}</span>${icon('plus', { cls: 'faq__plus' })}</summary>
    <div class="faq__a"><p>${esc(f.a)}</p></div>
  </details>`).join('')}
</div>`;

const reasonGrid = (items, cls = '') => `
<ul class="reasons ${cls}">
  ${items.map((r, i) => `
  <li class="reason glass glass--card reveal" style="--i:${i % 3}" data-tilt>
    <h3 class="h3">${esc(r.title)}</h3>
    <p>${esc(r.body)}</p>
  </li>`).join('')}
</ul>`;

export function locationPage(loc) {
  const others = locations.filter((l) => l.key !== loc.key);
  const locTherapies = therapies.filter((t) => t.clubs.includes(loc.key));
  const gallery = loc.images.slice(1);

  const body = `
<section class="sub-hero" data-scene="hero">
  <div class="container">
    ${crumbs([{ label: 'Home', href: '/' }, { label: 'Clubs', href: '/#Locations' }, { label: loc.name }])}
    <div class="sub-hero__grid">
      <div class="sub-hero__copy">
        <p class="eyebrow">${esc(loc.tier)}, ${esc(loc.area)}</p>
        <h1 class="display display--sub">${esc(loc.name)}</h1>
        <p class="sub-hero__kicker">${esc(loc.headline)}</p>
        <p class="lead">${esc(loc.intro)}</p>
        <div class="cta-row">
          <a class="btn btn--primary" href="#contact" data-magnetic>${esc(loc.cta)}</a>
          <a class="btn btn--ghost" href="${waHref(loc.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp-logo')}<span>Chat on WhatsApp</span></a>
        </div>
      </div>
      <aside class="visit glass glass--card" data-tilt aria-label="Visit ${esc(loc.name)}">
        <div class="visit__media">${picture(loc.images[0], { alt: `${loc.name} interior`, sizes: '(min-width: 900px) 36vw, 92vw', eager: true })}</div>
        <dl class="visit__list">
          <div>${icon('map-pin')}<dt class="sr-only">Address</dt><dd>${esc(loc.address)}</dd></div>
          <div>${icon('phone')}<dt class="sr-only">Phone</dt><dd><a href="${telHref(loc.phone)}">${loc.phone}</a></dd></div>
          <div>${icon('clock')}<dt class="sr-only">Hours</dt><dd>${brand.hours.map((h) => `${h.days}: ${h.time}`).join('<br>')}</dd></div>
        </dl>
        <a class="btn btn--ghost btn--block" href="${mapsHref(loc)}" target="_blank" rel="noopener">Get directions${icon('arrow-up-right')}</a>
      </aside>
    </div>
  </div>
</section>

<section class="section sub-about" data-scene="about">
  <div class="container sub-about__grid">
    <div class="sub-about__text">
      ${loc.about.map((p, i) => `<p class="${i === 0 ? 'display-3' : 'lead'} reveal">${esc(p)}</p>`).join('')}
    </div>
  </div>
</section>

${gallery.length ? `
<section class="gallery" aria-label="Inside ${esc(loc.name)}" data-scene="gallery">
  <div class="gallery__track" data-drag>
    ${gallery.map((g, i) => `<figure class="gallery__item ${i % 3 === 0 ? 'gallery__item--wide' : ''}">${picture(g, { alt: `${loc.name}, ${loc.area}`, sizes: '(min-width: 900px) 40vw, 80vw' })}</figure>`).join('')}
  </div>
</section>` : ''}

${loc.showReels ? `
<section class="section section--tight" data-scene="reels" aria-labelledby="reels-title">
  <div class="container">
    <h2 class="h2 reveal" id="reels-title">Inside <span class="thin">${esc(loc.name.replace('Aurum ', ''))}</span></h2>
    <div class="reels reels--row">
      ${reels.map((r, i) => `
      <figure class="reel glass reveal" style="--i:${i}" data-reel>
        <video muted loop playsinline preload="none" poster="/img/${r.poster}-800.webp" data-src="/video/${r.src}.mp4" aria-label="${esc(r.title)}"></video>
        <button class="reel__sound" type="button" aria-pressed="false" aria-label="Play with sound" data-reel-sound>${icon('speaker-slash')}</button>
        <figcaption><strong>${esc(r.title)}</strong><span>${esc(r.caption)}</span></figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>` : ''}

${loc.reasons ? `
<section class="section" data-scene="reasons" aria-labelledby="why-title">
  <div class="container">
    <h2 class="h2 reveal" id="why-title">Why members choose <span class="thin">${esc(loc.name.replace('Aurum ', ''))}</span></h2>
    ${reasonGrid(loc.reasons)}
  </div>
</section>` : ''}

${loc.upgrades ? `
<section class="section" data-scene="upgrades" aria-labelledby="upgrade-title">
  <div class="container split-list">
    <h2 class="h2 reveal" id="upgrade-title">Now upgraded <span class="thin">for a better you</span></h2>
    ${reasonGrid(loc.upgrades, 'reasons--stack')}
  </div>
</section>` : ''}

${locTherapies.length ? `
<section class="section" data-scene="recovery" aria-labelledby="rec-title">
  <div class="container">
    <h2 class="h2 reveal" id="rec-title">Recovery <span class="thin">suite</span></h2>
    ${loc.recoveryNote ? `<p class="lead reveal">${esc(loc.recoveryNote)}</p>` : ''}
    <ul class="therapies therapies--wide">
      ${locTherapies.map((t, i) => `
      <li class="therapy glass reveal" style="--i:${i % 2}">
        <span class="therapy__icon">${icon(t.icon)}</span>
        <div><h3 class="therapy__name">${t.name}</h3><p>${t.body}</p></div>
      </li>`).join('')}
    </ul>
    ${loc.closing ? `<p class="display-3 reveal">${esc(loc.closing)}</p>` : ''}
  </div>
</section>` : ''}

${loc.facilities ? `
<section class="section" data-scene="facilities" aria-labelledby="fac-title">
  <div class="container split-list">
    <h2 class="h2 reveal" id="fac-title">World-class <span class="thin">facilities</span></h2>
    <ul class="pills">${loc.facilities.map((f) => `<li class="pill glass">${esc(f)}</li>`).join('')}</ul>
  </div>
</section>` : ''}

${loc.audience ? `
<section class="section" data-scene="audience" aria-labelledby="aud-title">
  <div class="container">
    <h2 class="h2 reveal" id="aud-title">Who is Aurum <span class="thin">for?</span></h2>
    <ul class="audience">${loc.audience.map((a) => `<li class="reveal"><strong>${esc(a.title)}</strong><span>${esc(a.body)}</span></li>`).join('')}</ul>
  </div>
</section>` : ''}

${loc.nearby ? `
<section class="section section--tight" data-scene="nearby" aria-labelledby="near-title">
  <div class="container split-list">
    <h2 class="h3 reveal" id="near-title">Easily reached from across East Bangalore</h2>
    <ul class="pills pills--quiet">${loc.nearby.map((n) => `<li class="pill">${esc(n)}</li>`).join('')}</ul>
  </div>
</section>` : ''}

${loc.faq ? `
<section class="section faq" id="faq" data-scene="faq" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div class="faq__head"><h2 class="h2 reveal" id="faq-title">Frequently asked <span class="thin">questions</span></h2></div>
    ${faqList(loc.faq)}
  </div>
</section>` : ''}

<section class="section others" data-scene="others" aria-labelledby="others-title">
  <div class="container">
    <h2 class="h2 reveal" id="others-title">Other Aurum <span class="thin">clubs</span></h2>
    <ul class="others__list">
      ${others.map((o) => `
      <li class="other glass glass--card reveal" data-tilt>
        <a href="/${o.slug}/">
          <div class="other__media">${picture(o.images[0], { alt: '', sizes: '(min-width: 900px) 22vw, 80vw' })}</div>
          <p class="club__tier">${esc(o.area)}</p>
          <h3 class="h3">${esc(o.name)}</h3>
          <span class="link-arrow">View club${icon('arrow-right')}</span>
        </a>
      </li>`).join('')}
    </ul>
  </div>
</section>

${joinForm({ heading: `Join ${loc.name}`, preselect: loc.key })}`;

  return shell({ title: loc.seoTitle, description: loc.seoDescription, path: `/${loc.slug}/`, body, bodyClass: 'page-club' });
}

export function trainingPage({ path = '/personal-training/' } = {}) {
  const body = `
<section class="sub-hero" data-scene="hero">
  <div class="container">
    ${crumbs([{ label: 'Home', href: '/' }, { label: 'Personal Training' }])}
    <div class="sub-hero__grid">
      <div class="sub-hero__copy">
        <p class="eyebrow">Personal training packages</p>
        <h1 class="display display--sub">Five levels. <span class="thin">One summit.</span></h1>
        <p class="lead">From fitness fundamentals to elite performance architecture. Choose the coaching depth that matches your goals, and move up as you grow.</p>
        <div class="cta-row">
          <a class="btn btn--primary" href="#contact" data-magnetic>Register now</a>
          <a class="btn btn--ghost" href="#level-1">See the levels</a>
        </div>
      </div>
      <div class="sub-hero__media glass glass--card" data-tilt>${picture('pt-duo', { alt: 'An Aurum coach guiding a member through push-ups', sizes: '(min-width: 900px) 40vw, 92vw', eager: true, w: 1362, h: 748 })}</div>
    </div>
  </div>
</section>

<section class="section levels" data-scene="levels" aria-label="Coaching levels">
  <div class="container">
    <ol class="levels__stack">
      ${ptLevels.map((l) => `
      <li class="levels__item" id="level-${l.level}" style="--i:${l.level}">
        <article class="level-card glass glass--card">
          <header class="level-card__head">
            <p class="level-card__no"><span>Level</span>${l.level}</p>
            <div>
              <h2 class="h2">${l.name}</h2>
              <p class="lead">${l.summary}</p>
            </div>
          </header>
          <dl class="level-card__grid">
            <div><dt>Expertise</dt><dd>${l.expertise}</dd></div>
            <div><dt>Approach</dt><dd>${l.approach}</dd></div>
            <div><dt>Ideal for</dt><dd>${l.idealFor}</dd></div>
          </dl>
          <a class="btn btn--ghost btn--sm" href="#contact" data-plan="personal-training">Register for level ${l.level}</a>
        </article>
      </li>`).join('')}
    </ol>
  </div>
</section>

${joinForm({ heading: 'Register for personal training', sub: 'Tell us your goals and preferred club. A coach will reach out on WhatsApp to match you with the right level.' })}`;

  return shell({
    title: 'Personal Training in Bangalore | Aurum Fitness',
    description: 'Five levels of personal training at Aurum Fitness, from Fitness Fundamentals Guides to Elite Performance Architects. Clubs in Indiranagar, Koramangala and Brigade Road.',
    path,
    body,
    bodyClass: 'page-training',
  });
}

export function weightLossPage() {
  const body = `
<section class="sub-hero" data-scene="hero">
  <div class="container">
    ${crumbs([{ label: 'Home', href: '/' }, { label: 'Weight Loss' }])}
    <div class="sub-hero__copy sub-hero__copy--wide">
      <p class="eyebrow">Weight loss programme in Indiranagar</p>
      <h1 class="display display--sub">Real people. <span class="thin">Real transformations.</span></h1>
      <p class="lead">Inspiring weight loss journeys, built on personalised training, structured nutrition and a team that shows up for you.</p>
    </div>
  </div>
</section>

${transformations.map((t, i) => `
<section class="section story ${i % 2 ? 'story--flip' : ''}" data-scene="story" aria-labelledby="story-${t.id}">
  <div class="container story__grid">
    <figure class="story__media glass glass--card reveal" data-tilt>${picture(t.img, { alt: `${t.name}, Aurum member`, sizes: '(min-width: 900px) 34vw, 92vw', w: 1179, h: 1324 })}</figure>
    <div class="story__body">
      ${t.from ? `<p class="journey__metric journey__metric--xl reveal"><span>${t.from}</span>${icon('arrow-right')}<span>${t.to}</span><small>${t.unit}</small></p>` : ''}
      <h2 class="h2 reveal" id="story-${t.id}">${t.name}: <span class="thin">${esc(t.title)}</span></h2>
      <p class="lead reveal">${esc(t.story)}</p>
      <blockquote class="reveal"><p>&ldquo;${esc(t.quote)}&rdquo;</p><footer>${t.name}, ${t.role}. Coached by ${t.coach}${t.club ? ` at ${t.club}` : ''}.</footer></blockquote>
    </div>
  </div>
</section>`).join('')}

<section class="section" data-scene="reels" aria-labelledby="reels-title">
  <div class="container">
    <h2 class="h2 reveal" id="reels-title">Hear it from <span class="thin">our members</span></h2>
    <div class="reels reels--row">
      ${reels.map((r, i) => `
      <figure class="reel glass reveal" style="--i:${i}" data-reel>
        <video muted loop playsinline preload="none" poster="/img/${r.poster}-800.webp" data-src="/video/${r.src}.mp4" aria-label="${esc(r.title)}"></video>
        <button class="reel__sound" type="button" aria-pressed="false" aria-label="Play with sound" data-reel-sound>${icon('speaker-slash')}</button>
        <figcaption><strong>${esc(r.title)}</strong><span>${esc(r.caption)}</span></figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>

${joinForm({ heading: 'Start your transformation', sub: 'Share your goal and preferred club. Our coaches will build your plan and reach out on WhatsApp.' })}`;

  return shell({
    title: 'Weight Loss Program in Indiranagar | Aurum Fitness',
    description: 'Real weight loss transformations at Aurum Fitness, Indiranagar. Personalised training and structured nutrition, like Abhishek, who went from 130 kg to 82 kg.',
    path: '/weight-loss/',
    body,
    bodyClass: 'page-weightloss',
  });
}

export function blogPage() {
  const body = `
<section class="sub-hero" data-scene="hero">
  <div class="container">
    ${crumbs([{ label: 'Home', href: '/' }, { label: 'Blog' }])}
    <div class="sub-hero__copy sub-hero__copy--wide">
      <h1 class="display display--sub">The Aurum <span class="thin">blog</span></h1>
      <p class="lead">Guides on training, coaching and choosing the right gym in Bangalore, from the Aurum team.</p>
    </div>
  </div>
</section>
<section class="section section--tight" data-scene="posts" aria-label="Articles">
  <div class="container">
    <ul class="posts">
      ${blog.map((b, i) => `
      <li class="post ${i === 0 ? 'post--lead' : ''} reveal" style="--i:${i % 3}">
        <a href="${blogUrl(b.slug)}">
          <div class="post__media"><img src="/img/${b.img}.webp" alt="" width="960" height="640" ${i < 3 ? '' : 'loading="lazy"'} decoding="async"></div>
          <h2 class="post__title">${esc(b.title)}</h2>
          <p>${esc(b.excerpt)}</p>
          <span class="link-arrow">Read article${icon('arrow-right')}</span>
        </a>
      </li>`).join('')}
    </ul>
  </div>
</section>
${joinForm()}`;

  return shell({
    title: 'Blog | Aurum Fitness',
    description: 'Training, personal coaching and gym guides from Aurum Fitness, Bangalore.',
    path: '/blog/',
    body,
    bodyClass: 'page-blog',
  });
}
