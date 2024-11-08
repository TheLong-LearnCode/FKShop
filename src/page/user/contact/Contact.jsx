import React from 'react'
import "./Contact.css"
import '../../../util/GlobalStyle/GlobalStyle.css'

export default function Contact() {
  return (
    <div className="fixed-header">
      <div className='contact-container'>
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Get in touch with FKShop for any questions about our STEM kits.</p>
        </div>
        <div className="contact-content">
          <div className="contact-info ml-2 mr-2">
            <h2>Contact Information</h2>
            <p><i className="fas fa-map-marker-alt contact-info-icon"></i>Lot E2a-7, Road D1, D1 Street, Long Thanh My, Thu Duc City, Ho Chi Minh City</p>
            <p><i className="fas fa-phone contact-info-icon"></i>0344017063</p>
            <p><i className="fas fa-envelope contact-info-icon"></i>FKShop@gmail.com</p>
            <div className="social-media">
              <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <form className="contact-form ml-2 mr-2">
            <h2>Send us a message</h2>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Your Phone Number" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370124!2d106.80730807480579!3d10.841127589311634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1729430250818!5m2!1sen!2s" width="100%" height="450" style={{ border: '0', marginTop: '40px' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  )
}
