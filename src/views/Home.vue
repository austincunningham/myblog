<template>
  <div class="Home">
    <div class="ui container">
      <br>
      <div class="ui raised segment">
        <img class="ui centered tiny circular image" src="../assets/me.png" />

        <div class="twelve wide column">
          <h2 class="ui centered aligned header">Austin Cunningham</h2>
          <h3 class="ui centered aligned header">
            Software Engineer at Red Hat
          </h3>

          <h5 class="ui centered aligned header">
            <a href="https://github.com/austincunningham">
              <i class="big github icon"></i>
            </a>
            <a href="https://twitter.com/auscunningham">
              <i class="big twitter icon"></i>
            </a>
            <a href="https://www.linkedin.com/in/austin-cunningham-90365729/">
              <i class="big linkedin icon"></i>
            </a>
            <a href="https://medium.com/@auscunningham">
              <i class="big medium icon"></i>
            </a>
            <a href="https://austin-cunningham.surge.sh/">
              <i class="big edit outline icon"></i>
            </a>
          </h5>
        </div>

      </div>
    </div>
    <div class="ui container">
      <div class="sections">
        <div
          v-for="(section, index) in sort(Object.keys(entries))"
          :key="index"
          class="group"
        >
          <br />
          <div class="ui raised segment">
            <div class="ui accordion">
              <div class="active title">
                <h2 class="center">
                  <i class="dropdown icon"></i>
                  {{ section }} Blogs
                </h2>
              </div>
              <div class="active content">
                <div
                  class="section"
                  v-for="entry in sort(entries[section])"
                  :key="entry.id"
                >
                  <div class="ui raised segment">
                    <div
                      class="entry"
                      v-on:mouseover="onHover = true"
                      v-on:mouseleave="onHover = false"
                    >
                      <h3 @click="$router.push({ name: entry.id })">
                        <img
                          class="ui large image"
                          v-bind:src="`/images/${entry.id}.png`"
                        />
                        {{ entry.image }}
                        <i class="linkify icon"></i>
                        {{ entry.title }}
                        <span class="subtitle">....({{ entry.date }})</span>
                      </h3>
                      <p>{{ entry.description }}</p>
                    </div>
                  </div>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
      <!-- <div class="two wide column"></div> -->
    </div>
    <script type="application/javascript" defer language="javascript">
      (function () {
        $(document).ready(function () {
          $(".ui.accordion").accordion();
          $(".basic.test.modal")
            .modal("setting", "closable", false)
            .modal("show");
          $(".message .close").on("click", function () {
            $(this).closest(".message").transition("fade");
          });
        });
      })();
    </script>
  </div>
</template>

<script>
import BLOGENTRIES from "../static/bloglist.json";

export default {
  name: "Home",
  computed: {
    entries() {
      return BLOGENTRIES;
    },
  },
  methods: {
    mouseOver: function () {
      this.active = !this.active;
    },
    sort: function (arr) {
      return arr.slice().reverse();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0px 0 0;
  color: #42b883;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.entry {
  cursor: pointer;
}
</style>
