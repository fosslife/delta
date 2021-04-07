/* eslint-disable jsx-a11y/anchor-has-content */
import { useState, useEffect } from 'react';

function FileUploader() {
    const [showToast, setShowToast] = useState(false);
    const [password, setPassword] = useState('');
    const [expiry, setExpiry] = useState('');
    const [sucessMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showExpires, setShowExpires] = useState(false);
    const [file, setFile] = useState('');
    const [randomKey, setRandomkey] = useState(Math.random().toString(20));
    const [modelAcive, setModalActive] = useState(false);
    const [apikey, setApiKey] = useState('');
    const [clipboardTooltipText, setClipboardTooltipText] = useState(
        'Copy to clipboard'
    );

    useEffect(() => {
        const storedKey = localStorage.getItem('api-key');
        if (!storedKey) {
            setApiKey(false);
        } else {
            setApiKey(storedKey);
        }
    }, []);
    const handleOnExpiresToggle = e => {
        if (!e.target.checked) {
            setExpiry('');
        }
        setShowExpires(!showExpires);
    };

    const handleOnPasswordToggle = e => {
        if (!e.target.checked) {
            setPassword('');
        }
        setShowPassword(!showPassword);
    };
    const handleUpload = async e => {
        e.preventDefault();
        setFile(e.target.files[0]);
        // const files = e.target.files[0];
    };
    const handleOnClipboardClick = () => {
        setClipboardTooltipText('Copied');
        setTimeout(() => {
            setClipboardTooltipText('Copy to clipboard');
        }, 2000);
    };
    const handleSubmit = async e => {
        const formData = new FormData();
        // console.log('File', file);
        if (!file) {
            // console.log('No file selected');
            setShowToast(true);
            setSuccessMessage('Please Select a file to upload');
            return;
        }
        formData.append('file', file);
        if (password) {
            console.log('attaching password', password);
            formData.append('pass', password);
        }
        if (expiry) {
            console.log('adding expiry', expiry);
            formData.append('expires', expiry);
        }
        const res = await fetch('/', {
            method: 'POST',
            headers: {
                'x-delta-type': 'file',
                'api-key': apikey
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
                    <div className="column col-10 col-mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title h5">
                                    <h3>Upload a file</h3>
                                </div>
                                {!apikey ? (
                                    <div className="columns">
                                        <div className="column">
                                            <div className="toast toast-warning">
                                                !! API key is not set !!
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {showToast ? (
                                    <div
                                        style={{ marginTop: '10px' }}
                                        className="toast toast-primary"
                                    >
                                        {sucessMessage !==
                                        'Please Select a file to upload' ? (
                                            <div
                                                style={{
                                                    display: 'flex'
                                                }}
                                            >
                                                <a
                                                    href={sucessMessage}
                                                    target="_new"
                                                >
                                                    {sucessMessage}{' '}
                                                </a>
                                                <div
                                                    className="tooltip tooltip-right"
                                                    data-tooltip={
                                                        clipboardTooltipText
                                                    }
                                                    onClick={
                                                        handleOnClipboardClick
                                                    }
                                                >
                                                    <i
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                sucessMessage
                                                            );
                                                        }}
                                                        className="icon icon-copy "
                                                        style={{
                                                            margin: 'auto 5px'
                                                        }}
                                                    ></i>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>{sucessMessage}</div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div className="card-body">
                                <div className="columns">
                                    <div className="column col-12">
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
                                </div>
                                <div className="columns">
                                    <div className="column col-12">
                                        <ul
                                            className="menu"
                                            style={{ marginTop: '15px' }}
                                        >
                                            {/* <li
                                                className="divider"
                                                data-content="Options"
                                            ></li> */}
                                            <li className="menu-item">
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
                                                    <div className="column">
                                                        <label
                                                            data-tooltip="eg: 2s/5m/3h/4d/1w/12M"
                                                            className="form-checkbox tooltip tooltip-left"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                onChange={
                                                                    handleOnExpiresToggle
                                                                }
                                                            />
                                                            <i className="form-icon"></i>
                                                            expires
                                                        </label>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="menu-item">
                                                <div className="columns">
                                                    <div className="column ">
                                                        {showPassword ? (
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                placeholder="enter password"
                                                                onChange={e => {
                                                                    setPassword(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                value={password}
                                                            ></input>
                                                        ) : null}
                                                    </div>

                                                    <div className="column">
                                                        {showExpires ? (
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                placeholder="enter expiry"
                                                                onChange={e => {
                                                                    setExpiry(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                value={expiry}
                                                            ></input>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <button
                                    style={{ marginTop: '15px' }}
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                                <button
                                    style={{ marginTop: '15px' }}
                                    className="btn btn-primary ml-2"
                                    onClick={() => setModalActive(true)}
                                >
                                    Set or change key
                                </button>
                                <button
                                    style={{ marginTop: '15px' }}
                                    className="btn btn-primary ml-2"
                                    onClick={() => {
                                        localStorage.removeItem('api-key');
                                        setApiKey('');
                                    }}
                                >
                                    Clear stored key
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal ================ */}
            <div
                className={`modal ${modelAcive ? 'active' : ''}`}
                id="modal-id"
            >
                <a
                    href="#close"
                    className="modal-overlay"
                    aria-label="Close"
                ></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a
                            href="#close"
                            className="btn btn-clear float-right"
                            aria-label="Close"
                            onClick={() => setModalActive(false)}
                        ></a>
                        <div className="modal-title h5">set api key</div>
                    </div>
                    <div className="modal-body">
                        <div className="content">
                            <input
                                type="text"
                                onChange={e => {
                                    setApiKey(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setModalActive(false);
                                localStorage.setItem('api-key', apikey);
                            }}
                        >
                            Set key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUploader;
