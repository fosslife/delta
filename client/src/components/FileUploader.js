import { useState } from 'react';

function FileUploader() {
    const [showToast, setShowToast] = useState(false);
    const [sucessMessage, setSuccessMessage] = useState('');
    const handleUpload = async e => {
        e.preventDefault();
        const files = e.target.files[0];
        const formData = new FormData();
        formData.append('file', files);
        const res = await fetch('/', {
            method: 'POST',
            headers: {
                'x-delta-type': 'file',
                'api-key': 'spark1234'
            },
            body: formData
        })
            .then(data => {
                setShowToast(true);
                return data.text();
            })
            .catch(error => {
                console.error(error);
            });
        setSuccessMessage(res);
    };
    return (
        <div id="fileuploader">
            <div className="container mt-2">
                <div className="columns">
                    <div className="column col-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title h5">
                                    <h3>Upload a file</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="fileupload"
                                    >
                                        Select a file
                                    </label>
                                    <input
                                        className="form-input"
                                        onChange={handleUpload}
                                        type="file"
                                        id="fileupload"
                                        placeholder="Name"
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="columns">
                                    <div className="column col-3">
                                        <ul className="menu">
                                            <li
                                                className="divider"
                                                data-content="Options"
                                            ></li>
                                            <li className="menu-item">
                                                <label className="form-checkbox">
                                                    <input type="checkbox" />
                                                    <i className="form-icon"></i>
                                                    form-checkbox
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {showToast ? (
                                    <div
                                        className="toast toast-success"
                                        style={{ marginTop: '20px' }}
                                    >
                                        <a href={sucessMessage} target="_new">
                                            {sucessMessage}
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUploader;
