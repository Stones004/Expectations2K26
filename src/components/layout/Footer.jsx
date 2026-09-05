import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/constants';

const developers = [
  {
    name: 'Aashi',
    role: 'Developer',
    github: 'https://github.com/ashlex1511',
  },
  {
    name: 'Chethan',
    role: 'Developer',
    github: 'https://github.com/Cheth618',
  },
  {
    name: 'Dipayan Roy',
    role: 'Developer',
    github: 'https://github.com/dipayanroy049-rgb',
  },
  {
    name: 'Monish',
    role: 'Developer',
    github: 'https://github.com/monish-M-07',
  },
  {
    name: 'Prajwal Murali',
    role: 'Developer',
    github: 'https://github.com/PrajwalMurali',
  },

  {
    name: 'Darren',
    role: 'Developer',
    github: 'https://github.com/Stones004',
  },

  // Add more developers here
  // {
  //   name: 'Developer Name',
  //   role: 'Developer',
  //   github: 'https://github.com/username',
  // },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ==================================================
          BRANDING
          ================================================== */}

      <div className="footer-branding">

        <div className="footer-logos">

          {/* Replace these paths with your existing logo paths */}

          <img
            src="/assets/expectations-logo.png"
            alt="Expectations 2K26"
            className="footer-expectations-logo"
          />

          <img
            src="/assets/christ-logo.png"
            alt="CHRIST (Deemed to be University)"
            className="footer-christ-logo"
          />

        </div>


        <div className="footer-tagline">

          <div className="footer-tagline-title">
            <span>The Odyssey</span>
            <i>✦</i>
          </div>

          <div className="footer-tagline-voyage">
            <span className="voyage-word">Navigating</span>
            <span className="voyage-connector">the</span>
            <span className="voyage-word">Seas</span>
            <span className="voyage-connector">of</span>
            <span className="voyage-word">Data</span>
          </div>

          <div className="footer-wave">
            <span></span>
          </div>

        </div>


        <div className="footer-department">
          Department of Statistics and Data Science
          <span>|</span>
          CHRIST (Deemed to be University)
        </div>

      </div>


      {/* ==================================================
          SOCIAL LINKS
          ================================================== */}

      <div className="footer-socials">

        <a
          href="https://www.instagram.com/expectations.26_cu?igsh=MTh5M3gyaDQ2eDRkbQ=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="footer-social"
        >
          <span>◎</span>
        </a>

        <a
          href="https://www.linkedin.com/in/statistics-datascience-christuniversity?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="footer-social"
        >
          <span>in</span>
        </a>

        <a
          href="mailto:expectations@fest.christuniversity.in"
          aria-label="Email"
          className="footer-social"
        >
          <span>✉</span>
        </a>

      </div>


      {/* ==================================================
          DEVELOPER CREW
          ================================================== */}

      <div className="footer-devs">

        <div className="footer-dev-label">
          <span>THE CREW</span>
          <small>Meet the crew behind the voyage</small>
        </div>


        <div className="developer-trail">

          <div className="developer-trail-line" />

          {developers.map((developer, index) => (

            <div
              className="developer-dot-wrapper"
              key={developer.name}
            >

              <button
                type="button"
                className="developer-dot"
                aria-label={`View ${developer.name}`}
              />


              <div className="developer-tooltip">

                <span className="developer-tooltip-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <strong>
                  {developer.name}
                </strong>

                <small>
                  {developer.role}
                </small>

                {developer.github ? (
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noreferrer"
                    className="developer-github"
                  >
                    GitHub ↗
                  </a>
                ) : (
                  <span className="developer-github disabled">
                    GitHub
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </footer>
  );
}
