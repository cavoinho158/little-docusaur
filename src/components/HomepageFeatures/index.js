import ConsolePanel from '@site/src/components/ConsolePanel';
import { ShieldCheck, Crosshair, Search } from 'lucide-react';
import styles from './styles.module.css';

const ICON_SIZE = 18;
const ICON_STROKE = 1.5;
const ICON_COLOR = '#5EEAD4';

const features = [
  {
    icon: <ShieldCheck size={ICON_SIZE} strokeWidth={ICON_STROKE} color={ICON_COLOR} />,
    title: 'soc-operations',
    label: 'SOC Operations & SIEM',
    desc: 'Alert triage, log correlation, and incident handling using Splunk, Wazuh/OSSEC, and the Elastic Stack (ELK). Experienced in tuning dashboards, reducing false-positive rates, and documenting analyst runbooks.',
    tags: ['Splunk', 'Wazuh', 'ELK Stack', 'SIEM', 'Alert Triage'],
  },
  {
    icon: <Crosshair size={ICON_SIZE} strokeWidth={ICON_STROKE} color={ICON_COLOR} />,
    title: 'detection-engineering',
    label: 'Detection Engineering',
    desc: 'Designing and validating detection rules mapped to MITRE ATT&CK — covering persistence, lateral movement, and C2 techniques. Focused on minimising noise while maintaining high-fidelity coverage.',
    tags: ['MITRE ATT&CK', 'Sigma Rules', 'Detection Rules', 'YARA'],
  },
  {
    icon: <Search size={ICON_SIZE} strokeWidth={ICON_STROKE} color={ICON_COLOR} />,
    title: 'dfir-forensics',
    label: 'IR & Digital Forensics',
    desc: 'Hands-on incident investigation and forensic analysis via CyberDefenders labs — memory forensics with Volatility 3, disk imaging with FTK Imager, network capture analysis with Wireshark.',
    tags: ['Volatility 3', 'FTK Imager', 'Wireshark', 'NetworkMiner', 'DFIR'],
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.sectionLabel}>// what i do</p>
        <div className={styles.grid}>
          {features.map((f, i) => (
            <ConsolePanel key={i} icon={f.icon} title={f.title}>
              <h3 className={styles.featureTitle}>{f.label}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <div className={styles.tags}>
                {f.tags.map((t, j) => (
                  <span key={j} className={styles.tag}>{t}</span>
                ))}
              </div>
            </ConsolePanel>
          ))}
        </div>
      </div>
    </section>
  );
}
