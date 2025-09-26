<template>
  <div class="blog">
    <router-view></router-view>
    <script
      type="application/javascript"
      defer
      src="https://giscus.app/client.js"
      data-repo="austincunningham/myblog"
      data-repo-id="MDEwOlJlcG9zaXRvcnkxODA0NDcxMTA="
      data-category="General"
      data-category-id="DIC_kwDOCsFnhs4CPxav"
      data-mapping="pathname"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      data-theme="dark_dimmed"
      data-lang="en"
      data-loading="lazy"
      crossorigin="anonymous"
      async
    ></script>
  </div>
</template>
<script>
import BLOGENTRIES from "../static/bloglist.json";

export default {
  name: "Blog",
  metaInfo() {
    const currentRoute = this.$route.name;
    const currentPath = this.$route.path;
    
    // Extract year and post ID from path like "/2025/ollama-python"
    const pathParts = currentPath.split('/').filter(part => part);
    const currentYear = pathParts[0];
    const postId = pathParts[1] || currentRoute;
    
    // Find the blog post in our data
    let blogPost = null;
    if (currentYear && BLOGENTRIES[currentYear]) {
      blogPost = BLOGENTRIES[currentYear].find(post => post.id === postId);
    }
    
    console.log('Debug meta info:', { currentRoute, currentPath, currentYear, postId, blogPost });
    
    if (blogPost) {
      return {
        title: `${blogPost.title} | Austin Cunningham's Blog`,
        meta: [
          { name: 'description', content: blogPost.description },
          { name: 'keywords', content: `${blogPost.title.toLowerCase()}, kubernetes, openshift, devops, tutorial` },
          { property: 'og:title', content: blogPost.title },
          { property: 'og:description', content: blogPost.description },
          { property: 'og:image', content: `https://austincunningham.ddns.net/images/${blogPost.id}.png` },
          { property: 'og:url', content: `https://austincunningham.ddns.net/${currentYear}/${blogPost.id}` },
          { property: 'og:type', content: 'article' },
          { property: 'article:published_time', content: blogPost.date },
          { property: 'article:author', content: 'Austin Cunningham' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:creator', content: '@auscunningham' },
          { name: 'twitter:title', content: blogPost.title },
          { name: 'twitter:description', content: blogPost.description },
          { name: 'twitter:image', content: `https://austincunningham.ddns.net/images/${blogPost.id}.png` }
        ],
        script: [
          {
            type: 'application/ld+json',
            json: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": blogPost.title,
              "description": blogPost.description,
              "image": `https://austincunningham.ddns.net/images/${blogPost.id}.png`,
              "author": {
                "@type": "Person",
                "name": "Austin Cunningham",
                "url": "https://austincunningham.ddns.net",
                "sameAs": [
                  "https://github.com/austincunningham",
                  "https://twitter.com/auscunningham",
                  "https://www.linkedin.com/in/austin-cunningham-90365729/"
                ]
              },
              "publisher": {
                "@type": "Person",
                "name": "Austin Cunningham",
                "url": "https://austincunningham.ddns.net"
              },
              "datePublished": blogPost.date,
              "dateModified": blogPost.date,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://austincunningham.ddns.net/${currentYear}/${blogPost.id}`
              },
              "keywords": `${blogPost.title.toLowerCase()}, kubernetes, openshift, devops, tutorial`
            }
          }
        ]
      };
    }
    
    return {
      title: 'Austin Cunningham\'s Blog - Tech Tutorials and Guides',
      meta: [
        { name: 'description', content: 'Technical blog covering Kubernetes, OpenShift, DevOps, and software development tutorials.' }
      ]
    };
  }
};
</script>



<style lang="scss" scoped>
.blog {
  max-width: 85vw;
  margin: 2rem auto;
  .back {
    background-color: #42b883;
    color: white;
    margin-top: 5rem;
    text-decoration: none;
    padding: 10px 15px;
    border: 1px solid currentColor;
    border-radius: 0.5rem;
    display: inline-block;
    transition: all 0.3s ease;
    &:hover {
      background-color: transparent;
      color: #42b883;
    }
  }
  /deep/ {
    h1 {
      font-size: 3rem;
      margin-bottom: 0.2rem;
      color: #42b883;
    }
    h4 {
      margin-bottom: 3rem;
      color: #35495e;
    }
    pre {
      overflow-x: auto;
      background-color: #35495e;
      color: white;
      border-radius: 0.7rem;
      padding: 1rem;
    }
    img[src$="centerme"] {
      display: block;
      margin: 0 auto;
    }
    img {
      max-width: 100%;
    }
  }
}
</style>