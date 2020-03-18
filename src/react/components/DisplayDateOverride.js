import React from 'react';
import PropTypes from 'prop-types';

class DisplayDateOverride extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidUpdate = (nextProps) => {
      if (nextProps && nextProps.lastUpdate !== this.props.lastUpdate) {
        this.props.clearDisplayDateOverride();
      }
    };
  }

  updateInputValue(evt) {
    this.props.onChange(evt.target.value);
  }

  render() {
    return (
      <div className="liveblog-date-override">
        <p>
          <label
            id="display-date-override-prompt"
            htmlFor="display-date-override">
            Display date override (optional)
          </label>
          <input
            type="text"
            name="display-date-override"
            placeholder="Enter text to override the display date..."
            className="liveblog-input liveblog-input-display-date-override"
            onChange={ evt => this.updateInputValue(evt) }
            value={ this.props.displayDateOverride }
          />
        </p>
      </div>
    );
  }
}

DisplayDateOverride.propTypes = {
  onChange: PropTypes.func,
  displayDateOverride: PropTypes.string,
  lastUpdate: PropTypes.number,
  clearDisplayDateOverride: PropTypes.func
};

export default DisplayDateOverride;
