import React, { useState } from 'react';
import '../css/styles.css'; 
import githubLogo from '../images/GitHub.png';
import linkedinLogo from '../images/LinkedIn.png';

function Contact() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailData = {
      email: email,
      subject: subject,
      text: message,
    };

    try {
      const response = await fetch('http://localhost:8080/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert('Email sent successfully! I will get back to you in 1-2 days.');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the email.');
    }
  };

  return (
    <div className="contact">
      <h1>Contact me!</h1>
      <p>Thank you for your interest in getting in touch!</p>
      <p>
        I value transparency and encourage open communication.
        <p>If you have any questions, feedback or collaboration ideas,</p>
        <p>feel free to reach out through the contact form.</p>
        <p>I’d especially appreciate it if you let me know about any errors or suggestions for improvement!</p>
      </p>

      <div className="socials">
        <a href="https://www.linkedin.com/in/ssigdel5/" target="_blank" rel="noopener noreferrer">
          <button>
            <img src={linkedinLogo} alt="LinkedIn"/>
          </button>
        </a>
        <a href="https://github.com/s1gdel" target="_blank" rel="noopener noreferrer">
          <button>
            <img src={githubLogo} alt="GitHub"/>
          </button>
        </a>
      </div>

      <div className="message">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" id="button">SEND</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;