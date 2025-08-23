import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogTitle,
  ogDescription
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} - TrustedLogos`;
    }

    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    // Update keywords
    if (keywords.length > 0) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        const currentKeywords = metaKeywords.getAttribute('content') || '';
        const newKeywords = `${currentKeywords}, ${keywords.join(', ')}`;
        metaKeywords.setAttribute('content', newKeywords);
      }
    }

    // Update Open Graph title
    if (ogTitle) {
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', `${ogTitle} - TrustedLogos`);
      }
    }

    // Update Open Graph description
    if (ogDescription) {
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) {
        ogDescMeta.setAttribute('content', ogDescription);
      }
    }

    // Update Twitter title
    if (ogTitle) {
      const twitterTitleMeta = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitleMeta) {
        twitterTitleMeta.setAttribute('content', `${ogTitle} - TrustedLogos`);
      }
    }

    // Update Twitter description
    if (ogDescription) {
      const twitterDescMeta = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescMeta) {
        twitterDescMeta.setAttribute('content', ogDescription);
      }
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }
  }, [title, description, keywords, canonical, ogTitle, ogDescription]);

  return null; // This component doesn't render anything
};

export default SEO;