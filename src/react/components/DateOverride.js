import React from 'react';

import { TimePicker } from '@wordpress/components';

class DateOverride extends React.Component {
  constructor(props) {
    super(props);
    /*this.componentDidUpdate = (nextProps) => {
      if (nextProps && nextProps.lastUpdate !== this.props.lastUpdate) {
        this.props.clearHeadline();
      }
    };*/
  }
  updateInputValue(evt) {
    this.props.onChange(evt.target.value);
  }

  render() {
    return (
      <div className="liveblog-date-override">
        <div>
          <label
            id="date-override-prompt"
            htmlFor="date-override">
            Override the display date?
          </label>
          <input
            type="checkbox"
            name="date-override"
            className="liveblog-input liveblog-input-date-override"
            onChange={ evt => this.updateInputValue(evt) }
            checked={ this.props.checked }
          />
          <div className="components-datetime { this.props.checked ? '' : 'hidden' }">
            <TimePicker
              //currentTime={ currentDate }
              //onChange={ onChange }
              //is12Hour={ is12Hour }
            />
          </div>
        </div>
      </div>
    );
  }
}

DateOverride.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  lastUpdate: PropTypes.number,
  clearKeyEvent: PropTypes.func,
};

export default DateOverride;
