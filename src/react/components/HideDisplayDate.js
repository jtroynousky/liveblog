import React from 'react';
import PropTypes from 'prop-types';

class HideDisplayDate extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidUpdate = (nextProps) => {
      if (nextProps && nextProps.lastUpdate !== this.props.lastUpdate) {
        this.props.clearHideDisplayDate();
      }
    };
  }
  updateInputValue(evt) {
    this.props.onChange(evt.target.checked);
  }

  render() {
    return (
      <div className="liveblog-key-event-input">
        <div>
          <label
            id="hide-display-date-prompt"
            htmlFor="hide-display-date">
            Hide display date?
          </label>
          <input
            type="checkbox"
            name="hide-display-date"
            className="liveblog-input liveblog-input-hide-display-date"
            onChange={evt => this.updateInputValue(evt)}
            checked={this.props.checked}
          />
        </div>
      </div>
    );
  }
}

HideDisplayDate.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  lastUpdate: PropTypes.number,
  clearHideDisplayDate: PropTypes.func,
};

export default HideDisplayDate; 