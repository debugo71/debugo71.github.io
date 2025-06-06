import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Header from '../../components/Header';
import Panel from '../../components/Panel';

type PostData = {
  id: string;
  title: string;
  date: string;
  mdxSource: MDXRemoteSerializeResult;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ postData: PostData }> = async ({ params }) => {
  const postData = await getPostData(params?.id as string);
  return {
    props: {
      postData,
    },
  };
};

export default function Post({ postData }: InferGetStaticPropsType<typeof getStaticProps>) {
  const components = {
    info: (props: any) => <Panel type="info" {...props} />,
    warning: (props: any) => <Panel type="warning" {...props} />,
    danger: (props: any) => <Panel type="danger" {...props} />,
    success: (props: any) => <Panel type="success" {...props} />,
    note: (props: any) => <Panel type="note" {...props} />,
    tip: (props: any) => <Panel type="tip" {...props} />,
    neutral: (props: any) => <Panel type="neutral" {...props} />,
    quote: (props: any) => <Panel type="quote" {...props} />,
  };

  return (
    <>
      <Header isDark={false} />
      <main className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <p className="text-gray-500 text-sm mb-8">{postData.date}</p>
        <article className="prose prose-lg">
          <MDXRemote {...postData.mdxSource} components={components} />
        </article>
      </main>
    </>
  );
}
