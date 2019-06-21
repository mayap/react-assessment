import React from 'react';
import hackernews from '../api/hackernews';
import NewsStory from './NewsStory';
import Search from './Search';
import Pagination from "react-js-pagination";

class App extends React.Component {
  state = {
    news: [],
    activePage: 0,
    itemsCountPerPage: null,
    totalItemsCount: null,
    pageRangeDisplayed: 5,
    sortByDate: true,
    searchParams: null
  };

  loadData = async (params, sortByDate = this.state.sortByDate) => {
    let searchType = '';

    sortByDate ? searchType = '/search_by_date' : searchType = '/search';

    try {
      return await hackernews.get(searchType, {
        params: params
      });
    } catch (error) {
      console.log(error);
    }
  }

  checkForSearchParams = (page = this.state.activePage) => {
    let params = {
      page: page
    }
    let searchParams = this.state.searchParams;

    if (searchParams) {
      params.query = searchParams.term;
      if (searchParams.date) {
        params.numericFilters = `created_at_i>=${searchParams.date}`;
      }
    }

    return params;
  }

  componentDidMount = async () => {
    const params = {
      page: this.state.activePage
    }
    const response = await this.loadData(params);

    this.setState({
      news: response.data.hits,
      itemsCountPerPage: response.data.hitsPerPage,
      totalItemsCount: response.data.nbHits
    });
  }

  sortByPopularity = async () => {
    const sortByDate = this.state.sortByDate;

    if (sortByDate) {
      const params = this.checkForSearchParams();

      const response = await this.loadData(params, !sortByDate);

      this.setState({
        news: response.data.hits,
        totalItemsCount: response.data.nbHits,
        sortByDate: false
      });
    }
  }

  sortByDate = async () => {
    const sortByDate = this.state.sortByDate;

    if (!sortByDate) {
      const params = this.checkForSearchParams();

      const response = await this.loadData(params, !sortByDate);

      this.setState({
        news: response.data.hits,
        totalItemsCount: response.data.nbHits,
        sortByDate: true
      });
    }
  }

  onSearchSubmit = async (term, date) => {
    let params = {
      query: term
    }
    let dateTimeStamp = null;

    if (date) {
      dateTimeStamp = Math.floor(date.getTime() / 1000);

      params.numericFilters = `created_at_i>=${dateTimeStamp}`;
    }

    const response = await this.loadData(params);

    this.setState({
      news: response.data.hits,
      sortByDate: this.state.sortByDate,
      searchParams: {
        term: term,
        date: dateTimeStamp
      },
      totalItemsCount: response.data.nbHits
    });
  }

  onSearchReset = async () => {
    const params = {
      page: 0
    }

    const response = await this.loadData(params);

    this.setState({
      news: response.data.hits,
      sortByDate: this.state.sortByDate,
      activePage: 0,
      searchParams: null,
      totalItemsCount: response.data.nbHits
    });
  }

  handlePageChange = async (currentPage) => {
    const page = currentPage - 1;
    const params = this.checkForSearchParams(page);
    const response = await this.loadData(params);

    this.setState({
      news: response.data.hits,
      totalItemsCount: response.data.nbHits,
      activePage: page
    });
  }

  render() {
    return (
      <div className="ui container">
        <Search onSubmit={this.onSearchSubmit} onReset={this.onSearchReset}/>
        <div>
          Sort by popularity:
          <button onClick={this.sortByPopularity}>Sort</button>
        </div>
        <div>
          Sort by date:
          <button onClick={this.sortByDate}>Sort</button>
        </div>
        <NewsStory news={this.state.news} />

        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={this.state.itemsCountPerPage}
          totalItemsCount={this.state.totalItemsCount}
          pageRangeDisplayed={this.state.pageRangeDisplayed}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default App;
