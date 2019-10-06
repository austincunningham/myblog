<template>
<div class="bar">
    <div class="ui grid">
      <div class="five wide column"></div>
      <div class="six wide column">
        <a href="https://austincunningham.ddns.net">
          <button class="ui positive basic fluid button">
            <a class="item">Home <i class="home icon"></i> </a>
          </button>
        </a>
      </div>
      <div class="five wide column"></div>
    </div>
</div>
</template>
<script>

export default {
  name: 'Bar'
}

</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  text-align: center;
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
</style>
