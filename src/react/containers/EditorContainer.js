/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import { html } from 'js-beautify';
import { debounce } from 'lodash-es';

import { EditorState, ContentState } from 'draft-js';

import * as apiActions from '../actions/apiActions';
import * as userActions from '../actions/userActions';

import { getAuthors, getHashtags, uploadImage } from '../services/api';

import PreviewContainer from './PreviewContainer';
import AuthorSelectOption from '../components/AuthorSelectOption';
import HTMLInput from '../components/HTMLInput';
import PostHeadline from '../components/PostHeadline';
import PostSubtitle from '../components/PostSubtitle';

import Editor, { decorators, convertFromHTML, convertToHTML } from '../Editor/index';

import { getImageSize } from '../Editor/utils';
import KeyEventInput from '../components/KeyEventInput';
import KeyEventURLInput from '../components/KeyEventURLInput';

class EditorContainer extends Component {
  constructor(props) {
    super(props);

    let initialEditorState;
    let initialAuthors;

    if (props.entry) {
      initialEditorState = EditorState.createWithContent(
        convertFromHTML(props.entry.content, {
          setReadOnly: this.setReadOnly.bind(this),
          handleImageUpload: this.handleImageUpload.bind(this),
          defaultImageSize: props.config.default_image_size,
        }),
        decorators,
      );
      initialAuthors = props.entry.authors;
    } else {
      initialEditorState = EditorState.createEmpty(decorators);
      initialAuthors = [props.config.current_user];
    }
    this.state = {
      editorState: initialEditorState,
      suggestions: [],
      authors: initialAuthors,
      mode: 'editor',
      readOnly: false,
      headline: props.entry ? props.entry.headline : '',
      subtitle: props.entry ? props.entry.subtitle : '',
      rawText: props.entry ? props.entry.content : '',
      keyEvent: props.entry ? props.entry.key_event : false,
      keyEventURL: props.entry ? props.entry.key_event_url : '',
      lastUpdate: new Date().getTime(),
    };

    this.onChange = editorState => this.setState({
      editorState,
      rawText: html(convertToHTML(editorState.getCurrentContent())),
    });

    this.clearKeyEvent = () => this.setState({
      keyEvent: false,
    });

    this.clearKeyEventURL = () => this.setState({
      keyEventURL: '',
    });

    this.clearHeadline = () => this.setState({
      headline: '',
    });

    this.clearSubtitle = () => this.setState({
      subtitle: '',
    });

    this.getUsers = debounce(this.getUsers.bind(this), props.config.author_list_debounce_time);
  }

  setReadOnly(state) {
    this.setState({
      readOnly: state,
    });
  }

  getContent() {
    const { editorState } = this.state;
    return convertToHTML(editorState.getCurrentContent());
  }

  syncRawTextToEditorState() {
    this.setState({
      editorState:
        EditorState.createWithContent(
          convertFromHTML(this.state.rawText, {
            setReadOnly: this.setReadOnly.bind(this),
            handleImageUpload: this.handleImageUpload.bind(this),
            defaultImageSize: this.props.config.default_image_size,
          }),
          decorators,
        ),
    });
  }

  publish() {
    const { updateEntry, entry, entryEditClose, createEntry, isEditing } = this.props;
    const { editorState, authors } = this.state;
    const content = this.getContent();
    const authorIds = authors.map(author => author.id);
    const author = authorIds.length > 0 ? authorIds[0] : false;
    const contributors = authorIds.length > 1 ? authorIds.slice(1, authorIds.length) : false;
    const htmlregex = /<(img|picture|video|audio|canvas|svg|iframe|embed) ?.*>/;
    const keyEvent = this.state.keyEvent;
    const keyEventURL = this.state.keyEventURL;
    const headline = this.state.headline;
    const subtitle = this.state.subtitle;

    // We don't want an editor publishing empty entries
    // So we must check if there is any text within the editor
    // If we fail to find text then we should check for a valid
    // list of html elements, mainly visual for example images.
    if (!editorState.getCurrentContent().getPlainText().trim() && !headline && !subtitle ) {
      if (htmlregex.exec(convertToHTML(editorState.getCurrentContent())) === null) {
        return;
      }
    }

    // Prevent publishing of a keyEvent when it doesn't have a headline or subtitle.
    if(keyEvent && (!headline && !subtitle)){
      return;
    }

    if (isEditing) {
      updateEntry({
        id: entry.id,
        content,
        author,
        contributors,
        keyEvent,
        keyEventURL,
        headline,
        subtitle,
      });
      entryEditClose(entry.id);
      return;
    }

    createEntry({
      content,
      author,
      contributors,
      keyEvent,
      keyEventURL,
      headline,
      subtitle,
    });

    const newEditorState = EditorState.push(
      editorState,
      ContentState.createFromText(''),
    );

    this.onChange(newEditorState);
    this.setState({ readOnly: false });
    this.setState({
      lastUpdate: new Date().getTime(),
    });
  }

  onSelectAuthorChange(value) {
    this.setState({
      authors: value,
    });
  }

  onkeyEventChange(value) {
    this.setState({
      keyEvent: value,
    });
  }

  onkeyEventURLChange(value) {
    this.setState({
      keyEventURL: value,
    });
  }
  
  onHeadlineChange(value) {
    this.setState({
      headline: value,
    });
  }

  onSubtitleChange(value) {
    this.setState({
      subtitle: value,
    });
  }

  getUsers(text, callback) {
    const { config } = this.props;
    getAuthors(text, config)
      .timeout(10000)
      .map(res => res.response)
      .subscribe(res => callback(null, {
        options: res,
        complete: false,
      }));
  }

  getAuthors(text) {
    const { config } = this.props;
    getAuthors(text, config)
      .timeout(10000)
      .map(res => res.response)
      .subscribe(res => this.setState({
        suggestions: res.map(author => author),
      }));
  }

  getHashtags(text) {
    const { config } = this.props;
    getHashtags(text, config)
      .timeout(10000)
      .map(res => res.response)
      .subscribe(res => this.setState({
        suggestions: res.map(hashtag => hashtag),
      }));
  }

  filterCommandSuggestions(suggestions, filter) {
    this.setState({
      suggestions: suggestions.filter(item =>
        item.substring(0, filter.length) === filter,
      ),
    });
  }

  filterEmojiSuggestions(suggestions, filter) {
    this.setState({
      suggestions: suggestions.filter(item =>
        item.key.toString().substring(0, filter.length) === filter,
      ),
    });
  }

  handleOnSearch(trigger, text) {
    const { config } = this.props;

    switch (trigger) {
      case '@':
        this.getAuthors(text);
        break;
      case '#':
        this.getHashtags(text);
        break;
      case '/':
        this.filterCommandSuggestions(config.autocomplete[0].data, text);
        break;
      case ':':
        this.filterEmojiSuggestions(config.autocomplete[1].data, text);
        break;
      default:
        this.setState({ suggestions: [] });
        break;
    }
  }

  handleImageUpload(file) {
    const { config } = this.props;

    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('action', 'upload-attachment');
    formData.append('_wpnonce', config.image_nonce);
    formData.append('async-upload', file);

    return new Promise((resolve) => {
      uploadImage(formData)
        .timeout(60000)
        .map(res => res.response)
        .subscribe((res) => {
          const src = getImageSize(res.data.sizes, config.default_image_size);
          resolve(src);
        });
    });
  }

  authorsBlock(authors) {
    return (
      <React.Fragment>
        <h2 className="liveblog-editor-subTitle">Authors:</h2>
        <Async
          multi={true}
          value={authors}
          valueKey="key"
          labelKey="name"
          onChange={this.onSelectAuthorChange.bind(this)}
          optionComponent={AuthorSelectOption}
          loadOptions={this.getUsers}
          clearable={false}
          cache={false}
        />
      </React.Fragment>
    );
  }

  render() {
    const {
      editorState,
      suggestions,
      mode,
      authors,
      readOnly,
      keyEvent,
      keyEventURL,
      headline,
      subtitle,
      lastUpdate
    } = this.state;

    const { isEditing, config } = this.props;

    return (
      <div className="liveblog-editor-container">
        {!isEditing && <h1 className="liveblog-editor-title">Add New Entry</h1>}
        <PostHeadline
          onChange={this.onHeadlineChange.bind(this)}
          headline={headline}
          lastUpdate={lastUpdate}
          clearHeadline={this.clearHeadline.bind(this)}
        />
        <PostSubtitle
          onChange={this.onSubtitleChange.bind(this)}
          subtitle={subtitle}
          lastUpdate={lastUpdate}
          clearSubtitle={this.clearSubtitle.bind(this)}
        />
        <div className="liveblog-editor-tabs">
          <button
            className={`liveblog-editor-tab ${mode === 'editor' ? 'is-active' : ''}`}
            onClick={(e) => { e.preventDefault(); this.setState({ mode: 'editor' }); } }          >
            Visual
          </button>
          <button
            className={`liveblog-editor-tab ${mode === 'raw' ? 'is-active' : ''}`}
            onClick={(e) => { e.preventDefault(); this.setState({ mode: 'raw' }); } }          >
              Text
          </button>
          <button
            className={`liveblog-editor-tab ${mode === 'preview' ? 'is-active' : ''}`}
            onClick={(e) => { e.preventDefault(); this.setState({ mode: 'preview' }); } }          >
              Preview
          </button>
        </div>
        {
          mode === 'preview' &&
          <PreviewContainer
            config={config}
            getEntryContent={() => this.getContent()}
          />
        }
        {
          mode === 'editor' &&
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            suggestions={suggestions}
            resetSuggestions={() => this.setState({ suggestions: [] })}
            onSearch={(trigger, text) => this.handleOnSearch(trigger, text)}
            autocompleteConfig={config.autocomplete}
            handleImageUpload={this.handleImageUpload.bind(this)}
            readOnly={readOnly}
            setReadOnly={this.setReadOnly.bind(this)}
            defaultImageSize={config.default_image_size}
          />
        }
        {
          mode === 'raw' &&
          <HTMLInput
            value={this.state.rawText}
            onChange={(text) => {
              this.setState({ rawText: text }, () => {
                this.syncRawTextToEditorState();
              });
            }}
            height="275px"
            width="100%"
          />
        }
        <KeyEventInput
          onChange={this.onkeyEventChange.bind(this)}
          checked={keyEvent}
          lastUpdate={lastUpdate}
          clearKeyEvent={this.clearKeyEvent.bind(this)}
        />

        <KeyEventURLInput
          onChange={this.onkeyEventURLChange.bind(this)}
          keyEventURL={keyEventURL}
          lastUpdate={lastUpdate}
          clearKeyEventURL={this.clearKeyEventURL.bind(this)}
        />
        
        {!config.hide_author_input && this.authorsBlock(authors)}

        <button className="liveblog-btn liveblog-publish-btn" onClick={this.publish.bind(this)}>
          {isEditing ? 'Publish Update' : 'Publish New Entry'}
        </button>
      </div>
    );
  }
}

EditorContainer.propTypes = {
  config: PropTypes.object,
  updateEntry: PropTypes.func,
  entry: PropTypes.object,
  entryEditClose: PropTypes.func,
  createEntry: PropTypes.func,
  isEditing: PropTypes.bool,
  authors: PropTypes.array,
  getAuthors: PropTypes.func,
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    ...apiActions,
    ...userActions },
  dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
