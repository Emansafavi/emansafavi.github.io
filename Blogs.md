---
layout: empty
title: Blogs
permalink: /Blogs/
---

<section id="blog" class="container">
  <h1 class="page-title">Latest Posts</h1>

  <ul class="blog-grid">
    {% for post in site.posts %}
      <li class="blog-card">
  {%- assign thumb = post.thumbnail | default: post.image -%}
  {%- if thumb %}
    <figure class="thumb-wrapper">
      <img class="blog-thumb" src="{{ thumb | relative_url }}" alt="{{ post.title }}">
    </figure>
  {%- endif %}

  <header>
    <h2 class="blog-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <time class="blog-date" datetime="{{ post.date | date_to_xmlschema }}">
      {{ post.date | date: "%d&nbsp;%b&nbsp;%Y" }}
    </time>
  </header>

  <p class="blog-excerpt">
    {{ post.excerpt | strip_html | truncate: 140 }}
  </p>

  <footer>
    {% for category in post.categories %}
      <span class="blog-tag">{{ category }}</span>
    {% endfor %}
  </footer>
</li>
    {% endfor %}
  </ul>
</section>