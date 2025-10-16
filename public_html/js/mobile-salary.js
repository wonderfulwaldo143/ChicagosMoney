(() => {
  const DATASET = 'xzkq-xp2w';
  const JSON_ENDPOINT = `https://data.cityofchicago.org/resource/${DATASET}.json`;
  const CSV_ENDPOINT = `https://data.cityofchicago.org/resource/${DATASET}.csv`;
  const DEFAULT_LIMIT = 25;

  const form = document.querySelector('[data-salary-form]');
  const input = document.querySelector('[data-search-input]');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const filterValues = Array.from(filterButtons, (btn) => btn.dataset.filter);
  const presetButtons = document.querySelectorAll('[data-preset-filter]');
  const suggestionButtons = document.querySelectorAll('[data-suggest-filter]');
  const resultList = document.querySelector('[data-results-list]');
  const statusLabel = document.querySelector('[data-status]');
  const loadMoreBtn = document.querySelector('[data-load-more]');
  const downloadLink = document.querySelector('[data-download-link]');
  const clearButton = document.querySelector('[data-clear-search]');

  if (!form || !input || !resultList) {
    return;
  }

  let activeFilter = 'name';
  let activeQuery = '';
  let nextOffset = 0;
  let currentWhere = '';

  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  const hourlyCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const cleanQuery = (value) => value.trim().replace(/\s+/g, ' ').slice(0, 80);

  const buildWhere = (filter, query) => {
    if (!query) return '';
    const trimmed = query.trim();
    const sanitizedFull = trimmed.replace(/'/g, "''");

    if (filter === 'annual_salary' || filter === 'employee_annual_salary') {
      const numeric = Number(sanitizedFull.replace(/[^0-9.]/g, ''));
      if (!Number.isFinite(numeric)) {
        return '';
      }
      const column = filter === 'employee_annual_salary' ? 'employee_annual_salary' : 'annual_salary';
      return `${column} >= ${numeric}`;
    }

    if (filter === 'name') {
      const rawTokens = trimmed.split(/[\s,]+/).filter(Boolean);
      const sanitizedTokens = rawTokens.map((token) => token.replace(/'/g, "''"));

      if (sanitizedTokens.length > 1) {
        const tokenConditions = sanitizedTokens.map((token) => `upper(name) like upper('%${token}%')`);
        const reversedName = sanitizedTokens.slice().reverse().join(', ');

        const orConditions = [
          `upper(name) like upper('%${sanitizedFull}%')`
        ];

        if (reversedName) {
          orConditions.push(`upper(name) like upper('%${reversedName}%')`);
        }

        if (tokenConditions.length) {
          orConditions.push(`(${tokenConditions.join(' AND ')})`);
        }

        return `(${orConditions.join(' OR ')})`;
      }

      return `upper(name) like upper('%${sanitizedFull}%')`;
    }

    return `upper(${filter}) like upper('%${sanitizedFull}%')`;
  };

  const setActiveFilter = (filter) => {
    const fallback = 'name';
    const resolved = filterValues.includes(filter) ? filter : fallback;
    activeFilter = resolved;
    filterButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.filter === resolved);
    });
    return resolved;
  };

  setActiveFilter(activeFilter);

  const buildParams = (where, limit, offset = 0) => {
    const params = new URLSearchParams({
      $select: 'name,department,job_titles,annual_salary,salary_or_hourly,hourly_rate',
      $limit: String(limit),
      $offset: String(offset),
      $order: 'annual_salary DESC'
    });
    if (where) {
      params.set('$where', where);
    }
    return params;
  };

  const renderStatus = (message, busy = false) => {
    if (statusLabel) {
      statusLabel.textContent = message;
    }
    resultList.setAttribute('aria-busy', busy ? 'true' : 'false');
  };

  const resolveCompensation = (row) => {
    const annualSalary = Number(row.annual_salary);
    if (Number.isFinite(annualSalary) && annualSalary > 0) {
      return {
        display: currency.format(annualSalary),
        descriptor: 'Salary'
      };
    }

    const hourlyRate = Number(row.hourly_rate);
    if (Number.isFinite(hourlyRate) && hourlyRate > 0) {
      return {
        display: `${hourlyCurrency.format(hourlyRate)} / hr`,
        descriptor: 'Hourly'
      };
    }

    return {
      display: 'Compensation unavailable',
      descriptor: ''
    };
  };

  const renderResults = (records, append = false) => {
    if (!append) {
      resultList.innerHTML = '';
    }
    if (!records.length) {
      if (!append) {
        const empty = document.createElement('li');
        empty.className = 'result-empty';
        empty.textContent = 'No records found. Try another search term or filter.';
        resultList.appendChild(empty);
      }
      return;
    }

    records.forEach((row) => {
      const item = document.createElement('li');
      item.className = 'result-item';

      const header = document.createElement('div');
      header.className = 'result-header';
      const nameEl = document.createElement('strong');
      nameEl.textContent = row.name ?? 'Name unavailable';

      const comp = resolveCompensation(row);
      const compWrap = document.createElement('span');
      compWrap.className = 'result-comp';

      const compValue = document.createElement('span');
      compValue.className = 'result-comp-value';
      compValue.textContent = comp.display;
      compWrap.appendChild(compValue);

      if (comp.descriptor) {
        const compDescriptor = document.createElement('span');
        compDescriptor.className = 'result-comp-type';
        compDescriptor.textContent = comp.descriptor;
        compWrap.appendChild(compDescriptor);
      } else {
        compWrap.classList.add('is-missing');
      }

      header.append(nameEl, compWrap);

      const body = document.createElement('div');
      body.className = 'result-body';
      const payType = (row.salary_or_hourly || '').toUpperCase();
      const departmentText = row.department ?? 'Department unavailable';
      const metaParts = [];
      if (comp.descriptor) {
        metaParts.push(comp.descriptor);
      } else if (payType) {
        metaParts.push(payType === 'HOURLY' ? 'Hourly' : 'Salary');
      }
      if (metaParts.length) {
        metaParts.push(departmentText);
      }

      body.innerHTML = `
        <p><span class="mono">${row.job_titles ?? 'Job title unavailable'}</span></p>
        <p class="result-meta">${metaParts.length ? metaParts.join(' • ') : departmentText}</p>
      `;

      item.append(header, body);
      resultList.appendChild(item);
    });
  };

  const buildCsvLink = (where) => {
    const params = buildParams(where, 50000);
    params.delete('$limit');
    params.set('$limit', '50000');
    return `${CSV_ENDPOINT}?${params.toString()}`;
  };

  const performSearch = async ({ filter, query, append = false } = {}) => {
    const activeFilterKey = filter ?? activeFilter;
    const cleanedQuery = cleanQuery(query ?? activeQuery);
    const whereClause = buildWhere(activeFilterKey, cleanedQuery);

    if (!append) {
      renderStatus('Fetching salaries…', true);
    }

    try {
      const params = buildParams(whereClause, DEFAULT_LIMIT, append ? nextOffset : 0);
      const response = await fetch(`${JSON_ENDPOINT}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();

      if (!append) {
        renderResults(data, false);
      } else {
        renderResults(data, true);
      }

      nextOffset = (append ? nextOffset : 0) + data.length;
      currentWhere = whereClause;

      if (downloadLink) {
        if (whereClause) {
          downloadLink.href = buildCsvLink(whereClause);
          downloadLink.hidden = false;
        } else {
          downloadLink.hidden = true;
        }
      }

      if (loadMoreBtn) {
        loadMoreBtn.hidden = data.length < DEFAULT_LIMIT;
      }

      if (!append) {
        if (cleanedQuery) {
          renderStatus(`Results for ${activeFilterKey.replace('_', ' ')} containing “${cleanedQuery}”`, false);
        } else {
          renderStatus('Top compensated employees citywide.', false);
        }
      }
    } catch (error) {
      console.error('Lookup failed', error);
      if (!append) {
        resultList.innerHTML = '';
        const errorItem = document.createElement('li');
        errorItem.className = 'result-empty';
        errorItem.textContent = 'Could not reach the City of Chicago dataset right now. Try again shortly.';
        resultList.appendChild(errorItem);
      }
      renderStatus('Network error. Please retry.', false);
      if (loadMoreBtn) {
        loadMoreBtn.hidden = true;
      }
      if (downloadLink) {
        downloadLink.hidden = true;
      }
    } finally {
      resultList.setAttribute('aria-busy', 'false');
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextFilter = button.dataset.filter ?? 'name';
      setActiveFilter(nextFilter);
      if (input.value.trim()) {
        activeQuery = input.value;
        performSearch({ filter: activeFilter, query: activeQuery });
      }
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const presetFilter = button.dataset.presetFilter;
      const presetQuery = button.dataset.presetQuery ?? '';
      if (!presetFilter || !presetQuery) return;

      setActiveFilter(presetFilter);

      input.value = presetQuery;
      activeQuery = presetQuery;
      if (clearButton) {
        clearButton.hidden = false;
      }
      performSearch({ filter: presetFilter, query: presetQuery });
    });
  });

  suggestionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const suggestFilter = button.dataset.suggestFilter;
      const suggestQuery = button.dataset.suggestQuery ?? '';
      if (!suggestFilter || !suggestQuery) return;

      setActiveFilter(suggestFilter);
      input.value = suggestQuery;
      activeQuery = suggestQuery;
      if (clearButton) {
        clearButton.hidden = false;
      }
      performSearch({ filter: suggestFilter, query: suggestQuery });
      input.focus({ preventScroll: true });
    });
  });

  if (clearButton) {
    clearButton.hidden = true;
    clearButton.addEventListener('click', () => {
      input.value = '';
      activeQuery = '';
      clearButton.hidden = true;
      input.focus({ preventScroll: true });
      performSearch({ filter: activeFilter, query: '' });
    });
  }

  input.addEventListener('input', () => {
    if (clearButton) {
      clearButton.hidden = input.value.trim().length === 0;
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    activeQuery = input.value;
    performSearch({ filter: activeFilter, query: activeQuery });
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      performSearch({ filter: activeFilter, query: activeQuery, append: true });
    });
  }

  // Initial load: top earners
  performSearch({ filter: activeFilter, query: '' });
})();
