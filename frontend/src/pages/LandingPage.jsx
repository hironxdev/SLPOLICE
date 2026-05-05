import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const CONTENT = {
  en: {
    police: "Sri Lanka Police",
    division: "Computer Crime Investigation Division",
    login: "Portal Login",
    whatIs: "What is CCID?",
    heroText: "The Computer Crime Investigation Division (CCID) is a specialized unit of the Sri Lanka Police. Its core mission is to investigate crimes involving computers, digital systems, and online activity, operating strictly within legal frameworks and utilizing forensic expertise.",
    purpose: "Main Purpose",
    purposeText: "CCID exists because modern crime has moved online. They handle cases where evidence is digital, crimes are committed using technology, and data needs to be traced, recovered, or analyzed legally. They act as digital forensic investigators and cybercrime detectives.",
    courtNotice: "Respond to Court Notice",
    newCase: "File a New Case",
    history: "History of CCID",
    historyText: "The CCID was established as a specialized division to address the rapid evolution of digital threats in Sri Lanka. Originally functioning as a sub-unit, it expanded into a robust division following the enactment of the Computer Crimes Act No. 24 of 2007. Today, it stands as the vanguard against cyber-terrorism, financial fraud, and digital impersonation, equipped with advanced forensic labs and international partnerships.",
    cyber: "Cybercrime Investigations",
    cyberList: [
      "Social media fraud (Facebook, WhatsApp scams)",
      "Identity theft and impersonation",
      "Online financial fraud and phishing",
      "Email hacking or account takeovers"
    ],
    forensics: "Digital Forensics",
    forensicsList: [
      "Recover deleted files from seized devices",
      "Analyze call logs, messages, metadata",
      "Extract evidence using licensed forensic tools"
    ],
    reality: "Reality: All actions are done with legal authorization and forensic tools. There is no magical instant tracking.",
    tracking: "Tracking & Intelligence",
    trackingList: [
      "Work with telecom companies to trace numbers",
      "Obtain IP logs from companies (Google, Facebook, etc.)",
      "Identify suspects using digital footprints"
    ],
    warning: "Requires court orders and legal process. Not instant or accessible to the public.",
    legal: "Legal Authority",
    legalText: "Their power comes from Sri Lankan cyber laws, court-issued warrants, and collaboration with telecom or tech companies. Without legal approval, even CCID cannot access private data.",
    footer: "Computer Crime Investigation Division (CCID), Sri Lanka Police. All Rights Reserved."
  },
  si: {
    police: "ශ්‍රී ලංකා පොලිසිය",
    division: "පරිගණක අපරාධ විමර්ශන කොට්ඨාසය",
    login: "පද්ධතියට පිවිසෙන්න",
    whatIs: "CCID යනු කුමක්ද?",
    heroText: "පරිගණක අපරාධ විමර්ශන කොට්ඨාසය (CCID) යනු ශ්‍රී ලංකා පොලිසියේ විශේෂිත ඒකකයකි. එහි ප්‍රධාන මෙහෙයුම වන්නේ පරිගණක, ඩිජිටල් පද්ධති සහ අන්තර්ජාල ක්‍රියාකාරකම් සම්බන්ධ අපරාධ විමර්ශනය කිරීමයි, නීතිමය රාමුවක් තුළ දැඩි ලෙස ක්‍රියාත්මක වෙමින් සහ අධිකරණ වෛද්‍ය විශේෂඥතාව උපයෝගී කර ගනිමින්.",
    purpose: "ප්‍රධාන අරමුණ",
    purposeText: "නූතන අපරාධ අන්තර්ජාලය වෙත යොමු වී ඇති බැවින් CCID පිහිටුවා ඇත. සාක්ෂි ඩිජිටල් වන, තාක්‍ෂණය භාවිතයෙන් අපරාධ සිදු කරන සහ දත්ත සොයා ගැනීමට, ප්‍රතිසාධනය කිරීමට හෝ නීත්‍යානුකූලව විශ්ලේෂණය කිරීමට අවශ්‍ය අවස්ථාවන්හිදී ඔවුන් කටයුතු කරයි. ඔවුන් ඩිජිටල් අධිකරණ වෛද්‍ය විමර්ශකයින් සහ සයිබර් අපරාධ රහස් පරීක්ෂකයින් ලෙස ක්‍රියා කරයි.",
    courtNotice: "අධිකරණ නියෝගයකට ප්‍රතිචාර දක්වන්න",
    newCase: "නව පැමිණිල්ලක් ඉදිරිපත් කරන්න",
    history: "CCID හි ඉතිහාසය",
    historyText: "ශ්‍රී ලංකාවේ ඩිජිටල් තර්ජනවල ශීඝ්‍ර පරිණාමය ඇමතීම සඳහා විශේෂිත අංශයක් ලෙස CCID පිහිටුවන ලදී. මුලින් උප ඒකකයක් ලෙස ක්‍රියාත්මක වූ එය, 2007 අංක 24 දරන පරිගණක අපරාධ පනත බලාත්මක වීමෙන් පසුව ශක්තිමත් කොට්ඨාසයක් දක්වා ව්‍යාප්ත විය. අද වන විට එය සයිබර් ත්‍රස්තවාදය, මූල්‍ය වංචා සහ ඩිජිටල් පුද්ගල මාරු කිරීම් වලට එරෙහිව පෙරමුණ ගෙන සිටින අතර නවීන අධිකරණ වෛද්‍ය රසායනාගාර සහ ජාත්‍යන්තර හවුල්කාරිත්වයන්ගෙන් සමන්විත වේ.",
    cyber: "සයිබර් අපරාධ විමර්ශනය",
    cyberList: [
      "සමාජ මාධ්‍ය වංචා (Facebook, WhatsApp වංචා)",
      "අනන්‍යතා සොරකම සහ පුද්ගල මාරු කිරීම",
      "අන්තර්ජාල මූල්‍ය වංචා සහ තොරතුරු සොරකම් කිරීම (Phishing)",
      "විද්‍යුත් තැපැල් හැක් කිරීම හෝ ගිණුම් අත්පත් කර ගැනීම"
    ],
    forensics: "ඩිජිටල් අධිකරණ විද්‍යාව",
    forensicsList: [
      "අත්අඩංගුවට ගත් උපාංගවලින් මකා දැමූ ගොනු ප්‍රතිසාධනය කිරීම",
      "ඇමතුම් ලොග්, පණිවිඩ, මෙටා දත්ත විශ්ලේෂණය කිරීම",
      "බලපත්‍රලාභී අධිකරණ වෛද්‍ය මෙවලම් භාවිතයෙන් සාක්ෂි ලබා ගැනීම"
    ],
    reality: "යථාර්ථය: සියලුම ක්‍රියාමාර්ග නීතිමය අවසරය සහ අධිකරණ වෛද්‍ය මෙවලම් සමඟ සිදු කෙරේ. මැජික් ක්ෂණික ලුහුබැඳීමක් නොමැත.",
    tracking: "ලුහුබැඳීම සහ බුද්ධි තොරතුරු",
    trackingList: [
      "දුරකථන අංක හඳුනා ගැනීමට විදුලි සංදේශ සමාගම් සමඟ කටයුතු කිරීම",
      "සමාගම් වලින් (Google, Facebook, ආදිය) IP ලොග් ලබා ගැනීම",
      "ඩිජිටල් අඩිපාරවල් භාවිතයෙන් සැකකරුවන් හඳුනා ගැනීම"
    ],
    warning: "උසාවි නියෝග සහ නීතිමය ක්‍රියාවලිය අවශ්‍ය වේ. මහජනයාට ක්ෂණිකව හෝ ප්‍රවේශ විය නොහැක.",
    legal: "නීතිමය අධිකාරිය",
    legalText: "ඔවුන්ගේ බලය ලැබෙන්නේ ශ්‍රී ලාංකේය සයිබර් නීති, අධිකරණය විසින් නිකුත් කරන ලද වරෙන්තු සහ විදුලි සංදේශ හෝ තාක්ෂණික සමාගම් සමඟ සහයෝගීතාවයෙනි. නීතිමය අනුමැතියකින් තොරව, CCID හට පවා පුද්ගලික දත්ත වෙත ප්‍රවේශ විය නොහැක.",
    footer: "පරිගණක අපරාධ විමර්ශන කොට්ඨාසය (CCID), ශ්‍රී ලංකා පොලිසිය. සියලුම හිමිකම් ඇවිරිණි."
  }
};

const LandingPage = () => {
  const [lang, setLang] = useState('en');
  const t = CONTENT[lang];

  return (
    <div className="landing-container">
      <div className="landing-overlay">
        <header className="landing-header">
          <div className="header-left">
            <div className="logo-box">
              <img src="/logo.png" alt="SL Police Logo" className="police-logo" />
              <div className="logo-divider"></div>
            </div>
            <div className="header-titles">
              <h2 className="police-title">{t.police}</h2>
              <h1 className="division-title">{t.division}</h1>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="lang-toggle" 
              onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
            >
              {lang === 'en' ? 'සිංහල' : 'English'}
            </button>
            <a href="http://localhost:3001/courtnotices" className="btn-secondary">{t.courtNotice}</a>
            <Link to="/login" className="btn-portal">{t.login}</Link>
          </div>
        </header>

        <main className="landing-main">
          <section className="hero-section">
            <div className="hero-content">
              <h2 className="section-subtitle">{t.whatIs}</h2>
              <p className="hero-text">{t.heroText}</p>
              <div className="hero-btns">
                <Link to="/login" className="btn-main">{t.newCase}</Link>
                <a href="http://localhost:3001/courtnotices" className="btn-outline">{t.courtNotice}</a>
              </div>
            </div>
          </section>

          <section className="purpose-section">
            <div className="section-header">
              <h2>{t.purpose}</h2>
            </div>
            <p className="purpose-text">{t.purposeText}</p>
          </section>

          <section className="history-section">
            <div className="section-header">
              <h2>{t.history}</h2>
            </div>
            <p className="history-text">{t.historyText}</p>
          </section>

          <section className="grid-section">
            <div className="card">
              <div className="card-header">
                <h3>{t.cyber}</h3>
              </div>
              <ul className="card-list">
                {t.cyberList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>{t.forensics}</h3>
              </div>
              <ul className="card-list">
                {t.forensicsList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <div className="reality-check">
                <strong>{lang === 'en' ? 'Reality Check:' : 'යථාර්ථය පරීක්ෂා කිරීම:'}</strong> {t.reality}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>{t.tracking}</h3>
              </div>
              <ul className="card-list">
                {t.trackingList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <div className="warning-note">
                {t.warning}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>{t.legal}</h3>
              </div>
              <p className="card-text">{t.legalText}</p>
            </div>
          </section>
        </main>

        <footer className="landing-footer">
          <p>&copy; {new Date().getFullYear()} {t.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
