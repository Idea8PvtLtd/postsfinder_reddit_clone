function Post({ post }) {
  return (
    <div className="bg-white border border-gray-300 rounded p-2 flex gap-2 w-full">
      <div className="flex flex-col items-center min-w-10 p-1">
        <button className="bg-transparent border-none text-lg cursor-pointer p-1 rounded-sm text-gray-500 hover:bg-gray-100">⬆</button>
        <span className="text-xs font-bold text-gray-800 my-1">{post.votes}</span>
        <button className="bg-transparent border-none text-lg cursor-pointer p-1 rounded-sm text-gray-500 hover:bg-gray-100">⬇</button>
      </div>
      <div className="flex-1">
        <h3 className="m-0 mb-2 text-lg text-gray-800 font-medium">{post.title}</h3>
        <p className="m-0 mb-3 text-xs text-gray-500">
          Posted by u/{post.author} • {post.timeAgo}
        </p>
        <p className="m-0 mb-3 text-sm text-gray-800 leading-relaxed">{post.content}</p>
        
        {/* Key Points */}
        {post.key_points && post.key_points.length > 0 && (
          <div className="mb-3">
            <h4 className="m-0 mb-2 text-sm font-semibold text-gray-700">Key Points:</h4>
            <ul className="m-0 pl-5 mb-3 text-sm text-gray-600">
              {post.key_points.map((point, index) => (
                <li key={index} className="mb-1">{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Example Stacks */}
        {post.example_stacks && post.example_stacks.length > 0 && (
          <div className="mb-3">
            <h4 className="m-0 mb-2 text-sm font-semibold text-gray-700">Example Stacks:</h4>
            {post.example_stacks.map((stack, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                <p className="m-0 mb-1 text-sm font-medium text-gray-800">{stack.use_case}</p>
                <div className="flex flex-wrap gap-1">
                  {stack.stack.map((tech, techIndex) => (
                    <span key={techIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Business Models */}
        {post.business_models && post.business_models.length > 0 && (
          <div className="mb-3">
            <h4 className="m-0 mb-2 text-sm font-semibold text-gray-700">Business Models:</h4>
            <ul className="m-0 pl-5 mb-3 text-sm text-gray-600">
              {post.business_models.map((model, index) => (
                <li key={index} className="mb-1">{model}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Starter Actions */}
        {post.starter_actions && post.starter_actions.length > 0 && (
          <div className="mb-3">
            <h4 className="m-0 mb-2 text-sm font-semibold text-gray-700">Starter Actions:</h4>
            <ol className="m-0 pl-5 mb-3 text-sm text-gray-600">
              {post.starter_actions.map((action, index) => (
                <li key={index} className="mb-1">{action}</li>
              ))}
            </ol>
          </div>
        )}
        
        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <div className="mb-3">
            <h4 className="m-0 mb-2 text-sm font-semibold text-gray-700">Sources:</h4>
            <ul className="m-0 pl-5 mb-3 text-sm text-gray-600">
              {post.sources.map((source, index) => (
                <li key={index} className="mb-1">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                    {source.title || 'Source'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-2">
          <button className="bg-transparent border-none text-gray-500 text-xs py-1 px-2 rounded-sm cursor-pointer hover:bg-gray-100">💬 {post.comments} Comments</button>
          <button className="bg-transparent border-none text-gray-500 text-xs py-1 px-2 rounded-sm cursor-pointer hover:bg-gray-100">📤 Share</button>
        </div>
      </div>
    </div>
  )
}

export default Post