---
layout: page
title: Talks & Seminars
---

{% for talk in site.data.talks.talks %}
<section class="mb-5">
  <h3 class="mb-1">{{ talk.title }}</h3>
  <p class="text-muted small mb-2">
    <span class="badge bg-secondary me-2">{{ talk.date }}</span>
    {% if talk.speaker or talk.affiliation %}
    <span class="me-2">
      {% if talk.speaker %}{{ talk.speaker }}{% endif %}
      {% if talk.affiliation %}
        {% if talk.speaker %} &mdash; {% endif %}{{ talk.affiliation }}
      {% endif %}
    </span>
    {% endif %}
  </p>

  {% if talk.abstract %}
  <div class="mb-3">
    <h5 class="fw-bold mb-2">Abstract</h5>
    {% assign abstract_len = talk.abstract | size %}
    {% assign abstract_limit = 600 %}
    {% if abstract_len > abstract_limit %}
      {% assign abstract_preview = talk.abstract | slice: 0, abstract_limit %}
      <p>
        <span
          class="js-text-toggle"
          data-full="{{ talk.abstract | escape }}"
          data-preview="{{ abstract_preview | append: '...' | escape }}"
        >{{ abstract_preview }}...</span>
        <button type="button" class="btn btn-link btn-sm p-0 align-baseline js-show-more">
          Show more
        </button>
        <button type="button" class="btn btn-link btn-sm p-0 align-baseline js-show-less" style="display: none;">
          Show less
        </button>
      </p>
    {% else %}
      <p>{{ talk.abstract }}</p>
    {% endif %}
  </div>
  {% endif %}

  {% if talk.speaker_bio %}
  <div class="mb-3">
    <h5 class="fw-bold mb-2">Speaker Bio</h5>
    {% assign bio_len = talk.speaker_bio | size %}
    {% assign bio_limit = 600 %}
    {% if bio_len > bio_limit %}
      {% assign bio_preview = talk.speaker_bio | slice: 0, bio_limit %}
      <p>
        <span
          class="js-text-toggle"
          data-full="{{ talk.speaker_bio | escape }}"
          data-preview="{{ bio_preview | append: '...' | escape }}"
        >{{ bio_preview }}...</span>
        <button type="button" class="btn btn-link btn-sm p-0 align-baseline js-show-more">
          Show more
        </button>
        <button type="button" class="btn btn-link btn-sm p-0 align-baseline js-show-less" style="display: none;">
          Show less
        </button>
      </p>
    {% else %}
      <p>{{ talk.speaker_bio }}</p>
    {% endif %}
  </div>
  {% endif %}

  {% if talk.homepage %}
  <p class="mt-2">
    <a href="{{ talk.homepage }}" target="_blank" rel="noopener" class="important-link">
      Speaker Homepage »
    </a>
  </p>
  {% endif %}
</section>
{% endfor %}

<script>
  (function () {
    var containers = document.querySelectorAll('.js-text-toggle');
    containers.forEach(function (span) {
      var full = span.getAttribute('data-full');
      var preview = span.getAttribute('data-preview');
      var parent = span.parentElement;
      if (!parent) return;
      var showMore = parent.querySelector('.js-show-more');
      var showLess = parent.querySelector('.js-show-less');
      if (!showMore || !showLess) return;

      showMore.addEventListener('click', function () {
        span.textContent = full;
        showMore.style.display = 'none';
        showLess.style.display = 'inline';
      });

      showLess.addEventListener('click', function () {
        span.textContent = preview;
        showLess.style.display = 'none';
        showMore.style.display = 'inline';
      });
    });
  })();
</script>
