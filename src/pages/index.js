import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { ShieldCheck, ExternalLink, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import styles from './index.module.css';

const ACCENT = '#5EEAD4';
const IC = { size: 16, strokeWidth: 1.5, color: ACCENT };

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const avatarUrl = useBaseUrl('/img/avt.jpg');
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroInner}>

          {/* Left: text content */}
          <div className={styles.heroText}>
            <p className={styles.heroPrompt}>
              <span className={styles.promptCaret}>&gt;</span> init portfolio
            </p>
            <Heading as="h1" className={styles.heroName}>
              Phạm Trường Thiên Ân
            </Heading>
            <p className={styles.heroTagline}>
              <ShieldCheck size={15} strokeWidth={1.5} color={ACCENT} />
              &nbsp;{siteConfig.tagline}
            </p>
            <p className={styles.heroDesc}>
              Cybersecurity graduate (B.Sc. in Information Security, GPA 8.39/10) focused on SOC operations.
              Hands-on experience with <strong>Splunk</strong>, <strong>Wazuh</strong>, and <strong>Elastic Stack</strong> for
              SIEM monitoring, alert triage, and MITRE ATT&amp;CK-mapped detection engineering.
            </p>

            {/* Meta badges */}
            <div className={styles.metaRow}>
              <span className={styles.metaBadge}>
                <GraduationCap {...IC} /> UIT-VNU HCM
              </span>
              <span className={styles.metaBadge}>
                <MapPin {...IC} /> Ho Chi Minh City
              </span>
              <span className={styles.metaBadge}>
                <Briefcase {...IC} /> VNCS Global
              </span>
            </div>

            {/* CTAs */}
            <div className={styles.ctaRow}>
              <Link className={styles.ctaPrimary} to="/about">
                View Portfolio
              </Link>
              <Link className={styles.ctaSecondary} href="https://github.com/cavoinho158">
                <ExternalLink size={15} strokeWidth={1.5} /> GitHub
              </Link>
            </div>
          </div>

          {/* Right: avatar */}
          <div className={styles.heroAvatar}>
            <div className={styles.avatarRing}>
              <img src={avatarUrl} alt="Phạm Trường Thiên Ân" className={styles.avatar} />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="SOC Analyst Portfolio — Phạm Trường Thiên Ân | SIEM Monitoring, Detection Engineering, Cybersecurity">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
