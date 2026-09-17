import {
  brand, stats, pillars, disciplines, therapies, memberships, ptLevels, transformations, reels,
  locations, faqs, blog, blogUrl, telHref, waHref, mapsHref,
} from '../data/site.js';
import { head, nav, footer, joinForm, icon, picture, esc, ctaRow } from './partials.js';

const clubNames = { ultra: 'Ultra Luxury', lcc: 'Luxury Club' };

export function homePage() {
  return `${head({
    title: 'Aurum Fitness | Luxury Gyms & Personal Training in Bangalore',
    description: 'Luxury fitness clubs in Indiranagar, Koramangala and Brigade Road. Expert personal training, Panatta equipment, recovery suites and nutrition under one roof.',
    path: '/',
    entry: '/src/main.js',
  })}
<body class="page-home is-loading">
<canvas class="stage" data-stage role="img" aria-label="A golden Aurum emblem floating inside a dark Roman colonnade. The camera circles it as you scroll."></canvas>
<div class="stage-fallback" aria-hidden="true"><img src="/brand/aurum-logo.webp" alt="" width="512" height="512"></div>
<div class="loader" data-loader aria-hidden="true">
  <img src="/brand/aurum-logo.webp" alt="" width="120" height="120">
</div>
${nav()}
<nav class="orbit" aria-label="Page sections" data-orbit>
  <svg class="orbit__dial" viewBox="0 0 64 64" aria-hidden="true">
    <circle class="orbit__track" cx="32" cy="32" r="28"/>
    <circle class="orbit__arc" cx="32" cy="32" r="28" data-orbit-arc/>
  </svg>
  <span class="orbit__label" data-orbit-label>Aurum</span>
</nav>
<main id="main">

<section class="hero" id="fitness" data-scene="hero">
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow reveal">Luxury fitness clubs in Bangalore</p>
      <h1 class="display hero__title">
        <span class="line"><span>Get fit</span></span>
        <span class="line"><span>with <em class="gilt">Aurum</em></span></span>
      </h1>
      <p class="lead hero__lead reveal">Expert coaching, Panatta equipment, recovery and nutrition under one roof, across Indiranagar, Koramangala and Brigade Road.</p>
      <div class="reveal">${ctaRow()}</div>
    </div>
  </div>
</section>

<section class="stats" data-scene="stats" aria-label="Aurum in numbers">
  <ul class="container stats__list">
    ${stats.map((s, i) => `
    <li class="stat reveal" style="--i:${i}">
      <span class="stat__num"><span data-count="${s.value}">${s.value}</span>${s.suffix}</span>
      <span class="stat__label">${s.label}</span>
    </li>`).join('')}
  </ul>
</section>

<section class="about" id="Aboutus" data-scene="about">
  <div class="container about__inner">
    <h2 class="display-2 reveal">More than a gym. <span class="thin">A lifestyle built around wellness.</span></h2>
    <p class="lead reveal">Personalised coaching, advanced recovery and luxury wellness work together, so every member trains with confidence and recovers well.</p>
  </div>
</section>

<section class="pillars" data-scene="pillars" data-pin style="--count:${pillars.length}" aria-labelledby="pillars-title">
  <div class="pillars__sticky">
    <div class="container pillars__grid">
      <div class="pillars__head">
        <h2 class="h2" id="pillars-title">Why choose <span class="thin">Aurum</span></h2>
        <ol class="pillars__index">
          ${pillars.map((p, i) => `<li><button type="button" data-pillar-tab="${i}" aria-controls="pillar-${i}" ${i === 0 ? 'aria-current="true"' : ''}><span class="pillars__tick" aria-hidden="true"></span>${esc(p.title)}</button></li>`).join('')}
        </ol>
      </div>
      <div class="pillars__detail">
        ${pillars.map((p, i) => `
        <article class="pillar glass glass--card ${i === 0 ? 'is-active' : ''}" id="pillar-${i}" data-pillar="${i}" data-tilt>
          <div class="pillar__media">${picture(p.img, { alt: p.title, sizes: '(min-width: 900px) 40vw, 90vw', w: 1600, h: 600 })}</div>
          <h3 class="h3">${esc(p.title)}</h3>
          <p>${esc(p.body)}</p>
        </article>`).join('')}
      </div>
    </div>
    <div class="pillars__progress" aria-hidden="true"><span data-pillars-bar></span></div>
  </div>
</section>

<section class="recovery" id="services" data-scene="recovery" aria-labelledby="recovery-title">
  <div class="container">
    <div class="recovery__head">
      <h2 class="display-2 reveal" id="recovery-title">Recovery is where <span class="thin">progress happens</span></h2>
      <p class="lead reveal">A dedicated recovery ecosystem that reduces fatigue, improves mobility and supports muscle repair, so you come back stronger.</p>
    </div>
    <div class="recovery__layout">
      <figure class="recovery__media reveal">
        ${picture('recovery-feature', { alt: 'Glowing sauna stones', sizes: '(min-width: 900px) 42vw, 92vw', w: 1600, h: 1280 })}
      </figure>
      <ul class="therapies">
        ${therapies.map((t, i) => `
        <li class="therapy glass reveal" style="--i:${i % 2}">
          <span class="therapy__icon">${icon(t.icon)}</span>
          <div>
            <h3 class="therapy__name">${t.name}</h3>
            <p>${t.body}</p>
            <p class="therapy__clubs">${t.clubs.map((c) => clubNames[c]).join(' and ')}</p>
          </div>
        </li>`).join('')}
      </ul>
    </div>
  </div>
  <div class="marquee" aria-label="Training disciplines at Aurum">
    <div class="marquee__track">
      ${[0, 1].map((k) => `<ul ${k ? 'aria-hidden="true"' : ''}>${disciplines.map((d) => `<li>${d}</li>`).join('')}</ul>`).join('')}
    </div>
  </div>
</section>

<section class="film" data-scene="film" aria-label="Aurum brand film">
  <div class="film__sticky">
    <video class="film__video" muted loop playsinline preload="none" poster="/img/film-still-2.webp" data-film
      data-src-hd="/video/brand-film-1080.mp4" data-src-sd="/video/brand-film-720.mp4"></video>
    <div class="film__mask" aria-hidden="true" data-film-mask><span>AURUM</span></div>
    <p class="film__caption h2" data-film-caption>Built for people who believe their health deserves <span class="thin">the very best.</span></p>
  </div>
</section>

<section class="membership" id="membership" data-scene="membership" aria-labelledby="membership-title">
  <div class="container">
    <div class="membership__head">
      <h2 class="display-2 reveal" id="membership-title">Membership <span class="thin">packages</span></h2>
      <p class="lead reveal">From a single day to a full year. Choose how you want to begin, and our team will tailor the rest.</p>
    </div>
    <div class="plans">
      ${memberships.map((m, i) => `
      <article class="plan glass glass--card ${m.featured ? 'plan--featured' : ''}" style="--i:${i}" data-tilt>
        <div class="plan__span"><span class="plan__num">${m.span}</span><span class="plan__unit">${m.unit}</span></div>
        <h3 class="plan__name">${m.name}</h3>
        <p class="plan__tag">${m.tagline}</p>
        <p class="plan__body">${m.body}</p>
        <a class="btn ${m.featured ? 'btn--primary' : 'btn--ghost'} btn--sm" href="#contact" data-plan="${m.id}">Choose plan</a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="training" id="personal-training" data-scene="training" data-pin style="--count:${ptLevels.length}" aria-labelledby="training-title">
  <div class="training__sticky">
    <div class="container training__grid">
      <div class="training__head">
        <p class="eyebrow">Personal training</p>
        <h2 class="h2" id="training-title">Five levels. <span class="thin">One summit.</span></h2>
        <p class="lead">Start with the fundamentals or train with our elite architects. Every level is built around your goals.</p>
        <a class="btn btn--ghost" href="/personal-training/">Compare all levels</a>
      </div>
      <div class="training__levels">
        ${[...ptLevels].reverse().map((l, i) => `
        <article class="level glass glass--card ${i === 0 ? 'is-active' : ''}" data-level="${l.level}" data-level-index="${i}">
          <p class="level__no">Level ${l.level}</p>
          <h3 class="h3">${l.name}</h3>
          <p>${l.summary}</p>
          <dl class="level__meta"><dt>Ideal for</dt><dd>${l.idealFor}</dd></dl>
          <a class="link-arrow" href="/personal-training/#level-${l.level}">Explore level ${l.level}${icon('arrow-right')}</a>
        </article>`).join('')}
      </div>
      <ol class="training__ladder" aria-hidden="true">
        ${ptLevels.map((l) => `<li data-ladder="${l.level}"><span>${l.level}</span></li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="stories" id="transformations" data-scene="stories" aria-labelledby="stories-title">
  <div class="container">
    <h2 class="display-2 reveal" id="stories-title">Real talk from <span class="thin">real people</span></h2>
    <div class="stories__grid">
      <div class="reels">
        ${reels.map((r, i) => `
        <figure class="reel glass reveal" style="--i:${i}" data-reel>
          <video muted loop playsinline preload="none" poster="/img/${r.poster}-800.webp" data-src="/video/${r.src}.mp4" aria-label="${esc(r.title)}"></video>
          <button class="reel__sound" type="button" aria-pressed="false" aria-label="Play with sound" data-reel-sound>${icon('speaker-slash')}</button>
          <figcaption><strong>${esc(r.title)}</strong><span>${esc(r.caption)}</span></figcaption>
        </figure>`).join('')}
      </div>
      <div class="journeys">
        ${transformations.map((t) => `
        <article class="journey reveal">
          <div class="journey__media">${picture(t.img, { alt: `${t.name}, Aurum member`, sizes: '(min-width: 900px) 18vw, 40vw', w: 1179, h: 1324 })}</div>
          <div class="journey__body">
            ${t.from ? `<p class="journey__metric"><span>${t.from}</span>${icon('arrow-right')}<span>${t.to}</span><small>${t.unit}</small></p>` : `<p class="journey__metric journey__metric--text">${t.title}</p>`}
            <blockquote><p>&ldquo;${t.quote}&rdquo;</p></blockquote>
            <p class="journey__who"><strong>${t.name}</strong>, ${t.role}. Coached by ${t.coach}.</p>
          </div>
        </article>`).join('')}
        <a class="link-arrow" href="/weight-loss/">Read their full stories${icon('arrow-right')}</a>
      </div>
    </div>
  </div>
</section>

<section class="clubs" id="Locations" data-scene="clubs" aria-labelledby="clubs-title">
  <div class="container">
    <div class="clubs__head">
      <p class="eyebrow">Aurum locations</p>
      <h2 class="h2" id="clubs-title">Five clubs. <span class="thin">One standard.</span></h2>
      <p class="lead">Indiranagar, Koramangala and Brigade Road. Hover or focus a club to fly to it on the map.</p>
    </div>
    <ul class="clubs__list">
      ${locations.map((l) => `
      <li class="club glass glass--card" data-scene="club" data-club="${l.key}">
        <div class="club__media">${picture(l.images[0], { alt: `${l.name}, ${l.area}`, sizes: '(min-width: 900px) 14vw, 30vw', w: 1600, h: 1067 })}</div>
        <div class="club__body">
          <p class="club__tier">${l.tier}</p>
          <h3 class="h3"><a href="/${l.slug}/">${esc(l.name)}</a></h3>
          <address>${icon('map-pin')}<span>${esc(l.address)}</span></address>
          <div class="club__actions">
            <a class="btn btn--primary btn--sm" href="/${l.slug}/">Explore club</a>
            <a class="btn btn--ghost btn--sm" href="${mapsHref(l)}" target="_blank" rel="noopener">Directions</a>
            <a class="icon-btn" href="${telHref(l.phone)}" aria-label="Call ${esc(l.name)}">${icon('phone')}</a>
            <a class="icon-btn" href="${waHref(l.whatsapp)}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(l.name)}">${icon('whatsapp-logo')}</a>
          </div>
        </div>
      </li>`).join('')}
    </ul>
  </div>
</section>

<section class="faq" id="faq" data-scene="faq" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div class="faq__head">
      <h2 class="h2 reveal" id="faq-title">Questions, <span class="thin">answered</span></h2>
      <p class="lead reveal">Anything else? Our team replies fastest on WhatsApp.</p>
    </div>
    <div class="faq__list">
      ${faqs.map((f) => `
      <details class="faq__item reveal">
        <summary><span>${esc(f.q)}</span>${icon('plus', { cls: 'faq__plus' })}</summary>
        <div class="faq__a"><p>${esc(f.a)}</p></div>
      </details>`).join('')}
    </div>
  </div>
</section>

<section class="journal" id="journal" data-scene="journal" aria-labelledby="journal-title">
  <div class="container">
    <div class="journal__head">
      <h2 class="h2 reveal" id="journal-title">From the <span class="thin">Aurum blog</span></h2>
      <a class="link-arrow" href="/blog/">All ${blog.length} articles${icon('arrow-right')}</a>
    </div>
    <div class="journal__grid">
      ${blog.slice(0, 3).map((b, i) => `
      <article class="post ${i === 0 ? 'post--lead' : ''} reveal">
        <a href="${blogUrl(b.slug)}">
          <div class="post__media"><img src="/img/${b.img}.webp" alt="" width="960" height="640" loading="lazy" decoding="async"></div>
          <h3 class="post__title">${esc(b.title)}</h3>
          <p>${esc(b.excerpt)}</p>
        </a>
      </article>`).join('')}
    </div>
  </div>
</section>

${joinForm()}
</main>
${footer()}
</body>
</html>`;
}
