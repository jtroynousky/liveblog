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
  /*updateInputValue(evt) {
    this.props.onChange(evt.target.value);
  }*/
  render() {
    return (
      <div className="components-datetime">
        <TimePicker
          //currentTime={ currentDate }
          //onChange={ onChange }
          //is12Hour={ is12Hour }
        />
      </div>
    );
  }
}
/*
PostHeadline.propTypes = {
  onChange: PropTypes.func,
  headline: PropTypes.string,
  lastUpdate: PropTypes.number,
  clearHeadline: PropTypes.func,
};*/

export default DateOverride;