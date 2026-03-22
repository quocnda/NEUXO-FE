// pages/share/[slug].tsx hoặc route nào bạn muốn
import Head from 'next/head';

import type { NextPageWithLayout } from '@/types';

const ShareImagePag: NextPageWithLayout = () => {
  const imageUrl = 'https://cms.web3harbour.org/wp-content/uploads/2025/06/Subheading-1.png';

  return (
    <>
      <Head>
        <title>Shared Battle</title>
        <meta property="og:title" content="Battle of Agents" />
        <meta property="og:description" content="See who won in the Battle of Agents!" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="450" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:title" content="Battle of Agents" />
      </Head>

      <div style={{ padding: 40 }}>
        <h1>Preview your Battle Image</h1>
        <img src={imageUrl} alt="shared image" style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
      </div>
    </>
  );
};
export default ShareImagePag;
ShareImagePag.getLayout = (page) => <>{page}</>;
