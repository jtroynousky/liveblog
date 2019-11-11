import React from 'react';
import PropTypes from 'prop-types';

class PostSubtitle extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidUpdate = (nextProps) => {
      if (nextProps && nextProps.lastUpdate !== this.props.lastUpdate) {
        this.props.clearSubtitle();
      }
    };
  }
  updateInputValue(evt) {
    this.props.onChange(evt.target.value);
  }
  render() {
    return (
      <div className="liveblog-post-subtitle">
        <div className="liveblog-subtitle">
          <label
            className="screen-reader-text"
            id="subtitle-prompt-text"
            htmlFor="subtile">
            Enter update subtitle here
          </label>
          <input
            type="text"
            name="post_subtitle"
            size="80"
            className="liveblog-input liveblog-input-subtitle"
            spellCheck="true"
            autoComplete="off"
            placeholder="Enter subtitle..."
            onChange={evt => this.updateInputValue(evt)}
            value={this.props.subtitle}
          />
        </div>
      </div>
    );
  }
}

PostSubtitle.propTypes = {
  onChange: PropTypes.func,
  subtitle: PropTypes.string,
  lastUpdate: PropTypes.number,
  clearSubtitle: PropTypes.func,
};

export default PostSubtitle;