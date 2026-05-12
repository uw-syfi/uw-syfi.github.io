---
layout: page
title: "News"
---

{% for item in site.data.news.news limit:5 %}
<div class="row g-5 mb-5">
  <div class="col-md-12">
    <span class="badge bg-secondary">{{ item.date }}</span>
    {% if item.link contains '://' %}
      <a href="{{ item.link }}">{{ item.title }}</a>
    {% else %}
      <a href="{{ site.github.url }}{{ item.link }}">{{ item.title }}</a>
    {% endif %}
  </div>
</div>
{% endfor %}
