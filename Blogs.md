---
layout: empty
title: Blogs
permalink: /Blogs/
---

<section id="blog" class="container">
  <h2>Recent Posts</h2>
<div class="blog-gallery">
  {% for post in site.posts %}
    <article class="blog-post card">
      <h2 class="blog-title">
        <a href="{{ post.url | relative_url }}" target="_blank">{{ post.title }}</a>
      </h2>
      <p class="blog-excerpt">{{ post.excerpt }}</p>
      <span class="blog-date">{{ post.date | date: "%Y-%m-%d" }}</span>
      <span class="blog-tag">{{ post.categories | join: ', ' }}</span>
    </article>
  {% endfor %}
  </div>
</section>