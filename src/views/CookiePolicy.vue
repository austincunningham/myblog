<template>
  <div class="ui container" style="padding: 2rem;">
    <h1 class="ui header">Cookie Policy</h1>
    <p><strong>Last updated:</strong> September 26, 2025</p>
    
    <h2 class="ui header">What Are Cookies</h2>
    <p>Cookies are small text files that are placed on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.</p>
    
    <h2 class="ui header">Types of Cookies We Use</h2>
    
    <h3 class="ui header">Essential Cookies (Always Active)</h3>
    <p>These cookies are necessary for the website to function properly and cannot be disabled.</p>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Cookie/Storage Name</th>
          <th>Purpose</th>
          <th>Duration</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>cookieConsent</td>
          <td>Stores your cookie preferences</td>
          <td>Until manually cleared</td>
          <td>localStorage</td>
        </tr>
        <tr>
          <td>sessionStorage.redirect</td>
          <td>GitHub Pages routing for single-page app</td>
          <td>Browser session</td>
          <td>sessionStorage</td>
        </tr>
      </tbody>
    </table>
    
    <h3 class="ui header">Analytics Cookies (Optional)</h3>
    <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Cookie Name</th>
          <th>Purpose</th>
          <th>Duration</th>
          <th>Provider</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>_ga</td>
          <td>Distinguishes unique users</td>
          <td>2 years</td>
          <td>Google Analytics</td>
        </tr>
        <tr>
          <td>_ga_*</td>
          <td>Maintains session state</td>
          <td>2 years</td>
          <td>Google Analytics</td>
        </tr>
        <tr>
          <td>_gid</td>
          <td>Distinguishes unique users</td>
          <td>24 hours</td>
          <td>Google Analytics</td>
        </tr>
      </tbody>
    </table>
    
    <h2 class="ui header">Managing Cookies</h2>
    <p>You can control cookies in several ways:</p>
    
    <h3>Through Our Cookie Banner</h3>
    <ul>
      <li>Accept or reject analytics cookies when you first visit</li>
      <li>Change your preferences using the "Cookie Settings" link</li>
    </ul>
    
    <h3>Through Your Browser</h3>
    <ul>
      <li><strong>Chrome:</strong> Settings > Privacy and Security > Cookies</li>
      <li><strong>Firefox:</strong> Settings > Privacy & Security > Cookies</li>
      <li><strong>Safari:</strong> Preferences > Privacy > Cookies</li>
      <li><strong>Edge:</strong> Settings > Cookies and site permissions</li>
    </ul>
    
    <h3>Reset Cookie Preferences</h3>
    <p>To reset your cookie preferences for this site:</p>
    <ol>
      <li>Clear your browser's localStorage for this domain</li>
      <li>Refresh the page - the cookie banner will reappear</li>
      <li>Make your new selections</li>
    </ol>
    
    <h2 class="ui header">Third-Party Cookies</h2>
    <p>We use Google Analytics, which may set third-party cookies. You can learn more about Google's privacy practices at <a href="https://policies.google.com/privacy" target="_blank">Google Privacy Policy</a>.</p>
    
    <h2 class="ui header">Updates to This Policy</h2>
    <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
    
    <h2 class="ui header">Contact Us</h2>
    <p>If you have questions about our use of cookies, please contact us:</p>
    <ul>
      <li>GitHub: <a href="https://github.com/austincunningham">@austincunningham</a></li>
      <li>Twitter: <a href="https://twitter.com/auscunningham">@auscunningham</a></li>
    </ul>
    
    <div style="margin-top: 2rem;">
      <router-link to="/" class="ui button">← Back to Blog</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "CookiePolicy",
  metaInfo: {
    title: 'Cookie Policy | Austin Cunningham\'s Blog',
    meta: [
      { name: 'description', content: 'Cookie Policy for Austin Cunningham\'s technical blog. Learn about the cookies we use and how to manage them.' },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }
};
</script>

<style scoped>
.ui.container {
  max-width: 800px !important;
}
table {
  margin: 1rem 0;
}
</style>
