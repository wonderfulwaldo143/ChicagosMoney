document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.getElementById('primaryNav');
  let menuTimeout;

  const closeMobileMenu = () => {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    if (mobileMenu) {
      mobileMenu.setAttribute('aria-expanded', 'false');
    }
  };

  const openMobileMenu = () => {
    if (!navLinks) return;
    navLinks.classList.add('is-open');
    if (mobileMenu) {
      mobileMenu.setAttribute('aria-expanded', 'true');
    }
  };

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      if (navLinks.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
        if (menuTimeout) {
          clearTimeout(menuTimeout);
        }
        menuTimeout = window.setTimeout(closeMobileMenu, 4000);
      }
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth > 768) return;
      if (!navLinks.contains(event.target) && !mobileMenu.contains(event.target)) {
        closeMobileMenu();
      }
    });

    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });
  }

  const insightsData = {
    loop: {
      title: 'Loop revenue power',
      description: "Chicago's central business district remains the city's revenue engine with tourism rebounding above 2019 levels and more than 110,000 weekday commuters returning to the Loop.",
      metrics: [
        { label: 'Median office occupancy', value: '78%' },
        { label: 'Building permits issued 2024', value: '428' },
        { label: 'Average transit rides per day', value: '612k' }
      ],
      highlight: 'Opportunity: Pair hospitality leads with upcoming hotel renovations near the Chicago Riverwalk.'
    },
    south: {
      title: 'Lakefront &amp; South Side catalysts',
      description: 'From Hyde Park to South Shore, new cultural investments such as the Obama Presidential Center are unlocking commercial corridors, lakefront tourism, and workforce training hubs.',
      metrics: [
        { label: 'Obama Center construction jobs', value: '5,000 projected' },
        { label: 'Invest South/West grants awarded', value: '$2.2B pipeline' },
        { label: 'Lakefront trail visits (annual)', value: '19 million' }
      ],
      highlight: 'Opportunity: Align community programming with anticipated visitor flow to Jackson Park and the Museum Campus.'
    },
    west: {
      title: 'West Side logistics corridor',
      description: 'Industrial space in North Lawndale, Garfield Park, and Little Village is being repositioned for life sciences and last-mile delivery operators near I-290 and the Metra UP-West line.',
      metrics: [
        { label: 'Modern warehouse vacancy', value: '6.8%' },
        { label: 'Life science lab square feet planned', value: '1.2M' },
        { label: 'Freight rail intermodal lifts', value: '3rd nationally' }
      ],
      highlight: 'Opportunity: Bundle logistics incentives with workforce pipelines from Malcolm X College and Instituto del Progreso Latino.'
    },
    north: {
      title: 'North River innovation cluster',
      description: 'River North, Goose Island, and Lincoln Yards are attracting VC-backed startups, advanced manufacturing, and design studios along revitalized riverfront parcels.',
      metrics: [
        { label: 'Average venture investment (2024)', value: '$14M' },
        { label: 'New riverfront acres activated', value: '55 acres' },
        { label: 'Divvy station density', value: 'Top 3 citywide' }
      ],
      highlight: 'Opportunity: Launch pilot programs with incubators like mHUB and 1871 targeting clean-tech deployment.'
    }
  };

  const insightButtons = document.querySelectorAll('.insight-button');
  const insightTitle = document.querySelector('[data-insight-title]');
  const insightDescription = document.querySelector('[data-insight-description]');
  const insightMetrics = document.querySelector('[data-insight-metrics]');
  const insightHighlight = document.querySelector('[data-insight-highlight]');

  const sanitizeMarkup = (value) => value.replace(/&amp;/g, '&');

  const renderInsight = (key) => {
    const insight = insightsData[key];
    if (!insight || !insightTitle || !insightDescription || !insightMetrics || !insightHighlight) {
      return;
    }

    insightTitle.innerHTML = sanitizeMarkup(insight.title);
    insightDescription.textContent = insight.description;

    insightMetrics.innerHTML = '';
    insight.metrics.forEach((metric) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.className = 'metric-label';
      label.textContent = metric.label;
      const value = document.createElement('span');
      value.className = 'metric-value';
      value.textContent = metric.value;
      item.append(label, value);
      insightMetrics.appendChild(item);
    });

    insightHighlight.textContent = insight.highlight;
  };

  if (insightButtons.length) {
    insightButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.getAttribute('data-insight');
        if (!key) return;

        insightButtons.forEach((btn) => {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        renderInsight(key);
      });
    });
  }

  const firstInsight = insightButtons[0];
  if (firstInsight) {
    const defaultKey = firstInsight.getAttribute('data-insight');
    if (defaultKey) {
      renderInsight(defaultKey);
    }
  }

  const formatCount = (value, format, prefix = '') => {
    const number = Number(value);
    if (Number.isNaN(number)) {
      return prefix + value;
    }

    if (format === 'compact') {
      const compactFormatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
      });
      return prefix + compactFormatter.format(number);
    }

    const commaFormatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    });
    return prefix + commaFormatter.format(number);
  };

  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (element) => {
    const targetValue = Number(element.getAttribute('data-count'));
    const format = element.getAttribute('data-format') || 'comma';
    const prefix = element.getAttribute('data-prefix') || '';
    if (Number.isNaN(targetValue)) {
      return;
    }

    if (prefersReducedMotion) {
      element.textContent = formatCount(targetValue, format, prefix);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const currentValue = Math.floor(progress * targetValue);
      element.textContent = formatCount(currentValue, format, prefix);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = formatCount(targetValue, format, prefix);
      }
    };

    window.requestAnimationFrame(step);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  const messageInput = document.getElementById('message');
  const messageCount = document.getElementById('messageCount');
  const messageProgress = document.getElementById('messageProgress');

  const updateMessageFeedback = () => {
    if (!messageInput || !messageCount) return;
    const maxLength = Number(messageInput.getAttribute('maxlength')) || 750;
    const currentLength = messageInput.value.length;
    messageCount.textContent = `${currentLength} / ${maxLength} characters`;
    if (messageProgress) {
      messageProgress.value = currentLength;
    }
  };

  if (messageInput) {
    updateMessageFeedback();
    messageInput.addEventListener('input', updateMessageFeedback);
  }

  const visitButtons = document.querySelectorAll('.visit-button');
  const visitDetails = document.querySelector('[data-visit-details]');

  const visitContent = {
    transit: {
      title: 'Transit directions',
      description: 'The Loop elevated lines and Metra commuter trains deliver you within two blocks. Use the CTA Trip Planner for precise timing.',
      tips: [
        'Brown, Pink, Orange, Purple Express, and Green lines stop at Washington/Wells.',
        'Ogilvie and Union Station commuters can walk the riverwalk in under 8 minutes.',
        'CTA bus routes 20 Madison and 134 Stockton/LaSalle stop outside our lobby.'
      ]
    },
    bike: {
      title: 'Cycling arrival tips',
      description: 'Divvy stations line the river and Kinzie Street features one of Chicago\'s most-used protected bike lanes.',
      tips: [
        'Divvy docks are located at Wacker/Kinzie and Washington/Clinton.',
        'Secure indoor bike parking is available in the Civic Opera Building garage.',
        'Use the Chicago Riverwalk ramp at Franklin for a low-traffic approach.'
      ]
    },
    car: {
      title: 'Driving & parking guidance',
      description: 'Upper Wacker provides quick access from Lake Shore Drive and the Kennedy Expressway with multiple garages within a two-block radius.',
      tips: [
        'Enter Upper Wacker via Franklin or Lake for easiest drop-off.',
        'Validated parking after 3 p.m. at 181 N Dearborn and 200 W Randolph.',
        'Ride-share pick-ups are staged on Lower Wacker; follow lobby signage.'
      ]
    }
  };

  const renderVisitDetails = (key) => {
    if (!visitDetails) return;
    const content = visitContent[key];
    if (!content) return;

    const heading = visitDetails.querySelector('h4');
    const paragraph = visitDetails.querySelector('p');
    const list = visitDetails.querySelector('ul');

    if (heading) heading.textContent = content.title;
    if (paragraph) paragraph.textContent = content.description;
    if (list) {
      list.innerHTML = '';
      content.tips.forEach((tip) => {
        const li = document.createElement('li');
        li.textContent = tip;
        list.appendChild(li);
      });
    }
  };

  if (visitButtons.length) {
    visitButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.getAttribute('data-route');
        if (!key) return;
        visitButtons.forEach((btn) => {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        renderVisitDetails(key);
      });
    });
    const defaultRoute = visitButtons[0].getAttribute('data-route');
    if (defaultRoute) {
      visitButtons[0].classList.add('is-active');
      visitButtons[0].setAttribute('aria-pressed', 'true');
      renderVisitDetails(defaultRoute);
    }
  }
});
