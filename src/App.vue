<template>
  <div id="app">
    <div id="blank"> -- </div>
    <div class="ui grid container">
      <!-- GDPR Cookie Consent Banner -->
      <div class="ui floating message" id="cookieBanner" v-show="showCookieBanner" style="position: fixed; bottom: 20px; right: 20px; max-width: 400px; z-index: 1000; background: #2c3e50; color: white;">
        <div class="header" style="color: white; margin-bottom: 10px;">
          🍪 Cookie Consent
        </div>
        <p style="font-size: 14px; margin-bottom: 15px;">
          We use cookies to enhance your experience and analyze site traffic. You can choose which cookies to accept.
        </p>
        
        <!-- Cookie Categories -->
        <div style="margin-bottom: 15px;">
          <div style="margin-bottom: 8px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" checked disabled style="margin-right: 8px;">
              <span style="font-size: 13px;"><strong>Essential</strong> - Required for site functionality</span>
            </label>
          </div>
          <div style="margin-bottom: 8px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" v-model="analyticsConsent" style="margin-right: 8px;">
              <span style="font-size: 13px;"><strong>Analytics</strong> - Google Analytics for usage statistics</span>
            </label>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button @click="acceptSelected" class="ui small green button" style="flex: 1; min-width: 100px;">
            Accept Selected
          </button>
          <button @click="acceptAll" class="ui small primary button" style="flex: 1; min-width: 100px;">
            Accept All
          </button>
          <button @click="rejectAll" class="ui small button" style="flex: 1; min-width: 100px; background: #e74c3c; color: white;">
            Reject All
          </button>
        </div>
        
        <div style="margin-top: 10px; text-align: center;">
          <a href="/privacy-policy" style="color: #3498db; font-size: 12px;">Privacy Policy</a> |
          <a href="/cookie-policy" style="color: #3498db; font-size: 12px;">Cookie Policy</a> |
          <button @click="showSettings = !showSettings" style="background: none; border: none; color: #3498db; font-size: 12px; cursor: pointer; text-decoration: underline;">
            Cookie Settings
          </button>
        </div>
      </div>

      <!-- Cookie Settings Modal -->
      <div v-show="showSettings" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1001; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 30px; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
          <h3>Cookie Settings</h3>
          <p>Manage your cookie preferences below:</p>
          
          <div style="margin-bottom: 20px;">
            <h4>Essential Cookies (Required)</h4>
            <p style="font-size: 14px; color: #666;">These cookies are necessary for the website to function and cannot be switched off.</p>
            <label style="display: flex; align-items: center;">
              <input type="checkbox" checked disabled style="margin-right: 8px;">
              Site functionality, security, and session management
            </label>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h4>Analytics Cookies</h4>
            <p style="font-size: 14px; color: #666;">These help us understand how visitors interact with our website.</p>
            <label style="display: flex; align-items: center;">
              <input type="checkbox" v-model="analyticsConsent" style="margin-right: 8px;">
              Google Analytics - Usage statistics and site improvement
            </label>
          </div>
          
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button @click="showSettings = false" class="ui button">Cancel</button>
            <button @click="saveSettings" class="ui primary button">Save Settings</button>
          </div>
        </div>
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
  data() {
    return {
      showCookieBanner: false,
      showSettings: false,
      analyticsConsent: false,
      onHover: false
    }
  },
  mounted() {
    this.checkCookieConsent();
  },
  methods: {
    checkCookieConsent() {
      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        this.showCookieBanner = true;
      } else {
        const consentData = JSON.parse(consent);
        this.analyticsConsent = consentData.analytics || false;
        this.loadAnalyticsIfConsented();
      }
    },
    
    acceptAll() {
      this.analyticsConsent = true;
      this.saveConsent();
      this.loadGoogleAnalytics();
    },
    
    acceptSelected() {
      this.saveConsent();
      if (this.analyticsConsent) {
        this.loadGoogleAnalytics();
      }
    },
    
    rejectAll() {
      this.analyticsConsent = false;
      this.saveConsent();
    },
    
    saveSettings() {
      this.saveConsent();
      this.showSettings = false;
      if (this.analyticsConsent) {
        this.loadGoogleAnalytics();
      }
    },
    
    saveConsent() {
      const consentData = {
        analytics: this.analyticsConsent,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('cookieConsent', JSON.stringify(consentData));
      this.showCookieBanner = false;
    },
    
    loadAnalyticsIfConsented() {
      if (this.analyticsConsent) {
        this.loadGoogleAnalytics();
      }
    },
    
    loadGoogleAnalytics() {
      // Only load if not already loaded
      if (!window.gtag) {
        // Load Google Analytics
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=UA-138297422-1';
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-138297422-1');
        `;
        document.head.appendChild(script2);
      }
    }
  }
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
