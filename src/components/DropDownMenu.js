import React, { Component } from 'react';

class DropDownMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {searchString: this.props.defaultValue} // default search string

        // create reference to input field
        this.inputRef = React.createRef();
        this.submitRef = React.createRef();

        // bind this
        this.selectText = this.selectText.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
    }
    // create input field for user to enter desired city name or desired zip code
    render() {
        return (
			<div className="drop-down-menu">
                <input className="input-text" type="text" name="fname" onClick={this.selectText} onChange={this.handleChange} onKeyPress={this.handleKeyPress} onSubmit={this.props.updateFunction} value={this.state.searchString} ref={this.inputRef} ></input>
                <button className="submit" onClick={this.submit} ref={this.submitRef}>Submit</button>
			</div>
        );
    }

    // highlight the text in the input object -- makes for easier delete
    selectText() {
        this.inputRef.current.select();
    }

    // update what the user is entering into the field
    handleChange() {
        this.setState({searchString: this.inputRef.current.value});
    }

    // submit the change - not using php so will not force refresh, instead handle change internally with callback functions
    submit() {
        var queryState = (this.props.searchType === "City Name") ? "city-name" : "zip-code";
        this.props.setQueryState(queryState);
        this.props.updateFunction(this.state.searchString);
    }

    // allow the user to set the value of the input field
    setValue(val) {
        this.setState({searchString: val});
    }

    // if user presses enter in the input field, click the submit button for them
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.submit();
        }
    }
}

export default DropDownMenu;
