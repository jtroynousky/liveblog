import React from 'react';
import PropTypes from 'prop-types';

class KeyEventURLInput extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidUpdate = (nextProps) => {
      if (nextProps && nextProps.lastUpdate !== this.props.lastUpdate) {
        this.props.clearKeyEventURL();
      }
    };
  }
  updateInputValue(evt) {
    this.props.onChange(evt.target.value);
  }
  render() {
    return (
      <div className="liveblog-key-event-url">
        <p>
          <label
            className="screen-reader-text"
            htmlFor="key-event-url">
            Key event URL (optional)
          </label>
          <input
            type="text"
            name="key-event-url"
            size="80"
            className="liveblog-input liveblog-input-key-event-url"
            autoComplete="off"
            placeholder="Enter URL..."
            onChange={evt => this.updateInputValue(evt)}
            value={this.props.keyEventURL}
          />
        </p>
      </div>
    );
  }
}

KeyEventURLInput.propTypes = {
  onChange: PropTypes.func,
  keyEventURL: PropTypes.string,
  lastUpdate: PropTypes.number,
  clearKeyEventURL: PropTypes.func,
};

export default KeyEventURLInput;