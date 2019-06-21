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

  /**
   * Loads data from API
   * based on searchType - search by date or search by popularity
   *
   * @memberof App
   * @method loadData
   * @param {Object} params
   * @param {Boolean} sortByDate
   * @returns {Promise}
   */
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

  /**
   * Checks if search parameters have been added
   * Checks if date parameter has been added and based
   * on that returns an object with all needed parameters
   * for search request
   *
   * @memberof App
   * @method checkForSearchParams
   * @param {Number} page
   * @returns {Object}
   */
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

  /**
   * Component lifecycle hook
   * Waits for data to be loaded
   * and sets needed parameters to the state of
   * the component
   *
   * @memberof App
   * @method componentDidMount
   */
  componentDidMount = async () => {
    const params = {
      page: this.state.activePage
    }
    const response = await this.loadData(params);

    if (response) {
      const data = response.data;

      this.setState({
        news: data.hits,
        itemsCountPerPage: data.hitsPerPage,
        totalItemsCount: data.nbHits
      });
    }
  }

  /**
   * Checks if the user has been searching by popularity
   * If yes, then no new search is triggered
   * If no, makes search request and updates parameters
   * from the state of the component
   *
   * @memberof App
   * @method sortByPopularity
   */
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

  /**
   * Checks if the user has been searching by date
   * If yes, then no new search is triggered
   * If no, makes search request and updates parameters
   * from the state of the component
   *
   * @memberof App
   * @method sortByDate
   */
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

  /**
   * Checks what parameters are added to the search
   * Makes search request
   * Updates state parameters
   *
   * @memberof App
   * @method onSearchSubmit
   * @param {String} term
   * @param {String} date
   */
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

  /**
   * Resets the search by calling a
   * request without search parameters
   * Updates state parameters
   *
   * @memberof App
   * @method onSearchReset
   */
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

  /**
   * Called when user changes a page from the
   * Pagination component
   * Preserves the parameters from the search
   * Changes the page
   * Updates state parameters
   *
   * @memberof App
   * @method handlePageChange
   * @param {Number} currentPage
   */
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
