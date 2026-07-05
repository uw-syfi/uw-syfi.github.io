---
layout: page
title: "Blog"
---

{% for post in site.posts %}
<div class="row g-5 mb-5">
  <div class="col-md-12">
    <h5><a href="{{ site.github.url }}{{ post.url }}">{{ post.title }}</a></h5>
    <p class="mb-1">{% include tag_badges.html tags=post.tags %}</p>
    <p class="text-muted">{{ post.date | date: "%B %d, %Y" }}</p>
    {{ post.excerpt }}
  </div>
</div>
{% endfor %}
