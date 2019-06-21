import React from 'react';
import "./Search.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class Search extends React.Component {
  state = {
    term: '',
    date: null,
    invalidTerm: false,
    invalidDate: false
  };

  onFormSubmit = (event) => {
    event.preventDefault();

    const term = this.state.term;
    const date = this.state.date;

    if (term && !date) {
      this.setState({ invalidTerm: false, invalidDate: true });

      return;
    } else if (!term && date) {
      this.setState({ invalidTerm: true, invalidDate: false });

      return;
    } else if (!term && !date) {
      this.setState({ invalidTerm: true, invalidDate: true });

      return;
    }

    this.setState({ invalidTerm: false, invalidDate: false });
    this.props.onSubmit(term, date);
  }

  onFormReset = () => {
    this.setState({
      term: '',
      date: null
    })
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
            onChange={(currentDate) => this.setState({ date: currentDate })}
            className={this.state.invalidDate ? "error" : ''}/>

          <input type="submit" value="Search" />
          <input type="reset" value="Clear" />
        </form>

      </div>
    )
  }
}

export default Search;
