<template>
  <div class="ui container" style="padding: 2rem;">
    <h1 class="ui header">Privacy Policy</h1>
    <p><strong>Last updated:</strong> September 26, 2025</p>
    
    <h2 class="ui header">Introduction</h2>
    <p>Austin Cunningham ("we," "our," or "us") operates https://austincunningham.ddns.net (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>
    
    <h2 class="ui header">Information We Collect</h2>
    <h3>Analytics Data</h3>
    <p>With your consent, we use Google Analytics to collect information about how you use our website, including:</p>
    <ul>
      <li>Pages visited and time spent on pages</li>
      <li>Referral sources</li>
      <li>Device and browser information</li>
      <li>General geographic location (country/city level)</li>
    </ul>
    
    <h2 class="ui header">How We Use Information</h2>
    <p>We use the collected information to:</p>
    <ul>
      <li>Understand how visitors use our website</li>
      <li>Improve our content and user experience</li>
      <li>Generate usage statistics</li>
    </ul>
    
    <h2 class="ui header">Data Sharing</h2>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
    <ul>
      <li>Google Analytics (when you consent to analytics cookies)</li>
      <li>When required by law</li>
    </ul>
    
    <h2 class="ui header">Your Rights (GDPR)</h2>
    <p>If you are a resident of the European Union, you have the following rights:</p>
    <ul>
      <li><strong>Right to access:</strong> Request copies of your personal data</li>
      <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
      <li><strong>Right to erasure:</strong> Request deletion of your data</li>
      <li><strong>Right to withdraw consent:</strong> Withdraw cookie consent at any time</li>
    </ul>
    
    <h2 class="ui header">Cookie Management</h2>
    <p>You can manage your cookie preferences at any time by:</p>
    <ul>
      <li>Clearing your browser's localStorage for this site</li>
      <li>Using your browser's cookie settings</li>
      <li>The cookie banner will reappear allowing you to change preferences</li>
    </ul>
    
    <h2 class="ui header">Contact Us</h2>
    <p>If you have questions about this Privacy Policy, please contact us at:</p>
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
  name: "PrivacyPolicy",
  metaInfo: {
    title: 'Privacy Policy | Austin Cunningham\'s Blog',
    meta: [
      { name: 'description', content: 'Privacy Policy for Austin Cunningham\'s technical blog. Learn how we collect, use, and protect your data.' },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }
};
</script>

<style scoped>
.ui.container {
  max-width: 800px !important;
}
</style>
