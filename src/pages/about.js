import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './about.module.css';

const skills = {
  'SOC & SIEM': ['Splunk Enterprise', 'Splunk ES', 'Wazuh/OSSEC', 'Elastic Stack'],
  'Detection & Monitoring': ['Sysmon', 'Windows Event Logs', 'MITRE ATT&CK', 'Sigma', 'Threat Hunting', 'Alert Triage'],
  'IR & Forensics': ['Wireshark', 'NetworkMiner', 'Volatility 3', 'FTK Imager', 'VirusTotal'],
  'Network & Security': ['Active Directory', 'IDS/IPS', 'Suricata', 'Zeek', 'pfSense', 'Nmap', 'Nessus'],
  'Scripting': ['Python', 'Bash', 'PowerShell'],
};

const experience = [
  {
    title: 'Cybersecurity Contributor (CTV)',
    company: 'VNCS Global',
    period: 'Jun 2026 – Present',
    location: 'Ho Chi Minh City, Vietnam',
    bullets: [
      'Participate in SOC operations, SIEM monitoring, alert analysis, incident investigation, and threat hunting using Splunk and Wazuh/Elastic Stack.',
      'Develop and validate MITRE ATT&CK-based detection use cases, correlating endpoint, authentication, and network telemetry to identify suspicious activity.',
      'Run attack simulations and PoC validation to assess detection coverage, tune detection rules, and reduce false positives.',
      'Work with Active Directory, Windows Event Logs, Sysmon, PowerShell, and IDS/IPS in practical SOC environments.',
    ],
  },
];

const projects = [
  {
    title: 'SOC Detection Engineering Lab — Splunk & MITRE ATT&CK',
    type: 'Personal Project',
    year: '2026',
    bullets: [
      'Built an Active Directory attack-simulation lab and deployed Splunk Enterprise as the SIEM, ingesting Windows Security Logs, Sysmon, and PowerShell telemetry.',
      'Developed ATT&CK-mapped detection use cases (PowerShell execution, LSASS access, lateral movement, persistence) and built CIM/tstats-based dashboards for attack-chain correlation.',
    ],
    tags: ['Splunk', 'Active Directory', 'MITRE ATT&CK', 'Sysmon', 'Detection Engineering'],
  },
  {
    title: 'CVE-to-Detection Security Research & PoC',
    type: 'Personal Project',
    year: '2026',
    bullets: [
      'Researched the workflow from CVE analysis to telemetry generation and detection development, using Sigma, Splunk SPL, and IDS/IPS signatures mapped to MITRE ATT&CK.',
    ],
    tags: ['Sigma', 'Splunk SPL', 'CVE Analysis', 'IDS/IPS', 'MITRE ATT&CK'],
  },
  {
    title: 'Endpoint Security, Malware Analysis & Digital Forensics',
    type: 'Personal Project',
    year: '2025',
    bullets: [
      'Built an endpoint security pipeline (OSSEC, ClamAV, ELK Stack) and practiced malware/forensic investigation via CyberDefenders using Wireshark, Volatility 3, and FTK Imager.',
    ],
    tags: ['OSSEC', 'ELK Stack', 'Wireshark', 'Volatility 3', 'FTK Imager', 'CyberDefenders'],
  },
];

const certifications = [
  {
    name: 'SOC Level 1 Learning Path',
    issuer: 'TryHackMe',
    year: '2026',
  },
  {
    name: 'Google Cybersecurity Professional Certificate',
    issuer: 'Coursera / Google',
    year: '2025',
  },
];

const thmBadges = [
  { name: 'Advanced Splunk', slug: 'advanced-splunk', url: 'https://tryhackme.com/thienanfa4869/badges/advanced-splunk' },
];

const cdCategories = [
  {
    name: 'Endpoint Forensics',
    icon: '💻',
    color: '#3b82f6',
    labs: [
      { name: 'KrakenKeylogger', difficulty: 'Medium' },
      { name: 'Silent Breach', difficulty: 'Medium' },
      { name: 'Amadey - APT-C-36', difficulty: 'Medium' },
      { name: 'RedLine', difficulty: 'Easy' },
      { name: 'The Crime', difficulty: 'Easy' },
      { name: 'Ramnit', difficulty: 'Easy' },
      { name: 'Insider', difficulty: 'Easy' },
      { name: 'Reveal', difficulty: 'Easy' },
    ],
  },
  {
    name: 'Network Forensics',
    icon: '🌐',
    color: '#10b981',
    labs: [
      { name: 'HawkEye', difficulty: 'Medium' },
      { name: 'Lockdown', difficulty: 'Easy' },
      { name: 'Web Investigation', difficulty: 'Easy' },
      { name: 'PacketDetective', difficulty: 'Easy' },
      { name: 'PsExec Hunt', difficulty: 'Easy' },
      { name: 'PoisonedCredentials', difficulty: 'Easy' },
      { name: 'WebStrike', difficulty: 'Easy' },
      { name: 'XLMRat', difficulty: 'Easy' },
      { name: 'Tomcat Takeover', difficulty: 'Easy' },
      { name: 'DanaBot', difficulty: 'Easy' },
    ],
  },
  {
    name: 'Threat Intel',
    icon: '🕵️',
    color: '#f59e0b',
    labs: [
      { name: 'PhishStrike', difficulty: 'Medium' },
      { name: 'Intel101', difficulty: 'Medium' },
      { name: 'Tusk Infostealer', difficulty: 'Easy' },
      { name: 'GrabThePhisher', difficulty: 'Easy' },
      { name: '3CX Supply Chain', difficulty: 'Easy' },
      { name: 'Red Stealer', difficulty: 'Easy' },
      { name: 'Lespion', difficulty: 'Easy' },
      { name: 'Yellow RAT', difficulty: 'Easy' },
      { name: 'Oski', difficulty: 'Easy' },
      { name: 'IcedID', difficulty: 'Easy' },
    ],
  },
  {
    name: 'Malware Analysis',
    icon: '🦠',
    color: '#ef4444',
    labs: [
      { name: 'XWorm', difficulty: 'Medium' },
      { name: 'FakeGPT', difficulty: 'Easy' },
    ],
  },
];

export default function About() {
  const avatarUrl = useBaseUrl('/img/avt.jpg');
  return (
    <Layout
      title="About Me | Phạm Trường Thiên Ân"
      description="SOC Analyst Portfolio - Phạm Trường Thiên Ân | Cybersecurity graduate specializing in SIEM, Detection Engineering, and Incident Response">
      <div className={styles.pageWrapper}>

        {/* Hero / Profile section */}
        <section className={styles.profileSection}>
          <div className={styles.profileBg} aria-hidden="true" />
          <div className="container">
            <div className={styles.profileCard}>

              {/* Avatar */}
              <div className={styles.profileAvatarWrap}>
                <img
                  src={avatarUrl}
                  alt="Phạm Trường Thiên Ân"
                  className={styles.profileAvatar}
                />
              </div>

              {/* Name + links */}
              <div className={styles.profileInfo}>
                <Heading as="h1" className={styles.profileName}>
                  Phạm Trường Thiên Ân
                </Heading>
                <p className={styles.profileTitle}>
                  🛡️ SOC Analyst | SIEM Monitoring | Detection Engineering
                </p>
                <p className={styles.profileLocation}>📍 Ho Chi Minh City, Vietnam</p>
                <div className={styles.profileLinks}>
                  <Link href="mailto:anphamtrth@gmail.com" className={styles.profileLink}>
                    ✉️ anphamtrth@gmail.com
                  </Link>
                  <Link href="https://github.com/cavoinho158" className={styles.profileLink}>
                    🐙 GitHub
                  </Link>
                  <Link href="https://www.linkedin.com/in/an-pham-truong-thien" className={styles.profileLink}>
                    💼 LinkedIn
                  </Link>
                </div>
              </div>

              {/* Stats panel */}
              <div className={styles.profileStats}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🎓</span>
                  <div>
                    <p className={styles.statValue}>8.39 / 10</p>
                    <p className={styles.statLabel}>GPA · UIT-VNU HCM</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>💼</span>
                  <div>
                    <p className={styles.statValue}>Jun 2026 – Now</p>
                    <p className={styles.statLabel}>SOC @ VNCS Global</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🔬</span>
                  <div>
                    <p className={styles.statValue}>30+ Labs</p>
                    <p className={styles.statLabel}>CyberDefenders · DFIR & Threat Intel</p>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>📜</span>
                  <div>
                    <p className={styles.statValue}>2 Certifications</p>
                    <p className={styles.statLabel}>TryHackMe SOC L1 · Google Cybersecurity</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Professional Summary */}
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>Professional Summary</Heading>
            <div className={styles.summaryCard}>
              <p>
                Cybersecurity graduate (<strong>B.Sc. in Information Security, GPA 8.39/10</strong>) focused on SOC operations.
                Hands-on experience with <strong>Splunk</strong>, <strong>Wazuh/OSSEC</strong>, and the <strong>Elastic Stack</strong> for
                SIEM monitoring, alert triage, and MITRE ATT&CK-mapped detection engineering, plus incident investigation
                and digital forensics in lab environments.
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className={clsx(styles.section, styles.altSection)}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>Professional Experience</Heading>
            {experience.map((exp, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineHeader}>
                  <div>
                    <Heading as="h3" className={styles.timelineTitle}>{exp.title}</Heading>
                    <p className={styles.timelineCompany}>{exp.company} · {exp.location}</p>
                  </div>
                  <span className={styles.timelinePeriod}>{exp.period}</span>
                </div>
                <ul className={styles.bulletList}>
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Key Projects */}
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>Key Projects</Heading>
            <div className={styles.projectGrid}>
              {projects.map((proj, idx) => (
                <div key={idx} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <Heading as="h3" className={styles.projectTitle}>{proj.title}</Heading>
                    <span className={styles.projectYear}>{proj.type} · {proj.year}</span>
                  </div>
                  <ul className={styles.bulletList}>
                    {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <div className={styles.tagRow}>
                    {proj.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section className={clsx(styles.section, styles.altSection)}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>Technical Skills</Heading>
            <div className={styles.skillsGrid}>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className={styles.skillCategory}>
                  <Heading as="h4" className={styles.skillCategoryTitle}>{category}</Heading>
                  <div className={styles.tagRow}>
                    {items.map((item, i) => (
                      <span key={i} className={styles.skillTag}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>Education & Certifications</Heading>
            <div className={styles.eduCard}>
              <div className={styles.timelineHeader}>
                <div>
                  <Heading as="h3" className={styles.timelineTitle}>
                    B.Sc. in Information Security
                  </Heading>
                  <p className={styles.timelineCompany}>University of Information Technology (VNU-HCM)</p>
                </div>
                <div className={styles.gpaBlock}>
                  <span className={styles.gpa}>GPA 8.39/10</span>
                  <span className={styles.timelinePeriod}>Oct 2022 – Mar 2026</span>
                </div>
              </div>
            </div>
            <div className={styles.certGrid}>
              {certifications.map((cert, idx) => (
                <div key={idx} className={styles.certCard}>
                  <span className={styles.certIcon}>🏅</span>
                  <div>
                    <p className={styles.certName}>{cert.name}</p>
                    <p className={styles.certIssuer}>{cert.issuer} · {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements & Practice Platforms */}
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>Achievements &amp; Practice</Heading>

            {/* ── TryHackMe ── */}
            <div className={styles.platformBlock}>
              <div className={styles.platformBlockHeader}>
                <span className={styles.platformIcon}>🟥</span>
                <div>
                  <Heading as="h3" className={styles.platformTitle}>TryHackMe</Heading>
                  <p className={styles.platformSub}>
                    <strong>thienanfa4869</strong> · SOC Level 1 Learning Path (2026)
                  </p>
                </div>
                <Link href="https://tryhackme.com/p/thienanfa4869" className={styles.platformLinkBtn}>
                  View Profile ↗
                </Link>
              </div>
              <div className={styles.thmBadgeRow}>
                <p className={styles.badgeRowLabel}>🏅 Earned Badges</p>
                <div className={styles.thmBadgeChips}>
                  {thmBadges.map((b, i) => (
                    <Link key={i} href={b.url} className={styles.thmBadgeChip}>
                      <span className={styles.thmBadgeChipIcon}>🎖️</span>
                      <span>{b.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CyberDefenders ── */}
            <div className={styles.platformBlock}>
              <div className={styles.platformBlockHeader}>
                <span className={styles.platformIcon}>🔵</span>
                <div>
                  <Heading as="h3" className={styles.platformTitle}>CyberDefenders</Heading>
                  <p className={styles.platformSub}>
                    <strong>thienanfa4869</strong> · {cdCategories.reduce((acc, c) => acc + c.labs.length, 0)} labs completed
                  </p>
                </div>
                <Link href="https://cyberdefenders.org/p/thienanfa4869" className={styles.platformLinkBtn}>
                  View Profile ↗
                </Link>
              </div>
              <div className={styles.cdGrid}>
                {cdCategories.map((cat, ci) => (
                  <div key={ci} className={styles.cdCategoryCard} style={{'--cat-color': cat.color}}>
                    <div className={styles.cdCategoryHeader}>
                      <span className={styles.cdCategoryIcon}>{cat.icon}</span>
                      <span className={styles.cdCategoryName}>{cat.name}</span>
                      <span className={styles.cdCategoryCount}>{cat.labs.length} labs</span>
                    </div>
                    <div className={styles.cdLabList}>
                      {cat.labs.map((lab, li) => (
                        <div key={li} className={styles.cdLabItem}>
                          <span className={styles.cdLabName}>{lab.name}</span>
                          <span className={lab.difficulty === 'Medium'
                            ? styles.diffMedium
                            : styles.diffEasy}>
                            {lab.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
