---
layout: page
title: "Research"
permalink: /research/
---

<p class="text-muted">Browse our papers and blog posts together. Filter by type and research area, or search by title, author, and venue.</p>

<div class="mb-4">
  <input type="search" id="research-search" class="form-control mb-3" placeholder="Search by title, author, venue…" aria-label="Search papers and blog posts">
  <div class="d-flex flex-wrap gap-2 mb-2" id="kind-filters" role="group" aria-label="Filter by content type">
    <button type="button" class="btn btn-sm btn-outline-dark" data-filter="all">All</button>
    <button type="button" class="btn btn-sm btn-outline-dark" data-filter="paper">Papers</button>
    <button type="button" class="btn btn-sm btn-outline-dark" data-filter="post">Blog posts</button>
  </div>
  <div class="d-flex flex-wrap gap-2" id="tag-filters" role="group" aria-label="Filter by tag">
    <button type="button" class="btn btn-sm btn-outline-secondary" data-tag="">All tags</button>
    {% for t in site.data.tags.tags %}
    <button type="button" class="btn btn-sm btn-outline-secondary" data-tag="{{ t.slug }}">{{ t.label }}</button>
    {% endfor %}
  </div>
</div>

<p id="no-results" class="text-muted d-none">No papers or blog posts match the current filters.</p>

{% assign years = "" | split: "" %}
{% for pub in site.data.publications.index %}{% assign years = years | push: pub.year %}{% endfor %}
{% for post in site.posts %}{% assign post_year = post.date | date: "%Y" | plus: 0 %}{% assign years = years | push: post_year %}{% endfor %}
{% assign years = years | uniq | sort | reverse %}

{% for year in years %}
<section class="research-year-group">
  <h4 class="border-bottom pb-2 mb-4">{{ year }}</h4>
  {% for post in site.posts %}
    {% assign post_year = post.date | date: "%Y" | plus: 0 %}
    {% if post_year == year %}
  <div class="research-item mb-4" data-kind="post" data-tags="{{ post.tags | join: ' ' }}" data-search="{{ post.title | append: ' ' | append: post.author | downcase | escape }}">
    <h5 class="mb-1"><a href="{{ site.github.url }}{{ post.url }}">{{ post.title }}</a></h5>
    <p class="mb-1">
      <a href="{{ site.github.url }}/research/?type=post" class="badge rounded-pill bg-dark text-decoration-none me-1">Blog</a>
      {%- include tag_badges.html tags=post.tags -%}
    </p>
    <p class="text-muted small mb-0">Blog post &mdash; {{ post.date | date: "%B %-d, %Y" }}{% if post.author %} &mdash; {{ post.author }}{% endif %}</p>
  </div>
    {% endif %}
  {% endfor %}
  {% for pub in site.data.publications.index %}
    {% if pub.year == year %}
    {% assign pub_authors = pub.authors | join: ", " %}
  <div class="research-item mb-4" data-kind="paper" data-tags="{{ pub.tags | join: ' ' }}" data-search="{{ pub.title | append: ' ' | append: pub_authors | append: ' ' | append: pub.venue | downcase | escape }}">
    <h5 class="mb-1">
      {% if pub.link %}<a href="{{ pub.link }}">{{ pub.title }}</a>{% elsif pub.pdf %}<a href="{{ pub.pdf }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}
    </h5>
    <p class="mb-1">
      <a href="{{ site.github.url }}/research/?type=paper" class="badge rounded-pill bg-dark text-decoration-none me-1">Paper</a>
      {%- include tag_badges.html tags=pub.tags -%}
      {% if pub.award %}<span class="badge bg-warning text-dark">{{ pub.award }}</span>{% endif %}
    </p>
    <p class="text-muted small mb-1">{{ pub_authors }}{% if pub.venue %} &mdash; {{ pub.venue }}{% endif %} ({{ pub.year }})</p>
    <p class="small mb-0">
      {% if pub.pdf %}<a href="{{ pub.pdf }}" class="me-2">PDF</a>{% endif %}
      {% if pub.code %}<a href="{{ pub.code }}" class="me-2">Code</a>{% endif %}
      {% if pub.website %}<a href="{{ pub.website }}">Website</a>{% endif %}
    </p>
  </div>
    {% endif %}
  {% endfor %}
</section>
{% endfor %}

<script>
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.research-item'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.research-year-group'));
  var kindBtns = Array.prototype.slice.call(document.querySelectorAll('#kind-filters button'));
  var tagBtns = Array.prototype.slice.call(document.querySelectorAll('#tag-filters button'));
  var searchBox = document.getElementById('research-search');
  var noResults = document.getElementById('no-results');

  var kind = 'all';
  var tag = '';
  var query = '';

  function apply() {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var visible = 0;
    items.forEach(function (el) {
      var okKind = kind === 'all' || el.dataset.kind === kind;
      var okTag = !tag || el.dataset.tags.split(' ').indexOf(tag) !== -1;
      var okQuery = terms.every(function (t) { return el.dataset.search.indexOf(t) !== -1; });
      var show = okKind && okTag && okQuery;
      el.classList.toggle('d-none', !show);
      if (show) visible++;
    });
    groups.forEach(function (g) {
      var any = Array.prototype.some.call(g.querySelectorAll('.research-item'), function (el) {
        return !el.classList.contains('d-none');
      });
      g.classList.toggle('d-none', !any);
    });
    noResults.classList.toggle('d-none', visible > 0);
    kindBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.filter === kind); });
    tagBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.tag === tag); });

    var params = new URLSearchParams();
    if (kind !== 'all') params.set('type', kind);
    if (tag) params.set('tag', tag);
    if (query) params.set('q', query);
    var qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  kindBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      kind = (kind === b.dataset.filter) ? 'all' : b.dataset.filter;
      apply();
    });
  });
  tagBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      tag = (tag === b.dataset.tag) ? '' : b.dataset.tag;
      apply();
    });
  });
  searchBox.addEventListener('input', function () {
    query = searchBox.value;
    apply();
  });

  var params = new URLSearchParams(location.search);
  kind = params.get('type') || 'all';
  tag = params.get('tag') || '';
  query = params.get('q') || '';
  if (query) searchBox.value = query;
  apply();
})();
</script>
