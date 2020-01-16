import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import * as mapActions from 'webmap-sdk/actions/map';

/** Component for user to upload a mapbox style doc
 * or enter a URL.
 */
class ContextSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: false,
      message: '',
      badurl: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearError = this.clearError.bind(this);
    this.dropFiles = this.dropFiles.bind(this);
  }

  clearError() {
    this.setState({error: false, message: '', badurl: ''});
  }

  setError(msg) {
    this.setState({error: true, message: msg});
  }

  addMap(context) {
    this.clearError();
    this.props.setContext(context);
  }

  dropFiles(event) {
    this.clearError();
    const files = event.target.files;
    if (files.length === 1) {
      const r = new FileReader();
      const file = files[0];
      let result;
      r.onload = () => {
        try {
          result = JSON.parse(r.result);
          this.addMap({json: result});
        } catch (e) {
          this.setError(e.message);
        }
      };
      r.onerror = () => {
        this.setError(r.error);
      };
      r.readAsText(file);
    }
    event.preventDefault();
  }

  handleChange(event) {
    this.clearError();
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.clearError();
    fetch (this.state.value)
      .then(
        response => {
          if (response.status >= 400) {
            this.setState({badurl: response.url});
            const msg = `${response.status} (${response.statusText})`;
            this.setError(msg);
          } else {
            response.json().then(json => {
              this.addMap({json});
            }).catch((e) => {
              this.setError(e);
            });
          }
        }).catch((e) => {
        this.setError(e);
      });
    event.preventDefault();
  }

  render() {
    let errormsg;
    if (this.state.error === true) {
      errormsg = (<p className='error'><strong>Error uploading map:</strong> <a href={this.state.badurl}>{this.state.badurl}</a> {this.state.message}</p>);
    }
    return (
      <div>
        <div className='selector'>
          <h1 className='title'>Upload a Map</h1>
          { errormsg }
        </div>
        <div className='selector'>
          <div className='url'>
            <h2>Via URL: </h2>
            <form onSubmit={this.handleSubmit}>
              <input className='urlinput' id='urlField' placeholder='Provide a URL to render the map above' type='text' value={this.state.value} onChange={this.handleChange} />
              <button className='sdk-btn' type='submit'>Update Map</button>
            </form>
          </div>
          <div className='drop'>
            <h2>Via File Upload:</h2>
            <label htmlFor='file_upload' onClick={this.clearError}>Choose a file to upload (.json)</label>
            <input id='file_upload' type='file' accept='.json' onChange={this.dropFiles}/>
          </div>
        </div>
      </div>
    );
  }
}

ContextSelector.propTypes = {
  setContext: PropTypes.func,
};

ContextSelector.defaultProps = {
  setContext: () => { },
};

function mapDispatch(dispatch) {
  return {
    setContext: (context) => {
      dispatch(mapActions.fetchContext(context));
    },
  };
}

export default connect(null, mapDispatch)(ContextSelector);
