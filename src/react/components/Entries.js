import React from 'react';
import PropTypes from 'prop-types';

import EntryContainer from '../containers/EntryContainer';

const Entries = ({ title, loading, entries }) => (
  <React.Fragment>
    {title && <h3 className="liveblog-feed-title" >{title}</h3>}
    <div className={loading ? 'liveblog-feed is-loading' : 'liveblog-feed'}>
      {
        entries.length === 0 && !loading
          ? <div className="liveblog-empty-message">There are no entries on this page.</div>
          : entries.map(entry => <EntryContainer entry={entry} key={entry.id} />)
      }
    </div>
  </React.Fragment>
);

Entries.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.array,
  loading: PropTypes.bool,
};

export default Entries;
