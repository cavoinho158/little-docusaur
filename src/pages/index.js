import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const avatarUrl = useBaseUrl('/img/avt.jpg');
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <p className={styles.heroGreeting}>👋 Hi, I'm</p>
            <Heading as="h1" className="hero__title">
              Phạm Trường Thiên Ân
            </Heading>
            <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
              {siteConfig.tagline}
            </p>
            <p className={styles.heroDescription}>
              Cybersecurity graduate (B.Sc. in Information Security, GPA 8.39/10) focused on SOC operations.
              Hands-on experience with <strong>Splunk</strong>, <strong>Wazuh</strong>, and <strong>Elastic Stack</strong> for
              SIEM monitoring, alert triage, and MITRE ATT&amp;CK-mapped detection engineering.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/about">
                View My Portfolio 🛡️
              </Link>
            </div>
            <div className={styles.badges}>
              <span className={styles.badge}>🎓 UIT-VNU HCM</span>
              <span className={styles.badge}>📍 Ho Chi Minh City</span>
              <span className={styles.badge}>💼 VNCS Global</span>
            </div>
          </div>
          <div className={styles.heroImage}>
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
      title={`Hello from ${siteConfig.title}`}
      description="SOC Analyst Portfolio - Phạm Trường Thiên Ân | SIEM Monitoring, Detection Engineering, Cybersecurity">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
