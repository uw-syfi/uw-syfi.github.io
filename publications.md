---
layout: page
title: "Publications"
---


{% for pub in site.data.publications.index %}
<div class="row g-5 mb-5">
  <div class="col-md-12">
    {% if pub.link %}
      <h5><a href="{{ pub.link }}">{{ pub.title }}</a></h5>
    {% else %}
      <h5><a href="{{ pub.pdf }}">{{ pub.title }}</a></h5>
    {% endif %}
    {% if pub.award %}<span class="badge bg-warning text-dark">{{ pub.award }}</span>{% endif %}
    <p class="text-muted">{{ pub.authors | join: ", " }} &mdash; {{ pub.venue }} ({{ pub.year }})</p>
    <div class="d-flex gap-2">
      {% if pub.pdf %}
        <a href="{{ pub.pdf }}" class="btn btn-sm btn-outline-secondary">PDF</a>
      {% endif %}
      {% if pub.code %}
        <a href="{{ pub.code }}" class="btn btn-sm btn-outline-secondary">Code</a>
      {% endif %}
    </div>
  </div>
</div>
{% endfor %}
