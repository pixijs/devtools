import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <Heading as="h1">
          <img src="/devtools/img/logo-main.svg" alt="Logo" width={'50%'} />
        </Heading>
        <p className="hero__subtitle" style={{ marginTop: -30 }}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" style={{ color: 'white' }} to="/docs/guide/installation">
            Get Started
          </Link>
          <Link className="button button--primary button--lg" style={{ color: 'white' }} to="/docs/guide/features">
            Features
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -30 }}
      >
        <img
          src="/devtools/img/devtool-screenshot.png"
          alt="Hero"
          style={{
            width: '800px',
            borderRadius: 8,
            border: '1px solid #676767',
          }}
        />
      </main>
    </Layout>
  );
}
