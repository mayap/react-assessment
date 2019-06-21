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

    const title = item.title || item.story_title;
    const url = item.url || item.story_url;

    return (
      <div className="content" key={item.objectID}>
        <a href={url}>
          <div className="story-name header">{title}</div>
        </a>
        <div className="story-author meta ">{item.author}</div>
        <div className="story-date meta right floated time">{item.created_at}</div>
        <div className="story-tags extra content">
          {tags}
        </div>
        <button onClick={url => window.location.href = url}>See full story</button>
        <br />
      </div>
    )
  });

  return (
    <div className="ui card">
      {news}
    </div>
  )
}

export default NewsStory;
