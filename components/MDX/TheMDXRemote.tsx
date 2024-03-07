import { MDXRemote } from "next-mdx-remote/rsc"

type TheMDXRemoteProps = { content: string }

export default function TheMDXRemote({ content }: TheMDXRemoteProps) {
  const components = {
  }

  return (
    <MDXRemote source={content} components={components} />
  )
}