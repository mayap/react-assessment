import React from 'react';
import hackernews from '../api/hackernews';
import NewsStory from './NewsStory';
import Search from './Search';

class App extends React.Component {
  state = {
    news: [],
    sortedAsc: false,
    sortedDesc: false
  };

  loadData = async () => {
    try {
      const response = await hackernews.get('/search');

      const sortedByDateRes = response.data.hits.sort(function(a, b) {
        return new Date(a.created_at) - new Date(b.created_at)
      }).reverse();

      this.setState({ news: sortedByDateRes });
    } catch (error) {
      console.log(error);
    }
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

  onSearchSubmit = async (term, date) => {
    const dateTimeStamp = Math.floor(date.getTime() / 1000);

    try {
      const response = await hackernews.get('/search_by_date', {
        params: {
          query: term,
          numericFilters: `created_at_i>=${dateTimeStamp}`
        }
      });


      const sortedByDateRes = response.data.hits

      this.setState({ news: sortedByDateRes });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="ui container">
        <Search onSubmit={this.onSearchSubmit}/>
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
