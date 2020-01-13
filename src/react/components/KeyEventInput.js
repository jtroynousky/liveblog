import React from 'react';
import PropTypes from 'prop-types';

class KeyEventInput extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidUpdate = (nextProps) => {
      if (nextProps && nextProps.lastUpdate !== this.props.lastUpdate) {
        this.props.clearKeyEvent();
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
            id="key-event-prompt"
            htmlFor="key-event">
            Is this a key event?
          </label>
          <input
            type="checkbox"
            name="key-event"
            className="liveblog-input liveblog-input-key-event"
            onChange={evt => this.updateInputValue(evt)}
            checked={this.props.checked}
          />
        </div>
      </div>
    );
  }
}

KeyEventInput.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  lastUpdate: PropTypes.number,
  clearKeyEvent: PropTypes.func,
};

export default KeyEventInput; 