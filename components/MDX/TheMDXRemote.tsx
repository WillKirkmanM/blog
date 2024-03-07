import { MDXRemote } from "next-mdx-remote/rsc"

type TheMDXRemoteProps = { content: string }

export default function TheMDXRemote({ content }: TheMDXRemoteProps) {
  const components = {
    h1: (props: {}) => <h1 className="text-2xl font-medium tracking-tighter" {...props} />,
    h2: (props: {}) => <h1 className="text-2xl font-medium tracking-tighter" {...props} />,
    h3: (props: {}) => <h1 className="text-2xl font-medium tracking-tighter" {...props} />,
    h4: (props: {}) => <h1 className="text-2xl font-medium tracking-tighter" {...props} />,
    h5: (props: {}) => <h1 className="text-2xl  font-medium tracking-tighter" {...props} />,

    ol: (props: {}) => <ol className="list-decimal" {...props} />
  }

  return (
    <MDXRemote source={content} components={components} />
  )
}