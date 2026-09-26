import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '🛡️ SOC Operations & SIEM',
    emoji: '📊',
    description: (
      <>
        Experienced with <strong>Splunk Enterprise/ES</strong>, <strong>Wazuh/OSSEC</strong>, and <strong>Elastic Stack</strong> for
        real-time monitoring, alert triage, and incident investigation in SOC environments.
        Currently contributing to SOC operations at <strong>VNCS Global</strong>.
      </>
    ),
  },
  {
    title: '⚔️ Detection Engineering',
    emoji: '🎯',
    description: (
      <>
        Builds <strong>MITRE ATT&CK-mapped</strong> detection use cases correlating endpoint,
        authentication, and network telemetry. Proficient with <strong>Sigma rules</strong>,
        Splunk SPL, and IDS/IPS signatures. Runs attack simulations to validate and tune detections.
      </>
    ),
  },
  {
    title: '🔍 IR & Digital Forensics',
    emoji: '🧩',
    description: (
      <>
        Practiced incident response and malware analysis via <strong>CyberDefenders</strong> using
        <strong> Wireshark</strong>, <strong>Volatility 3</strong>, <strong>FTK Imager</strong>, and
        NetworkMiner. Built an endpoint security pipeline with OSSEC, ClamAV, and ELK Stack.
      </>
    ),
  },
];

function Feature({emoji, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card', styles.featureCard)}>
        <div className={styles.featureEmoji}>{emoji}</div>
        <div className="card__body">
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDesc}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>What I Do</Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
