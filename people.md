---
layout: default
title: "People"
---

{% assign role_order = "director,affiliated,postdoc,phd_student,student,alumni" | split: "," %}
{% assign role_labels = "Directors,Affiliated Faculty,Postdocs,PhD Students,Undergraduates,Alumni" | split: "," %}

{% for role in role_order %}
  {% assign role_index = forloop.index0 %}
  {% assign label = role_labels[role_index] %}
  {% assign people_in_role = site.data.people.people | where: "role", role %}

  {% if people_in_role.size > 0 %}
  <section class="mb-5">
    <h1 class="fw-bold border-bottom pb-3 mb-4">{{ label }}</h1>
    <div class="row g-4">
      {% for person in people_in_role %}
      <div class="col-6 col-md-3">
        <div class="text-center">
          <div style="width: 100px; height: 100px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 50%;">
            <img src="{{ site.github.url }}/{{ person.image }}" alt="{{ person.name }}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <h6 class="fw-bold mb-1">{{ person.name }}</h6>
          {% if person.title %}
            <p class="text-muted small mb-2">{{ person.title }}</p>
          {% endif %}
          {% if person.level %}
            <p class="text-muted small mb-2">{{ person.level }}</p>
          {% endif %}
          <div class="d-flex justify-content-center gap-2">
            {% if person.email %}
              <a href="mailto:{{ person.email }}" class="text-muted" title="Email" style="text-decoration: none; font-size: 0.9rem;">
                <i class="fas fa-envelope"></i>
              </a>
            {% endif %}
            {% if person.website %}
              <a href="{{ person.website }}" target="_blank" class="text-muted" title="Website" style="text-decoration: none; font-size: 0.9rem;">
                <i class="fas fa-globe"></i>
              </a>
            {% endif %}
          </div>
        </div>
      </div>
      {% endfor %}
    </div>
  </section>
  {% endif %}
{% endfor %}
