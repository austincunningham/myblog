<template>
  <div class="blog">
    <router-view></router-view>
      <script type="application/javascript" defer src="https://giscus.app/client.js"
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
        async>
  </script>
  </div>
</template>
<script>

export default {
  name: 'Blog',

}
</script>



<style lang="scss" scoped>
.blog {
  max-width: 60vw;
  margin: 2rem auto;
  .back {
    background-color: #42b883;
    color: white;
    margin-top: 5rem;
    text-decoration: none;
    padding: 10px 15px;
    border: 1px solid currentColor;
    border-radius: .5rem;
    display: inline-block;
    transition: all .3s ease;
    &:hover {
      background-color: transparent;
      color: #42b883;
    }
  }
  /deep/ {
    h1 {
      font-size: 3rem;
      margin-bottom: .2rem;
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
      border-radius: .7rem;
      padding: 1rem;
    }
    img[src$="centerme"] {
      display:block;
      margin: 0 auto;
    }
    img {
      max-width: 100%;
    }
  }
}
</style>