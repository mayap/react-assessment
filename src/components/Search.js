import React from 'react';
import "./Search.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class Search extends React.Component {
  state = {
    term: '',
    date: null,
    invalidTerm: false,
    isSearching: false,
  };

  /**
   * Triggered when the user clicks Search
   * Default behaviour is prevented
   * Search properties (term, date) are set to the state
   * action onSubmit from parent component is called
   *
   * @memberof Search
   * @method onFormSubmit
   * @param event
   */
  onFormSubmit = (event) => {
    event.preventDefault();

    const term = this.state.term;
    const date = this.state.date;

    if (!term) {
      this.setState({ invalidTerm: true });

      return;
    }

    this.setState({
      invalidTerm: false,
      isSearching: true
    });

    this.props.onSubmit(term, date);
  }

  /**
   * Triggered when the user clicks Clear
   * Search properties (term, date) are set to default (cleared)
   * action onReset from parent component is called if the user has
   * triggered Search
   *
   * @memberof Search
   * @method onFormReset
   */
  onFormReset = () => {
    if (this.state.term || this.state.date) {
      this.setState({
        term: '',
        date: null,
        isSearching: false
      });
    }

    if (this.state.isSearching) {
      this.props.onReset();
    }
  }

  render() {
    return (
      <div className="ui segment">
        <form className="" onSubmit={this.onFormSubmit} onReset={this.onFormReset}>
          <div className="field">
            <label>Search for news:</label>
            <input
              type="text"
              value={this.state.term}
              onChange={(e) => this.setState({ term: e.target.value })}
              className={this.state.invalidTerm ? "error" : ''}/>
          </div>

          <DatePicker
            selected={this.state.date}
            onChange={(currentDate) => this.setState({ date: currentDate })}/>

          <input type="submit" value="Search" />
          <input type="reset" value="Clear" />
        </form>

      </div>
    )
  }
}

export default Search;
