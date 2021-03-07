import { useState } from 'react';

function FileUploader() {
    const [showToast, setShowToast] = useState(false);
    const [password, setPassword] = useState('');
    const [sucessMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState('');
    const [randomKey, setRandomkey] = useState(Math.random().toString(20));

    const handleOnPasswordChanged = e => {
        setPassword(e.target.value);
    };

    const handleOnPasswordToggle = () => {
        setShowPassword(!showPassword);
    };
    const handleUpload = async e => {
        e.preventDefault();
        setFile(e.target.files[0]);
        // const files = e.target.files[0];
    };
    const handleSubmit = async e => {
        const formData = new FormData();
        console.log('File', file);
        if (!file) {
            console.log('No file selected');
            setShowToast(true);
            setSuccessMessage('Please Select a file to upload');
            return;
        }
        formData.append('file', file);
        if (password) {
            console.log('attaching password', password);
            formData.append('pass', password);
        }
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
                setRandomkey(Math.random().toString(20));
                setFile(null);
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
                                        key={randomKey}
                                        type="file"
                                        id="fileupload"
                                        placeholder="Name"
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="columns">
                                    <div className="column col-5">
                                        <ul className="menu">
                                            <li
                                                className="divider"
                                                data-content="Options"
                                            ></li>
                                            <li className="menu-item">
                                                <div className="">
                                                    <div className="columns">
                                                        <div className="column">
                                                            <label className="form-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={
                                                                        handleOnPasswordToggle
                                                                    }
                                                                />
                                                                <i className="form-icon"></i>
                                                                password
                                                            </label>
                                                        </div>
                                                        {showPassword ? (
                                                            <div className="column">
                                                                <input
                                                                    type="text"
                                                                    className="form-input"
                                                                    placeholder="enter password"
                                                                    onChange={
                                                                        handleOnPasswordChanged
                                                                    }
                                                                    value={
                                                                        password
                                                                    }
                                                                ></input>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="menu-item">
                                                <label className="form-checkbox">
                                                    <input type="checkbox" />
                                                    <i className="form-icon"></i>
                                                    expires
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <button
                                    style={{ marginTop: '15px' }}
                                    className="btn btn-success"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                                {showToast ? (
                                    <div
                                        style={{ marginTop: '10px' }}
                                        className="toast toast-primary"
                                    >
                                        {sucessMessage !==
                                        'Please Select a file to upload' ? (
                                            <a
                                                href={sucessMessage}
                                                target="_new"
                                            >
                                                {sucessMessage}
                                            </a>
                                        ) : (
                                            <div>{sucessMessage}</div>
                                        )}
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
