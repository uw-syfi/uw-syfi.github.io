---
layout: page
title: Talks & Seminars
---

{% assign talks = site.talks | sort: "date" | reverse %}
{% for talk in talks %}
<section class="mb-4">
  <h3 class="mb-1"><a href="{{ talk.url | relative_url }}">{{ talk.title }}</a></h3>
  <p class="text-muted small mb-0">
    <span class="badge bg-secondary me-2">{{ talk.date | date: "%B %-d, %Y" }}</span>
    {% if talk.speaker or talk.affiliation %}
    <span class="me-2">
      {% if talk.speaker %}{{ talk.speaker }}{% endif %}
      {% if talk.affiliation %}
        {% if talk.speaker %} &mdash; {% endif %}{{ talk.affiliation }}
      {% endif %}
    </span>
    {% endif %}
  </p>
</section>
{% endfor %}
