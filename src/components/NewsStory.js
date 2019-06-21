import React from 'react';

const NewsStory = props => {
  const news = props.news.map(item => {
    const tags = item._tags.map(tag => {
      return (
        <span key={tag}>
          {tag}
          <br />
        </span>
      )
    });

    return (
      <div className="content" key={item.objectID}>
        <a href={item.url}>
          <div className="story-name header">{item.title}</div>
        </a>
        <div className="story-author meta ">{item.author}</div>
        <div className="story-date meta right floated time">{item.created_at}</div>
        <div className="story-tags extra content">
          {tags}
        </div>
        <br />
      </div>
    )
  })
  return (
    <div className="ui card">
      {news}
    </div>
  )
}

export default NewsStory;
