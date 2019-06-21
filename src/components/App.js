import React from 'react';
import hackernews from '../api/hackernews';
import NewsStory from './NewsStory';

class App extends React.Component {
  state = {
    news: [],
    sortedAsc: false,
    sortedDesc: false
  };

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

  sortByAscPopularity = () => {
    if (!this.state.sortedAsc) {
      const sortedNews = this.state.news.sort(function(a, b){return a.points - b.points});

      this.setState({
        news: sortedNews,
        sortedAsc: true,
        sortedDesc: false,
      });
    }
  }

  sortByDescPopularity = () => {
    if (!this.state.sortedDesc) {
      const sortedNews = this.state.news.sort(function(a, b){return a.points - b.points}).reverse();

      this.setState({
        news: sortedNews,
        sortedDesc: true,
        sortedAsc: false
      });
    }
  }

  render() {
    return (
      <div className="ui container">
        <div>
          Sort by popularity:
          <button onClick={this.sortByAscPopularity}>Asc</button>
          <button onClick={this.sortByDescPopularity}>Desc</button>
        </div>
        <NewsStory news={this.state.news} />
      </div>
    );
  }
}

export default App;
