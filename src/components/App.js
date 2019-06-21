import React from 'react';
import hackernews from '../api/hackernews';
import NewsStory from './NewsStory';

class App extends React.Component {
  state = { news: [] };

  loadData = async () => {
    const response = await hackernews.get('/search');

    const sortedByDateRes = response.data.hits.sort(function(a, b) {
      return new Date(a.created_at) - new Date(b.created_at)
    }).reverse();

    this.setState({ news: sortedByDateRes });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="ui container">
        <NewsStory news={this.state.news} />
      </div>
    );
  }
}

export default App;
