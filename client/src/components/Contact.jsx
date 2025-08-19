import React, { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions about Website Scanner? We're here to help you optimize your SEO strategy.</p>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-form-section centered-form">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="inquiryType">Inquiry Type</label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                >
                  <option value="general">General Question</option>
                  <option value="technical">Technical Support</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="business">Business Inquiry</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Please provide details about your question or request..."
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="form-success">
                  <div className="success-icon">✅</div>
                  <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-error">
                  <div className="error-icon">❌</div>
                  <div>
                    <h4>Failed to Send Message</h4>
                    <p>There was an error sending your message. Please try again or contact us directly.</p>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="send-icon">📧</span>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions about Website Scanner</p>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is Website Scanner really free?</h4>
              <p>Yes! Our basic SEO analysis is completely free with no hidden fees. We believe every website deserves good SEO, regardless of budget.</p>
            </div>

            <div className="faq-item">
              <h4>How accurate are the SEO scores?</h4>
              <p>Our scores are based on current SEO best practices and Google's ranking factors. While no tool is 100% perfect, our analysis covers the most important factors that impact search rankings.</p>
            </div>

            <div className="faq-item">
              <h4>Can I analyze private/password-protected sites?</h4>
              <p>Currently, our tool can only analyze publicly accessible websites. For private sites, you'll need to make them temporarily public or contact us for enterprise solutions.</p>
            </div>

            <div className="faq-item">
              <h4>How often should I check my SEO score?</h4>
              <p>We recommend checking your SEO score monthly, or whenever you make significant changes to your website. This helps track improvements over time.</p>
            </div>

            <div className="faq-item">
              <h4>Do you offer SEO consulting services?</h4>
              <p>While Website Scanner is primarily a self-service tool, we do offer consulting for complex SEO projects. Contact us to discuss your specific needs.</p>
            </div>

            <div className="faq-item">
              <h4>Can I white-label this tool for my clients?</h4>
              <p>Yes! We offer white-label solutions for agencies and freelancers. Contact our business team to learn about custom branding options.</p>
            </div>

            <div className="faq-item">
              <h4>What's the difference between SEO and Site Speed analysis?</h4>
              <p>SEO analysis focuses on content, structure, and technical factors that affect search rankings. Site Speed analysis measures loading performance and user experience metrics.</p>
            </div>

            <div className="faq-item">
              <h4>Do you store or share my website data?</h4>
              <p>We respect your privacy. We only temporarily cache analysis results and never share your data with third parties. Check our privacy policy for full details.</p>
            </div>

            <div className="faq-item">
              <h4>Can I get historical data and tracking?</h4>
              <p>Currently, our free tool provides point-in-time analysis. For historical tracking and trend analysis, contact us about our premium monitoring solutions.</p>
            </div>

            <div className="faq-item">
              <h4>What browsers and devices are supported?</h4>
              <p>Website Scanner works on all modern browsers including Chrome, Firefox, Safari, and Edge. Our tool is mobile-friendly and works on tablets and smartphones.</p>
            </div>

            <div className="faq-item">
              <h4>How can I integrate this with my existing workflow?</h4>
              <p>We offer API access and integrations with popular tools. Contact our technical team to discuss integration options for your workflow.</p>
            </div>

            <div className="faq-item">
              <h4>What if I need help implementing the recommendations?</h4>
              <p>Our documentation provides step-by-step guides for most fixes. For complex issues, consider consulting with an SEO professional or contact us for referrals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}