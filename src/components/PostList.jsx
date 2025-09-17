import Post from './Post'

function PostList({ posts }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostList