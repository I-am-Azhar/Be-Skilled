// Simple analytics tracking utility
// Can be extended to integrate with GA4, Mixpanel, or other analytics providers

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];

  // Track an event
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }

    // Send to external analytics service
    this.sendToExternalService(analyticsEvent);
  }

  // Send to external analytics service (placeholder)
  private sendToExternalService(event: AnalyticsEvent) {
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, event.properties);
    }

    // Example: Send to custom API endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(console.error);
    }
  }

  // Get all events (for debugging)
  getEvents() {
    return this.events;
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Convenience functions for common events
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

// Specific event tracking functions
export const trackHeroCTA = (ctaType: 'primary' | 'secondary') => {
  trackEvent('hero_cta_click', { cta_type: ctaType });
};

export const trackSearch = (query: string, resultsCount?: number) => {
  trackEvent('search_submit', { 
    query, 
    results_count: resultsCount,
    query_length: query.length 
  });
};

export const trackCourseCardClick = (courseId: string, placement: string) => {
  trackEvent('course_card_click', { 
    course_id: courseId, 
    placement 
  });
};

export const trackCategoryClick = (category: string) => {
  trackEvent('category_pill_click', { category });
};

export const trackFeaturedRowClick = (rowName: string, courseId: string) => {
  trackEvent('featured_row_item_click', { 
    row_name: rowName, 
    course_id: courseId 
  });
};

export const trackLeadSubmit = (success: boolean, error?: string) => {
  trackEvent('lead_submit', { 
    success, 
    error: error || null 
  });
};

export const trackWhatsAppCTA = (placement: string) => {
  trackEvent('whatsapp_cta_click', { placement });
};

export const trackTestimonialSlide = (slideIndex: number) => {
  trackEvent('testimonial_slide_change', { slide_index: slideIndex });
};

export const trackFAQToggle = (question: string, isOpen: boolean) => {
  trackEvent('faq_toggle', { 
    question, 
    is_open: isOpen 
  });
};



