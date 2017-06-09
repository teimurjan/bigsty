import React from 'react';
import PropTypes from 'prop-types';

class FileInput extends React.Component {
    static propTypes = {
        onLoad: PropTypes.func.isRequired
    };

    state = {
        fileName: ''
    };

    onFileUpload = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onload = () => {
            this.props.onLoad(reader.result);
            this.setState({fileName: file.name});
        };
        reader.readAsDataURL(file);
    };

    render() {
        const fileExists = this.state.fileName !== '';
        const fileInputClass = `fileinput-${fileExists ? 'exists' : 'new'}`;
        return (
            <div className={`fileinput ${fileInputClass} input-group`}>
                <div className="form-control">
                    <i className="glyphicon glyphicon-file fileinput-exists m-r-sm"/>
                    <span className="fileinput-filename">{this.state.fileName}</span>
                </div>
                <span className="input-group-addon btn btn-default btn-file">
                    <span className="fileinput-new">Select file</span>
                    <span className="fileinput-exists">Change</span>
                    <input type="file" name="" onChange={this.onFileUpload} accept="image/*"/>
                </span>
                <a href="#" className="input-group-addon btn btn-default fileinput-exists">Remove</a>
            </div>
        );
    }
}

export default FileInput;
