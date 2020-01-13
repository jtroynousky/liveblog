import React from 'react';
import PropTypes from 'prop-types';
import { timeAgo, formattedTime } from '../utils/utils';


const Event = ({ event, click, onDelete, canEdit, utcOffset, dateFormat, timeFormat, disableFuzzy, displayDate}) => (
  <li className="liveblog-event">
    <div className="liveblog-event-body">
      <div className="liveblog-event-meta" >
        <span>
        {
          (disableFuzzy) 
          ? formattedTime(event.entry_time, utcOffset, timeFormat)
          : timeAgo(event.entry_time, utcOffset, dateFormat)   
        }
        </span>
        {
          (displayDate) &&
          <span>{formattedTime(event.entry_time, utcOffset, dateFormat)}</span>
        }
      </div>
      <div>
        {
          canEdit &&
          <span className="dashicons dashicons-no-alt liveblog-editor-delete" onClick={onDelete} />
        }
        <span
          className="liveblog-event-content"
          onClick={click}
          dangerouslySetInnerHTML={{ __html: event.key_event_content }}
        />
      </div>
    </div>
  </li>
);

Event.propTypes = {
  event: PropTypes.object,
  click: PropTypes.func,
  onDelete: PropTypes.func,
  canEdit: PropTypes.bool,
  utcOffset: PropTypes.string,
  dateFormat: PropTypes.string,
};

export default Event;
