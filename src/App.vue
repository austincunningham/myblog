<template>
  <div id="app">
    <div id="blank"> -- </div>
    <div class="ui grid container">
      <div class="ui floating success message" id=cookiemessage>
        <i class="close icon"></i>
        <div class="header">
          This site uses cookies
        </div>
        <p>This site uses cookies from Google to deliver its services and to analyse traffic. 
          Your IP address and user agent are shared with Google, 
          together with performance and security metrics, to ensure quality of service, 
          generate usage statistics and to detect and address abuse.
          <a href="https://policies.google.com/technologies/cookies"><strong>Learn More</strong></a>
        </p>
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
  <router-view></router-view>
  </div>
</template>

<!-- Global site tag (gtag.js) - Google Analytics -->

<script>


export default {
  name: 'app',
  components:{},
  onHover: false

}


</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  
}
#cookiemessage {
  max-width: 60vw;
  margin: 2rem auto;
}

</style>
