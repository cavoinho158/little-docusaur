import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ConsolePanel from '@site/src/components/ConsolePanel';
import {
  ShieldCheck, Crosshair, Search, FlaskConical,
  GraduationCap, MapPin, Briefcase, Mail, ExternalLink, Link2,
  Award, Monitor, Wifi, Cpu, Terminal, Network,
} from 'lucide-react';
import styles from './about.module.css';

const ACCENT = '#5EEAD4';
const IC = { size: 15, strokeWidth: 1.5, color: ACCENT };
const IC18 = { size: 18, strokeWidth: 1.5, color: ACCENT };

/* ── Data ──────────────────────────────────────────────── */
const skills = {
  'SOC & SIEM': ['Splunk Enterprise', 'Splunk ES', 'Wazuh/OSSEC', 'Elastic Stack'],
  'Detection & Monitoring': ['Sysmon', 'Windows Event Logs', 'MITRE ATT&CK', 'Sigma', 'Threat Hunting', 'Alert Triage'],
  'IR & Forensics': ['Wireshark', 'NetworkMiner', 'Volatility 3', 'FTK Imager', 'VirusTotal'],
  'Network & Security': ['Active Directory', 'IDS/IPS', 'Suricata', 'Zeek', 'pfSense', 'Nmap', 'Nessus'],
  'Scripting': ['Python', 'Bash', 'PowerShell'],
};

const skillIcons = {
  'SOC & SIEM': <Monitor {...IC18} />,
  'Detection & Monitoring': <Crosshair {...IC18} />,
  'IR & Forensics': <Search {...IC18} />,
  'Network & Security': <Network {...IC18} />,
  'Scripting': <Terminal {...IC18} />,
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
    type: 'personal-project',
    year: '2026',
    bullets: [
      'Built an Active Directory attack-simulation lab and deployed Splunk Enterprise as the SIEM, ingesting Windows Security Logs, Sysmon, and PowerShell telemetry.',
      'Developed ATT&CK-mapped detection use cases (PowerShell execution, LSASS access, lateral movement, persistence) and built CIM/tstats-based dashboards for attack-chain correlation.',
    ],
    tags: ['Splunk', 'Active Directory', 'MITRE ATT&CK', 'Sysmon', 'Detection Engineering'],
  },
  {
    title: 'CVE-to-Detection Security Research & PoC',
    type: 'personal-project',
    year: '2026',
    bullets: [
      'Researched the workflow from CVE analysis to telemetry generation and detection development, using Sigma, Splunk SPL, and IDS/IPS signatures mapped to MITRE ATT&CK.',
    ],
    tags: ['Sigma', 'Splunk SPL', 'CVE Analysis', 'IDS/IPS', 'MITRE ATT&CK'],
  },
  {
    title: 'Endpoint Security, Malware Analysis & Digital Forensics',
    type: 'personal-project',
    year: '2025',
    bullets: [
      'Built an endpoint security pipeline (OSSEC, ClamAV, ELK Stack) and practiced malware/forensic investigation via CyberDefenders using Wireshark, Volatility 3, and FTK Imager.',
    ],
    tags: ['OSSEC', 'ELK Stack', 'Wireshark', 'Volatility 3', 'FTK Imager', 'CyberDefenders'],
  },
];

const certifications = [
  { name: 'SOC Level 1 Learning Path', issuer: 'TryHackMe', year: '2026' },
  { name: 'Google Cybersecurity Professional Certificate', issuer: 'Coursera / Google', year: '2025' },
];

const thmBadges = [
  { name: 'Advanced Splunk', url: 'https://tryhackme.com/thienanfa4869/badges/advanced-splunk' },
];

const cdCategories = [
  {
    name: 'Endpoint Forensics', icon: <Cpu size={13} strokeWidth={1.5} />, color: '#3b82f6',
    labs: [
      { name: 'KrakenKeylogger', difficulty: 'Medium' }, { name: 'Silent Breach', difficulty: 'Medium' },
      { name: 'Amadey - APT-C-36', difficulty: 'Medium' }, { name: 'RedLine', difficulty: 'Easy' },
      { name: 'The Crime', difficulty: 'Easy' }, { name: 'Ramnit', difficulty: 'Easy' },
      { name: 'Insider', difficulty: 'Easy' }, { name: 'Reveal', difficulty: 'Easy' },
    ],
  },
  {
    name: 'Network Forensics', icon: <Wifi size={13} strokeWidth={1.5} />, color: '#10b981',
    labs: [
      { name: 'HawkEye', difficulty: 'Medium' }, { name: 'Lockdown', difficulty: 'Easy' },
      { name: 'Web Investigation', difficulty: 'Easy' }, { name: 'PacketDetective', difficulty: 'Easy' },
      { name: 'PsExec Hunt', difficulty: 'Easy' }, { name: 'PoisonedCredentials', difficulty: 'Easy' },
      { name: 'WebStrike', difficulty: 'Easy' }, { name: 'XLMRat', difficulty: 'Easy' },
      { name: 'Tomcat Takeover', difficulty: 'Easy' }, { name: 'DanaBot', difficulty: 'Easy' },
    ],
  },
  {
    name: 'Threat Intel', icon: <Search size={13} strokeWidth={1.5} />, color: '#f59e0b',
    labs: [
      { name: 'PhishStrike', difficulty: 'Medium' }, { name: 'Intel101', difficulty: 'Medium' },
      { name: 'Tusk Infostealer', difficulty: 'Easy' }, { name: 'GrabThePhisher', difficulty: 'Easy' },
      { name: '3CX Supply Chain', difficulty: 'Easy' }, { name: 'Red Stealer', difficulty: 'Easy' },
      { name: 'Lespion', difficulty: 'Easy' }, { name: 'Yellow RAT', difficulty: 'Easy' },
      { name: 'Oski', difficulty: 'Easy' }, { name: 'IcedID', difficulty: 'Easy' },
    ],
  },
  {
    name: 'Malware Analysis', icon: <FlaskConical size={13} strokeWidth={1.5} />, color: '#ef4444',
    labs: [
      { name: 'XWorm', difficulty: 'Medium' }, { name: 'FakeGPT', difficulty: 'Easy' },
    ],
  },
];

/* ── Component ─────────────────────────────────────────── */
const alertFeed = [
  { severity: 'OK', text: 'Joined VNCS Global as SOC Contributor', time: 'Jun 2026' },
  { severity: 'OK', text: 'Completed 30+ CyberDefenders labs (DFIR & Threat Intel)', time: '2025–2026' },
  { severity: 'INFO', text: 'Earned SOC Level 1 & Google Cybersecurity certificates', time: '2025–2026' },
  { severity: 'INFO', text: 'Upskilling: Threat Hunting', time: 'Ongoing' },
  { severity: 'INFO', text: 'Upskilling: Cloud Security (AWS, Google)', time: 'Ongoing' },
  { severity: 'INFO', text: 'Upskilling: ITSM (Jira + Splunk ITSI)', time: 'Ongoing' },
  { severity: 'INFO', text: 'Upskilling: IAM & PAM (CyberArk, Teleport)', time: 'Ongoing' },
];

export default function About() {
  const avatarUrl = useBaseUrl('/img/avt.jpg');

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % alertFeed.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = [];
  for (let i = 0; i < 4; i++) {
    visibleAlerts.push(alertFeed[(startIndex + i) % alertFeed.length]);
  }

  return (
    <Layout
      title="About Me | Phạm Trường Thiên Ân"
      description="SOC Analyst Portfolio — Phạm Trường Thiên Ân | Cybersecurity graduate specializing in SIEM, Detection Engineering, and Incident Response">
      <div className={styles.page}>

        {/* ── Profile hero ──────────────────────────────── */}
        <section className={styles.profileSection}>
          <div className={styles.profileBg} aria-hidden="true" />
          <div className="container">
            <div className={styles.profileCard}>

              <div className={styles.profileAvatarWrap}>
                <img src={avatarUrl} alt="Phạm Trường Thiên Ân" className={styles.profileAvatar} />
              </div>

              <div className={styles.profileInfo}>
                <p className={styles.profilePrompt}><span className={styles.caret}>&gt;</span> whoami</p>
                <Heading as="h1" className={styles.profileName}>Phạm Trường Thiên Ân</Heading>
                <p className={styles.profileTitle}>
                  <ShieldCheck size={15} strokeWidth={1.5} color={ACCENT} />
                  &nbsp;SOC Analyst | SIEM Monitoring | Detection Engineering
                </p>
                <p className={styles.profileLocation}>
                  <MapPin size={14} strokeWidth={1.5} color="#6B7280" /> Ho Chi Minh City, Vietnam
                </p>
                <div className={styles.profileLinks}>
                  <Link href="mailto:anphamtrth@gmail.com" className={styles.profileLink}>
                    <Mail size={14} strokeWidth={1.5} /> anphamtrth@gmail.com
                  </Link>
                  <Link href="https://github.com/cavoinho158" className={styles.profileLink}>
                    <ExternalLink size={14} strokeWidth={1.5} /> GitHub
                  </Link>
                  <Link href="https://www.linkedin.com/in/an-pham-truong-thien" className={styles.profileLink}>
                    <Link2 size={14} strokeWidth={1.5} /> LinkedIn
                  </Link>
                </div>
              </div>

              {/* ── Alert Feed panel ──────────────────────── */}
              <div className={styles.alertPanel}>
                <div className={styles.alertHeader}>
                  <span className={styles.alertDot} />
                  <span className={styles.alertTitle}>alert-feed.log</span>
                  <span className={styles.liveBadge}>
                    <span className={styles.livePulse} />
                    LIVE
                  </span>
                </div>
                <div className={styles.alertBody}>
                  {visibleAlerts.map((item) => (
                    <div key={item.text} className={styles.alertRow}>
                      <span className={item.severity === 'OK' ? styles.tagOk : styles.tagInfo}>
                        [{item.severity}]
                      </span>
                      <div className={styles.alertContent}>
                        <span className={styles.alertText}>{item.text}</span>
                        <span className={styles.alertTime}>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Main content ───────────────────────────────── */}
        <div className={styles.main}>

          {/* Professional Summary */}
          <section className={styles.section}>
            <div className="container">
              <p className={styles.sectionLabel}>// professional-summary</p>
              <ConsolePanel icon={<ShieldCheck {...IC18} />} title="summary.txt">
                <p className={styles.summaryText}>
                  Cybersecurity graduate (<strong>B.Sc. in Information Security, GPA 8.39/10</strong>) focused on SOC operations.
                  Hands-on experience with <strong>Splunk</strong>, <strong>Wazuh/OSSEC</strong>, and the <strong>Elastic Stack</strong> for
                  SIEM monitoring, alert triage, and MITRE ATT&amp;CK-mapped detection engineering, plus incident investigation
                  and digital forensics in lab environments.
                </p>
              </ConsolePanel>
            </div>
          </section>

          {/* Professional Experience */}
          <section className={styles.section}>
            <div className="container">
              <p className={styles.sectionLabel}>// professional-experience</p>
              {experience.map((exp, i) => (
                <ConsolePanel key={i} icon={<Briefcase {...IC18} />} title={`experience[${i}]`} className={styles.expPanel}>
                  <div className={styles.expHeader}>
                    <div>
                      <h3 className={styles.expTitle}>{exp.title}</h3>
                      <p className={styles.expCompany}>{exp.company}</p>
                    </div>
                    <span className={styles.expPeriod}>{exp.period}</span>
                  </div>
                  <ul className={styles.expBullets}>
                    {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </ConsolePanel>
              ))}
            </div>
          </section>

          {/* Key Projects */}
          <section className={styles.section}>
            <div className="container">
              <p className={styles.sectionLabel}>// key-projects</p>
              <div className={styles.projectGrid}>
                {projects.map((proj, i) => (
                  <ConsolePanel key={i} icon={<Crosshair {...IC18} />} title={`project[${i}] // ${proj.year}`}>
                    <h3 className={styles.projTitle}>{proj.title}</h3>
                    <ul className={styles.projBullets}>
                      {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                    <div className={styles.tags}>
                      {proj.tags.map((t, j) => <span key={j} className={styles.tag}>{t}</span>)}
                    </div>
                  </ConsolePanel>
                ))}
              </div>
            </div>
          </section>

          {/* Technical Skills */}
          <section className={styles.section}>
            <div className="container">
              <p className={styles.sectionLabel}>// technical-skills</p>
              <div className={styles.skillGrid}>
                {Object.entries(skills).map(([cat, items], i) => (
                  <ConsolePanel key={i} icon={skillIcons[cat]} title={cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}>
                    <div className={styles.skillTags}>
                      {items.map((s, j) => <span key={j} className={styles.skillTag}>{s}</span>)}
                    </div>
                  </ConsolePanel>
                ))}
              </div>
            </div>
          </section>

          {/* Education & Certifications */}
          <section className={styles.section}>
            <div className="container">
              <p className={styles.sectionLabel}>// education-and-certs</p>
              <ConsolePanel icon={<GraduationCap {...IC18} />} title="education" className={styles.eduPanel}>
                <div className={styles.eduHeader}>
                  <div>
                    <h3 className={styles.eduTitle}>B.Sc. in Information Security</h3>
                    <p className={styles.eduInstitution}>University of Information Technology (VNU-HCM)</p>
                  </div>
                  <div className={styles.eduMeta}>
                    <span className={styles.gpa}>GPA 8.39/10</span>
                    <span className={styles.period}>Oct 2022 – Mar 2026</span>
                  </div>
                </div>
              </ConsolePanel>
              <div className={styles.certGrid}>
                {certifications.map((c, i) => (
                  <ConsolePanel key={i} icon={<Award {...IC18} />} title={`cert[${i}]`}>
                    <p className={styles.certName}>{c.name}</p>
                    <p className={styles.certIssuer}>{c.issuer} · {c.year}</p>
                  </ConsolePanel>
                ))}
              </div>
            </div>
          </section>

          {/* Achievements & Practice */}
          <section className={styles.section}>
            <div className="container">
              <p className={styles.sectionLabel}>// achievements-and-practice</p>

              {/* TryHackMe */}
              <ConsolePanel icon={<Award {...IC18} />} title="tryhackme // thienanfa4869" className={styles.platformPanel}>
                <div className={styles.platformMeta}>
                  <span className={styles.platformDetail}>SOC Level 1 Learning Path · 2026</span>
                  <Link href="https://tryhackme.com/p/thienanfa4869" className={styles.platformLink}>
                    view profile ↗
                  </Link>
                </div>
                <p className={styles.badgeRowLabel}>earned-badges</p>
                <div className={styles.badgeChips}>
                  {thmBadges.map((b, i) => (
                    <Link key={i} href={b.url} className={styles.badgeChip}>
                      <Award size={12} strokeWidth={1.5} /> {b.name}
                    </Link>
                  ))}
                </div>
              </ConsolePanel>

              {/* CyberDefenders */}
              <ConsolePanel icon={<Search {...IC18} />} title={`cyberdefenders // ${cdCategories.reduce((a, c) => a + c.labs.length, 0)} labs`} className={styles.platformPanel}>
                <div className={styles.platformMeta}>
                  <span className={styles.platformDetail}>Blue Team CTF · DFIR · Malware Analysis · Threat Intel</span>
                  <Link href="https://cyberdefenders.org/p/thienanfa4869" className={styles.platformLink}>
                    view profile ↗
                  </Link>
                </div>
                <div className={styles.cdGrid}>
                  {cdCategories.map((cat, ci) => (
                    <div key={ci} className={styles.cdCard} style={{ '--cat-color': cat.color }}>
                      <div className={styles.cdCardHeader}>
                        <span style={{ color: cat.color }}>{cat.icon}</span>
                        <span className={styles.cdCatName}>{cat.name}</span>
                        <span className={styles.cdCount}>{cat.labs.length}</span>
                      </div>
                      <div className={styles.cdLabList}>
                        {cat.labs.map((lab, li) => (
                          <div key={li} className={styles.cdLabItem}>
                            <span className={styles.cdLabName}>{lab.name}</span>
                            <span className={lab.difficulty === 'Medium' ? styles.diffMedium : styles.diffEasy}>
                              {lab.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ConsolePanel>

            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
